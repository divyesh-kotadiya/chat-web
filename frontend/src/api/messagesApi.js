import http from "./http";

export const MessagesApi = {

    sendMessage: (bodyData) => http.post("/message",bodyData),

    getAllMessages: (id) => http.get(`/message/${id}`),

    messageReaction: (bodyData) => http.post('/message/reaction', bodyData),
}