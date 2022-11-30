const express = require('express');
const bodyParser = require('body-parser');
const {Server} = require('socket.io');

const io= new Server(
    {
        cors:true,
    }
);
 
const emailToSocketMapping=new Map();
const socketToEmailMapping=new Map();
const app = express();
app.use(bodyParser.json());
io.on("connection", (socket) => {
    console.log("new connection");
    socket.on("join-room", (data) => {
    const { roomId, emailId} = data;
    console.log("User", emailId, "Joined Room", roomId);
    emailToSocketMapping. set (emailId, socket.id);
    socketToEmailMapping.set(socket.id,emailId);
    socket.join(roomId);
    socket.emit('joined-room',{roomId});
    socket.broadcast.to (roomId). emit("user-joined", { emailId });
    });

socket.on('call-user',(data)=>{
    const {emailId,offer}=data;
    const socketid=emailToSocketMapping.get(emailId);
    const fromemail=socketToEmailMapping.get(socketid);
    socket.to(socketid).emit("incomming-call",{from:fromemail,offer});
 
})
socket.on('call-accepted',(data)=>{
    console.log("in server call accepted");
    const {emailId,ans}=data;
    const socketid=emailToSocketMapping.get(emailId);
    console.log(socketid);
    socket.to(socketid).emit('call-accepted',data);
    // console.log(ans);



})

    });


app. listen (8000, () => console.log("Http server running at PORT 8000"));
io. listen (8001);