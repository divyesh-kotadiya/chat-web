import React from "react";
import Tooltip from "@mui/material/Tooltip";

export default function SenderMessage({ time, content, reactions = [], isGroupChat = false }) {
  const messageTime = new Date(time);

  return (
    <div className="max-w-[60%] ml-auto h-auto">
      <div className="flex flex-row relative justify-end my-1 max-w-[100%] h-auto">
        <div className="bg-[#014DFE] min-w-[50px] max-w-[100%] rounded-tl-lg font-Roboto rounded-bl-xl rounded-br-lg rouned-bl-lg text-white box-border px-2 pe-5 py-2 flex flex-col flex-wrap items-end justify-around max-[900px]:text-sm mr-2"> 
          <p className="w-[100%] text-left text-wrap mr-5 mb-2" style={{wordWrap:"break-word"}}>{content}</p>
          <p className="absolute bottom-[3px] right-4 text-[9px] pl-2 flex items-end font-normal">{`${String(messageTime.getHours()%12 || 12).padStart(2,'0')}:${String(messageTime.getMinutes()).padStart(2,'0')} ${messageTime.getHours()>=12?'pm':'am'}`}</p>
        </div>
      </div>
      {reactions && reactions.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1 justify-end mr-2">
          {reactions.map((reaction, index) => (
            <Tooltip
              key={index}
              title={isGroupChat ? `${reaction.users.length} ${reaction.users.length === 1 ? "reaction" : "reactions"}` : ""}
              arrow
            >
              <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full border text-xs bg-gray-100 border-gray-300 cursor-default ${!isGroupChat ? 'px-1.5' : ''}`}>
                <span>{reaction.emoji}</span>
                {isGroupChat && (
                  <span className="text-gray-600">{reaction.users.length}</span>
                )}
              </div>
            </Tooltip>
          ))}
        </div>
      )}
    </div>
  );
}
