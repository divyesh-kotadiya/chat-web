import React, { useState } from "react";
import { Avatar, IconButton, Tooltip, Popover } from "@mui/material";
import { isSameUser } from "../../helper/Reusable";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { socket } from "../../socket/socket";
import { useDispatch } from "react-redux";
import { updateMessageReaction } from "../../services/Actions/Chat/action";
import { MessagesApi } from "../../api/messagesApi";
import useSound from "use-sound";
import AddReaction from "../../assets/sounds/reationSound.wav";
import RemoveReaction from '../../assets/sounds/notification.mp3'
export default function RecieverMessage({
  img,
  content,
  messages,
  index,
  name,
  isGroupChat,
  time,
  messageId,
  reactions = [],
}) {
  const messageTime = new Date(time);
  const [anchorEl, setAnchorEl] = useState(null);
  const dispatch = useDispatch();
  const loggedUser = JSON.parse(localStorage.getItem("info"));
  const [PlayReatcionSound] = useSound(AddReaction);
  const [PlayremoveReactionSound] = useSound(RemoveReaction);
  const handleReactionClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleEmojiSelect = async (emoji) => {
    handleClose();
    const bodyData = {
      messageId: messageId,
      emoji: emoji.native,
    }
    try {
      const { data } = await MessagesApi.messageReaction(bodyData);
      if (data.status === "success") {
        dispatch(updateMessageReaction(data.data));
        socket.emit("reaction updated", data.data);
        PlayReatcionSound();
      }
    } catch (error) {
      console.error("Error adding reaction:", error);
    }
  };

  const handleReactionToggle = async (emoji) => {
    const bodyData = {
      messageId: messageId,
      emoji
    }
    
    try {
      const { data } = await MessagesApi.messageReaction(bodyData);
      if (data.status === "success") {
        dispatch(updateMessageReaction(data.data));
        socket.emit("reaction updated", data.data);
        PlayremoveReactionSound();
      }
    } catch (error) {
      console.error("Error toggling reaction:", error);
    }
  };

  const hasUserReacted = (reaction) => {
    if (!reaction.users || reaction.users.length === 0) return false;
    return reaction.users.some((user) => {
      const userId = typeof user === 'object' ? user._id : user;
      return userId === loggedUser._id || userId?.toString() === loggedUser._id;
    });
  };

  const open = Boolean(anchorEl);

  if (isSameUser(messages, index) && isGroupChat) {
    return (
      <div className="flex flex-col group">
        <div className="flex flex-row justify-start my-1">
          <div className="bg-[#FFFFFF]  rounded-tr-xl ml-[45px] font-Roboto rounded-br-xl rounded-bl-xl box-border px-2 py-2  max-[900px]:text-sm flex justify-between">
            <div>
              {content}
            </div>
            <p className=" text-[11px] pl-2 pt-3 flex items-end font-medium">{`${String(messageTime.getHours() % 12 || 12).padStart(2, '0')}:${String(messageTime.getMinutes()).padStart(2, '0')} ${messageTime.getHours() >= 12 ? 'pm' : 'am'}`}</p>
          </div>
          <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
            <Tooltip title="Add reaction" arrow>
              <IconButton
                size="small"
                onClick={handleReactionClick}
                sx={{ padding: "4px", marginLeft: "4px" }}
              >
                <AddReactionIcon sx={{ fontSize: 16, color: "#666" }} />
              </IconButton>
            </Tooltip>
          </div>
        </div>
        {reactions && reactions.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1 ml-[45px]">
            {reactions.map((reaction, idx) => {
              const userReacted = hasUserReacted(reaction);
              return (
                <Tooltip
                  key={idx}
                  title={isGroupChat ? `${reaction.users.length} ${reaction.users.length === 1 ? "reaction" : "reactions"}` : ""}
                  arrow
                >
                  <button
                    onClick={() => handleReactionToggle(reaction.emoji)}
                    className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs transition-colors ${
                      userReacted
                        ? "bg-blue-100 border-blue-300"
                        : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                    } ${!isGroupChat ? 'px-1.5' : ''}`}
                  >
                    <span>{reaction.emoji}</span>
                    {isGroupChat && (
                      <span className="text-gray-600">{reaction.users.length}</span>
                    )}
                  </button>
                </Tooltip>
              );
            })}
          </div>
        )}
        <Popover
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "left",
          }}
        >
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="light"
            previewPosition="none"
          />
        </Popover>
      </div>
    );
  }

  return (
    <div className="max-w-[60%] group">
      <div className="flex flex-row justify-start my-1">
        {isGroupChat && (
          <Tooltip title={name} arrow placement="top-start">
            <Avatar
              referrerPolicy="no-referrer"
              src={
                img.startsWith("user")
                  ? `${process.env.REACT_APP_API_URL}/${img}`
                  : img
              }
            ></Avatar>
          </Tooltip>
        )}
        <div className="bg-[#FFFFFF] max-w-[100%] relative rounded-tr-lg ml-[1%] font-Roboto rounded-br-lg rounded-bl-lg box-border px-2 pt-2 pb-2 flex flex-col items-end justify-between max-[900px]:text-sm">
          <p className="w-[100%] min-w-[50px] pe-5 pb-2" style={{wordWrap:"break-word"}}>{content}</p>
          <p className="absolute bottom-[3px] right-2 text-[9px] pl-2 flex items-end font-medium">{`${String(messageTime.getHours() % 12 || 12).padStart(2, '0')}:${String(messageTime.getMinutes()).padStart(2, '0')} ${messageTime.getHours() >= 12 ? 'pm' : 'am'}`}</p>
        </div>
        <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center">
          <Tooltip title="Add reaction" arrow>
            <IconButton
              size="small"
              onClick={handleReactionClick}
              sx={{ padding: "4px", marginLeft: "4px" }}
            >
              <AddReactionIcon sx={{ fontSize: 16, color: "#666" }} />
            </IconButton>
          </Tooltip>
        </div>
      </div>
      {reactions && reactions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1" style={{ marginLeft: isGroupChat ? "45px" : "0" }}>
          {reactions.map((reaction, idx) => {
            const userReacted = hasUserReacted(reaction);
            return (
              <Tooltip
                key={idx}
                title={isGroupChat ? `${reaction.users.length} ${reaction.users.length === 1 ? "reaction" : "reactions"}` : ""}
                arrow
              >
                <button
                  onClick={() => handleReactionToggle(reaction.emoji)}
                  className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs transition-colors ${
                    userReacted
                      ? "bg-blue-100 border-blue-300"
                      : "bg-gray-100 border-gray-300 hover:bg-gray-200"
                  } ${!isGroupChat ? 'px-1.5' : ''}`}
                >
                  <span>{reaction.emoji}</span>
                  {isGroupChat && (
                    <span className="text-gray-600">{reaction.users.length}</span>
                  )}
                </button>
              </Tooltip>
            );
          })}
        </div>
      )}
      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
      >
        <Picker
          data={data}
          onEmojiSelect={handleEmojiSelect}
          theme="light"
          previewPosition="none"
        />
      </Popover>
    </div>
  );
}
