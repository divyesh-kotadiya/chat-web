import React, { useEffect, useRef, useState } from "react";
import RecieverMessage from "./RecieverMessage";
import SenderMessage from "./SenderMessage";
import { useSelector } from "react-redux";
import Advertisement from "./Advertisement";
import CircularLoading from "./CircularLoading";
import { isSender } from "../../helper/Reusable";
import { socket } from "../../socket/socket";
import { InitializeChatMessages } from "../../services/Actions/Chat/action";
import { useDispatch } from "react-redux";
import { AddMessage } from "../../services/Actions/Chat/action";
import EmptyMessages from "./EmptyMessages";
import { moveChatToTop } from "../../services/Actions/Chat/action";
import { updateChatBar } from "../../services/Actions/Chat/action";
import useSound from "use-sound";
import { addIncomingUserChatBar } from "../../services/Actions/Chat/action";
import { updateMessageReaction } from "../../services/Actions/Chat/action";
import { format, isToday, isYesterday } from "date-fns";
import { MessagesApi } from "../../api/messagesApi";
import notifySound from "../../assets/sounds/whatsapp-message.mp3";
import AddReaction from "../../assets/sounds/reationSound.wav";

export default function ChatMessages() {
  const dispatch = useDispatch();
  const isSet = useSelector((state) => state.chat.activeChat);
  const AllChats = useSelector((state) => state.chat.AllChats);
  const data = useSelector((state) => state.chat.activeChatMessages);
  const div = useRef(null);
  const [play] = useSound(notifySound);
  const [PlayReatcionSound] = useSound(AddReaction);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loggedUser = JSON.parse(localStorage.getItem("info"));
    socket.emit("setup", loggedUser);
  }, []);

    useEffect(() => {
      const messageFn = (newMessageRecieved) => {
      const isChatBarPresent = AllChats.find(
        (val) => val._id === newMessageRecieved.chat._id
      );
      if (!isChatBarPresent) {
        dispatch(addIncomingUserChatBar(newMessageRecieved.chat));
        dispatch(
          updateChatBar(newMessageRecieved.chat._id, newMessageRecieved.content)
        );
        return;
      }

      play();
      if (isSet !== null && isSet._id !== newMessageRecieved.chat._id) {
        dispatch(moveChatToTop(newMessageRecieved.chat._id));
        dispatch(
          updateChatBar(newMessageRecieved.chat._id, newMessageRecieved.content)
        );
      } else if (isSet !== null && isSet._id === newMessageRecieved.chat._id) {
        dispatch(AddMessage(newMessageRecieved));
        dispatch(moveChatToTop(newMessageRecieved.chat._id));
        dispatch(
          updateChatBar(newMessageRecieved.chat._id, newMessageRecieved.content)
        );
      } else if (isSet === null) {
        dispatch(moveChatToTop(newMessageRecieved.chat._id));
        dispatch(
          updateChatBar(newMessageRecieved.chat._id, newMessageRecieved.content)
        );
      }
    };

    const reactionFn = (updatedMessage) => {;
      if (isSet !== null && isSet._id === updatedMessage.chat._id) {
            PlayReatcionSound()
            dispatch(updateMessageReaction(updatedMessage));
      }
    };

    socket.on("message recieved", messageFn);
    socket.on("reaction recieved", reactionFn);
    return () => {
      socket.off("message recieved", messageFn);
      socket.off("reaction recieved", reactionFn);
    };
  }, [isSet, dispatch, AllChats, play]);

  useEffect(() => {
    if (isSet === null) return;

    const getData = async () => {
      setIsLoading(true);
      const { data } = await MessagesApi.getAllMessages(isSet._id);

      if (data.status === "success") {
        dispatch(InitializeChatMessages(data.message));
      }
      setIsLoading(false);
    };
    getData();
  }, [isSet, dispatch]);

  useEffect(() => {
    if (data.length === 0) return;

    let timer;

    if (div.current) {
      timer = setTimeout(() => {
        div.current.scrollTop = div.current.scrollHeight;
      }, 0);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [data]);
  
  if (isSet === null) return <Advertisement></Advertisement>;
  
  const formatDateHeader = (date) => {
    const messageDate = new Date(date);
   
    if (isToday(messageDate)) {
      return "Today";
    } else if (isYesterday(messageDate)) {
      return "Yesterday";
    } else {
      return format(messageDate, "d MMMM yyyy");
    }
  };

  const isMessageNewDay = (current, previous) =>
    !previous ||
  formatDateHeader(current.createdAt) !==
  formatDateHeader(previous.createdAt);

  

  return (
    <div
      ref={div}
      className="w-[100%] h-[88%] px-[3%] overflow-y-scroll no-scrollbar py-[2%] box-border relative flex flex-col"
    >
      {isLoading && <CircularLoading></CircularLoading>}
      {!isLoading && data.length === 0 && <EmptyMessages></EmptyMessages>}
      {!isLoading && data.length > 0 && (
        <>
          {data.map((val, index) => {
            const showDateHeader = isMessageNewDay(val, data[index - 1]);
            return (
              <div key={index}>
                {showDateHeader && (
                  <div className="flex justify-center">
                    <div className=" rounded-md px-2.5 py-1.5 my-4 bg-slate-200 text-slate-600 font-normal text-sm">
                      {formatDateHeader(val.createdAt)}
                    </div>
                  </div>
                )}
                {isSender(val.sender._id) ? (
                  <SenderMessage
                    time={val.createdAt}
                    content={val.content}
                    reactions={val.reactions || []}
                    isGroupChat={isSet.isGroupChat}
                    key={index}
                  ></SenderMessage>
                ) : (
                  <RecieverMessage
                    isGroupChat={isSet.isGroupChat}
                    name={val.sender.name}
                    img={val.sender.pic}
                    messages={data}
                    index={index}
                    content={val.content}
                    time={val.createdAt}
                    messageId={val._id}
                    reactions={val.reactions || []}
                    key={index}
                  ></RecieverMessage>
                )}
              </div>
            );
          })}
        </>
      )}
    </div>
  );
}
