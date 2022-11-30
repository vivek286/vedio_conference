import React,{useEffect , useCallback,useState} from "react";
// import { Socket } from "socket.io-client";
import { useSocket } from "../providers/socket";
import { usePeer } from "../providers/peer";
import ReactPlayer from 'react-player'

const RoomPage = () => {
    const {socket} =useSocket();
    const [myStream,setMyStream]=useState(null);
    // const [remoteStream,setRemoteStream]=useState(null); 
    const {peer,createOffer,sendStream, remoteStream,createAnswere,setRemoteAns} =usePeer();
    const handleNewUserJoined = useCallback(
        async (data) => {
        const { emailId } = data;
        console.log("New user joined room", emailId);
        const offer= await createOffer();
        socket.emit("call-user", { emailId, offer });
        },
        [createOffer, socket]
)
const handleIncommingCall = useCallback(
    async (data) => {
    const { from, offer } = data;
    const ans= await createAnswere(offer);
    await socket.emit('call-accepted',{emailId:from,ans});
    console.log("incomming call from  ", from, offer);
    // handleCallAccepted(ans);
    },
    [createAnswere,socket]
)
const handleCallAccepted=useCallback(async (data)=>{
    console.log("From Ans",data);
    const {emailId,ans}=data;
    console.log("call got accepted",ans);
    await setRemoteAns(ans);
    // await peer.setRemoteDescription(ans);
    
    // sendStream(myStream);

},[setRemoteAns])
const getusermediastream=useCallback(async()=>{
const stream=await navigator.mediaDevices.getUserMedia({audio:false,video:true});
sendStream(stream);
setMyStream(stream);
},[])
useEffect(()=>{
getusermediastream();


},[])

useEffect(()=>{

        socket.on("user-joined",handleNewUserJoined);
        socket.on('incomming-call', handleIncommingCall);
        socket.on('call-accepted',handleCallAccepted);

        


        return ()=>{
            socket.off('user-joined',handleNewUserJoined);
            socket.off('incomming-call',handleIncommingCall);
            // socket.off('call-accepted',handleCallAccepted);
        }
        
        },[handleNewUserJoined, socket,handleCallAccepted,handleIncommingCall])
return (
<div className="room-page-container">
<h1>Room Page</h1>
<button onClick={(e) => sendStream (myStream)}>Send My Video</button>
<ReactPlayer url={myStream} playing/>
<ReactPlayer url={remoteStream} playing/>
</div>
)
};
export default RoomPage;