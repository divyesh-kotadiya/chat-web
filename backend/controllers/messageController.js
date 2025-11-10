const catchAsync = require("../utils/catchAsync");
const AppError = require('../utils/AppError');
const Message=require('../models/messageModel')
const User=require('../models/userModel')
const Chat=require('../models/chatModel');


exports.sendMessage=catchAsync(async(req,res,next)=>{

    const {content,chatId}=req.body;

    if(!content||!chatId)
    {
        return next(new AppError("Invalid data passed into request",400))
    }

    let newMessage={
        sender:req.user._id,
        content:content,
        chat:chatId
    };

    let message=await Message.create(newMessage);
    message=await message.populate("sender","name pic")
    message=await message.populate("chat")
    message=await User.populate(message,{
        path:'chat.users',
        select:'name pic email'
    })

    await Chat.findByIdAndUpdate(req.body.chatId,{latestMessage:message})
    res.status(200).json({
        status:'success',
        data:message
    })

})

exports.getAllMessages=catchAsync(async(req,res,next)=>{

    const messages=await Message.find({chat:req.params.chatId})
        .populate('sender',"name pic email")
        .populate({
            path:'reactions.users',
            select:'name pic email _id'
        });

    if(!messages)
    {
        next(new AppError('Something went wrong while fetching messages',400))
    }
    
    res.status(200).json({
        status:'success',
        message:messages
    })

})

exports.toggleReaction=catchAsync(async(req,res,next)=>{
    const {messageId,emoji}=req.body;
    const userId=req.user._id;

    if(!messageId||!emoji)
    {
        return next(new AppError("Message ID and emoji are required",400))
    }

    let message=await Message.findById(messageId);
    if(!message)
    {
        return next(new AppError("Message not found",404))
    }

    if(message.sender.toString()===userId.toString())
    {
        return next(new AppError("You cannot react to your own message",403))
    }

    let userHadThisEmoji = false;

    message.reactions.forEach((reaction) => {
        const userIndex = reaction.users.findIndex(
            id => id.toString() === userId.toString()
        );
        if (userIndex !== -1) {
            if (reaction.emoji === emoji) {
                userHadThisEmoji = true;
            }
            reaction.users.splice(userIndex, 1);
        }
    });


    message.reactions = message.reactions.filter(r => r.users.length > 0);

    if (!userHadThisEmoji) {
        const reactionIndex = message.reactions.findIndex(r => r.emoji === emoji);
        
        if (reactionIndex === -1) {
            message.reactions.push({
                emoji: emoji,
                users: [userId]
            });
        } else {
            message.reactions[reactionIndex].users.push(userId);
        }
    }

    await message.save();
    message=await message.populate("sender","name pic");
    message=await message.populate("chat");
    message=await message.populate({
        path:'reactions.users',
        select:'name pic email _id'
    });
    message=await User.populate(message,{
        path:'chat.users',
        select:'name pic email'
    });

    res.status(200).json({
        status:'success',
        data:message
    })
})