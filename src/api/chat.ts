import { get, post } from "../utils/http/request";

export interface StaffMember {
    id: string;
    name: string;
    accountName: string;
    department: string;
    role: string;
}

export interface ChatMessage {
    id: string;
    from: string;
    to: string;
    content: string;
    time: string;
}

export function getStaffList() {
    return get("/chat/v2/staff");
}

export function getChatMessages(friendId: string) {
    return get("/chat/v2/messages", { friendId });
}

export function sendChatMessage(data: { to: string; content: string }) {
    return post("/chat/v2/send", data);
}

export function saveChatMessage(data: ChatMessage) {
    return post("/chat/v2/save", data);
}
