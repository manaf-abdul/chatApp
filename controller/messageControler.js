import mongoose from "mongoose";
import Chat from "./models/chat.js";
import Message from "./models/messages.js";

//=================== Add messages to the database ======================
export function addMessage(message, sender, reciever, conversationId) {
  return new Promise(async (resolve, reject) => {
    const from = sender

    //=============== checking if conversation id exists ===========
    if (conversationId) {
        const newMesssage= new Message({
        conversationId:req.body.conversationId,
        sender:req.body.sender,
        text:message
     });
      const savedMessage = await newMesssage.save();

      if (savedMessage) {
        resolve(savedMessage)
      } else {
        reject("failed to add message to the database");
      }
    }
    //================= creating new conversation ===================
    else {
      const check = await Chat.findOne({
        user_id: reciever,
        USER_ID: sender,
      });
      console.log("checking chat",check);
      if (Object.keys(check).length > 0) {
        const addMessage = new Message({
          conversationId: check._id,
          message: message,
          from: from,
        });

        const msg = await addMessage.save();

        if(msg){
          resolve(msg)
        }
         else {
          reject("failed to add message to the database");
        }
      } else {
        const conversation = new Chat({
          user_id: reciever,
          USER_ID: sender,
        });
        let stranger=true;
        const status = await conversation.save();
        console.log("new Chat",status);
        if (status) {
          const addMessage = new Message({
            conversationId: status._id,
            message: message,
            from: from,
          });

          const Message = await addMessage.save();
          if(Message){
            Message.stranger=stranger;
            resolve(Message)
          }
          else {
            reject("failed to add message to the database");
          }
        } else {
          reject("failed to add message to the database");
        }
      }
    }
  });
}

//==================== getting user specific messages =================
export function getMessages(conversationId) {
  return new Promise(async (resolve, reject) => {
    const messages = await Message.aggregate([
      { $match: { conversationId: mongoose.Types.ObjectId(conversationId) } },
      { $lookup: { from: 'users', localField: 'from', foreignField: '_id', as: 'from' } },
      { $unwind: "$from" }
    ]);
    
    if (messages.length > 0) {
      resolve(messages);
    } else {
      reject("Cannot find Messages");
    }
  });
}