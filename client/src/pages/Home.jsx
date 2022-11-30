import React from "react";
import { useState,useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSocket} from "../providers/socket";

const Homepage = () => {
    const { socket} = useSocket();
    const navigate=useNavigate();
const handleroomjoined=({roomId})=>{
console.log("room joined"+roomId)
navigate(`/room/${roomId}`);
}
    useEffect(()=>{
socket.on('joined-room',handleroomjoined);
return ()=>{
    socket.off('joined-room',handleroomjoined);
    // socket.off('incomming-call',handleIncommingCall);
}
},[socket,handleroomjoined])

// socket.emit("join-room", { roomId: "1", emailId: "any@ex.com" });
const [email,setEmail]=useState();
const [roomId,setRoomid]=useState();
const handleJoinRoom=()=>{
    socket.emit('join-room',{emailId:email,roomId});
}



return (
<div className="homepage-container">
 <div>
<input type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="Enter your email here" />
<input type="text"  value ={roomId} onChange={e=>setRoomid(e.target.value)} placeholder="Enter Room Code" />
<button onClick={handleJoinRoom}>Enter Room</button>
</div>
</div>
)
};
export default Homepage;