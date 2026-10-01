//获取设备数据的接口
import { post } from "../utils/http/request";

interface SearchData {
    name: string;
    person: string;
    page: number;
    pageSize: number
}

export function getEquipmentList(data: SearchData) {
    return post("/equipmentList", data)
}