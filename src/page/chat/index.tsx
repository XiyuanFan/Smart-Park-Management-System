import { Avatar, Badge, Button, Card, Empty, Input, List, Space, Typography } from "antd";
import { SendOutlined, UserOutlined } from "@ant-design/icons";
import { useEffect, useState } from "react";
import { ChatMessage, StaffMember, getStaffList } from "../../api/chat";
import "./index.scss";

const { Text, Title } = Typography;

const CHAT_CHANNEL = "smart-park-private-chat";
const PRESENCE_CHANNEL = "smart-park-chat-presence";
const CHAT_STORAGE_KEY = "smart-park-chat-messages";

function getConversationKey(userA: string, userB: string) {
    return [userA, userB].sort().join("__");
}

function readStoredMessages(): Record<string, ChatMessage[]> {
    try {
        return JSON.parse(localStorage.getItem(CHAT_STORAGE_KEY) || "{}");
    } catch {
        return {};
    }
}

function readConversationMessages(userA: string, userB: string) {
    return readStoredMessages()[getConversationKey(userA, userB)] || [];
}

function saveMessageToStorage(message: ChatMessage) {
    const conversationKey = getConversationKey(message.from, message.to);
    const storedMessages = readStoredMessages();
    const currentMessages = storedMessages[conversationKey] || [];

    if (currentMessages.some(item => item.id === message.id)) {
        return;
    }

    localStorage.setItem(CHAT_STORAGE_KEY, JSON.stringify({
        ...storedMessages,
        [conversationKey]: [...currentMessages, message],
    }));
}

function getUniqueStaff(list: StaffMember[]) {
    return Array.from(new Map(list.map(item => [item.accountName, item])).values());
}

