import { instance } from "./instance";

export interface MessageVO {
    /**
     * 消息id
     */ 
    id: number;
    /**
     * 消息发送方在后台服务器的编号
     */
    send_user: string;
    /**
     * 消息内容
     */
    message: string;
    /**
     * 消息时间戳
     */
    send_time: string;
    /**
     * 消息接收方在后台服务器的编号
     */
    receive_user: string;
    /**
     * 消息类型，发送/接收
     */
    message_type: string;
    /**
     * 用户头像
     */
    avatar: string;
}

export interface ContactVO {
    userid: string;
    avatar: string;
}

const getMessage = async () => {
    const result = await instance.get<MessageVO[]>('/api/notifications', {});
    // uni.setStorageSync('message', result.data);
    return result;
}

const sendMessage = async (target: string, message: string) => {
    const result = await instance.post('/api/notifications', {
        receive_user: target,
        message: message
    });
    return result;
}

export default {
    getMessage,
    sendMessage
};