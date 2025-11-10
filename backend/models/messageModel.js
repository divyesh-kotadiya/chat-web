const mongoose=require('mongoose');

const reactionSchema=new mongoose.Schema({
    emoji:{type:String,required:true},
    users:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}]
},{_id:false})

const messageSchema=new mongoose.Schema({
    sender:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    content:{
        type:String,
        trim:true
    },
    chat:{type:mongoose.Schema.Types.ObjectId,ref:'Chat'},
    readBy:[{type:mongoose.Schema.Types.ObjectId,ref:'User'}],
    reactions:[reactionSchema]
},{timestamps:true})

const Message=new mongoose.model('Message',messageSchema)

module.exports=Message;