function Chat() {
    const [staffList, setStaffList] = useState<StaffMember[]>([]);
    const [activeStaff, setActiveStaff] = useState<StaffMember | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [onlineAccounts, setOnlineAccounts] = useState<string[]>([]);
    const [currentAccountName] = useState(() => sessionStorage.getItem("accountName") || "");
    const [currentUserName] = useState(() => sessionStorage.getItem("username") || "当前用户");

    const loadMessages = (friendId: string) => {
        setLoading(true);
        setMessages(readConversationMessages(currentAccountName, friendId));
        setLoading(false);
    };

    useEffect(() => {
        async function initChat() {
            const { data } = await getStaffList();
            const uniqueStaff = getUniqueStaff(data);
            setStaffList(uniqueStaff);

            if (uniqueStaff.length) {
                setActiveStaff(uniqueStaff[0]);
                setMessages(readConversationMessages(currentAccountName, uniqueStaff[0].id));
            }
        }

        initChat();
    }, [currentAccountName]);

    useEffect(() => {
        if (!currentAccountName || !activeStaff) {
            return;
        }

        const handleStorage = (event: StorageEvent) => {
            if (event.key === CHAT_STORAGE_KEY) {
                setMessages(readConversationMessages(currentAccountName, activeStaff.id));
            }
        };

        window.addEventListener("storage", handleStorage);

        return () => {
            window.removeEventListener("storage", handleStorage);
        };
    }, [activeStaff, currentAccountName]);

    useEffect(() => {
        if (!currentAccountName || !("BroadcastChannel" in window)) {
            return;
        }

        const channel = new BroadcastChannel(CHAT_CHANNEL);
        channel.onmessage = (event) => {
            const incomingMessage = event.data as ChatMessage;

            if (incomingMessage.to !== currentAccountName) {
                return;
            }

            saveMessageToStorage(incomingMessage);
            if (activeStaff?.id === incomingMessage.from) {
                setMessages(prev => prev.some(item => item.id === incomingMessage.id) ? prev : [...prev, incomingMessage]);
            }
        };

        return () => {
            channel.close();
        };
    }, [activeStaff?.id, currentAccountName]);

    useEffect(() => {
        if (!currentAccountName || !("BroadcastChannel" in window)) {
            setOnlineAccounts(currentAccountName ? [currentAccountName] : []);
            return;
        }

        const onlineSet = new Set<string>([currentAccountName]);
        const channel = new BroadcastChannel(PRESENCE_CHANNEL);
        const syncOnlineAccounts = () => setOnlineAccounts(Array.from(onlineSet));
        const announce = (type: "online" | "offline" | "ping") => {
            channel.postMessage({ type, accountName: currentAccountName });
        };

        channel.onmessage = (event) => {
            const { type, accountName } = event.data || {};
            if (!accountName || accountName === currentAccountName) {
                return;
            }

            if (type === "online" || type === "ping") {
                onlineSet.add(accountName);
                syncOnlineAccounts();
                if (type === "online") {
                    announce("ping");
                }
            }

            if (type === "offline") {
                onlineSet.delete(accountName);
                syncOnlineAccounts();
            }
        };

        syncOnlineAccounts();
        announce("online");

        return () => {
            announce("offline");
            channel.close();
        };
    }, [currentAccountName]);

    const selectStaff = (staff: StaffMember) => {
        setActiveStaff(staff);
        loadMessages(staff.id);
    };

    const handleSend = () => {
        const text = content.trim();
        if (!activeStaff || !text || !currentAccountName) {
            return;
        }

        setSending(true);

        const message: ChatMessage = {
            id: `${currentAccountName}-${activeStaff.id}-${Date.now()}`,
            from: currentAccountName,
            to: activeStaff.id,
            content: text,
            time: new Date().toLocaleTimeString("zh-CN", {
                hour: "2-digit",
                minute: "2-digit",
                hour12: false,
            }),
        };

        saveMessageToStorage(message);
        setMessages(prev => prev.some(item => item.id === message.id) ? prev : [...prev, message]);
        setContent("");

        if ("BroadcastChannel" in window) {
            const channel = new BroadcastChannel(CHAT_CHANNEL);
            channel.postMessage(message);
            channel.close();
        }

        setSending(false);
    };

    return (
        <div className="chat-page">
            <Card className="chat-card">
                <div className="chat-layout">
                    <Card className="friend-panel" title="内部通讯录" bordered={false}>
                        <Text type="secondary">
                            系统用户默认互为好友。绿色圆点表示该账号当前有打开的登录页面。
                        </Text>

                        <List
                            className="friend-list mt"
                            dataSource={staffList}
                            renderItem={(staff) => {
                                const isOnline = onlineAccounts.includes(staff.accountName);
                                return (
                                    <List.Item
                                        className={`friend-item ${activeStaff?.id === staff.id ? "active" : ""}`}
                                        onClick={() => selectStaff(staff)}
                                    >
                                        <List.Item.Meta
                                            avatar={
                                                <Badge status={isOnline ? "success" : "default"} dot>
                                                    <Avatar icon={<UserOutlined />} />
                                                </Badge>
                                            }
                                            title={`${staff.name}（${staff.accountName}）`}
                                            description={`${staff.department} / ${staff.role} / ${isOnline ? "在线" : "离线"}`}
                                        />
                                    </List.Item>
                                );
                            }}
                        />
                    </Card>

                    <div className="message-panel">
                        {activeStaff ? (
                            <>
                                <div className="message-header">
                                    <Space direction="vertical" size={0}>
                                        <Title level={5}>{activeStaff.name}（{activeStaff.accountName}）</Title>
                                        <Text type="secondary">
                                            {activeStaff.department} / {activeStaff.role} / {onlineAccounts.includes(activeStaff.accountName) ? "在线" : "离线"}
                                        </Text>
                                    </Space>
                                </div>

                                <div className="message-list">
                                    {loading ? (
                                        <Empty description="消息加载中" />
                                    ) : messages.length ? (
                                        messages.map(item => {
                                            const isMine = item.from === currentAccountName;
                                            return (
                                                <div className={`message-row ${isMine ? "mine" : ""}`} key={item.id}>
                                                    <div className="message-bubble">
                                                        <div className="message-meta">
                                                            {isMine ? currentUserName : activeStaff.name} · {item.time}
                                                        </div>
                                                        <div>{item.content}</div>
                                                    </div>
                                                </div>
                                            );
                                        })
                                    ) : (
                                        <Empty description="暂无聊天记录，发送第一条消息" />
                                    )}
                                </div>

                                <div className="message-input">
                                    <Input.TextArea
                                        rows={3}
                                        value={content}
                                        placeholder="输入消息，Enter 发送，Shift + Enter 换行"
                                        onChange={(event) => setContent(event.target.value)}
                                        onPressEnter={(event) => {
                                            if (!event.shiftKey) {
                                                event.preventDefault();
                                                handleSend();
                                            }
                                        }}
                                    />
                                    <div className="tr mt">
                                        <Button
                                            type="primary"
                                            icon={<SendOutlined />}
                                            loading={sending}
                                            onClick={handleSend}
                                        >
                                            发送
                                        </Button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <Empty description="暂无可聊天用户" />
                        )}
                    </div>
                </div>
            </Card>
        </div>
    );
}

export default Chat;
