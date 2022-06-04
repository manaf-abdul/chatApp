import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import connectDB from "./DB.js";
// import { addMessage , getNewMessengers , getMessages } from "./chatBackup.js";

//============= establishing database connection ========
connectDB();

const app = express();
const server = createServer(app);
const io = new Server(server,{
  cors: {
    origin: "*",
  }
});

//========== Setting global object to know which users are online and chat =========

const users = {};

app.use('/',(req,res)=>{
  console.log(req);
  res.send("its working")
});


io.on("connect", (socket) => {
  
  //================ handling functions =======================
    //==============handling initial connection =============
    const handleInit = (data)=>{
      data = JSON.parse(data);
      console.log(data);
      users[data.userId] = socket.id;
      console.log(users);
    }
    //============== handle message ===================
    const handleMessage = (data)=>{
      data = JSON.parse(data);
      console.log(data);
      const { message, sender, reciever , conversationId } = data;
      addMessage(message, sender ,reciever,conversationId).then((response)=>{
        if(response.data.stranger){
            console.log("resolved data in then",response);
            socket.broadcast.to(reciever).emit('recieveMessage Notification',JSON.stringify({"stranger field"}));
          }
          if(response.data){
            socket.broadcast.to(reciever).emit('recieveMessage',JSON.stringify({ response }));
          }
        
      })
        .catch((err)=>{
          console.log(err);
  
      })
    }
 
//======== socket event listeners =========================
  socket.on("init", handleInit);
  socket.on('message',handleMessage);
});


server.listen(4000,console.log(`connected port 4000`))