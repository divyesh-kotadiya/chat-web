import http from "./http";

export const chatAPI = {

   createGroup: (bodyData) => http.post("/chat/group", bodyData),

   GroupRename: (bodyData) => http.put("/chat/rename", bodyData),

   GroupAdd: (bodyData) => http.put("/chat/groupadd", bodyData),

   GroupRemove: (bodyData) => http.put('/chat/groupremove', bodyData),

   ChatRemove: (bodyData) => http.delete("/chat/deleteChat", bodyData),

   fetchAllChat: () => http.get("/chat"),

   addUser: (bodyData) => http.post("/chat", bodyData),
   
};
