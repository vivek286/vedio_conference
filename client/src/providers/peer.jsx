import React, {useMemo,useEffect,useState,useCallback} from "react";
const PeerContext = React.createContext(null);
; 
export const usePeer= () => React.useContext (PeerContext);
export const PeerProvider =(props) => {
const peer = useMemo (
    () => 
    new RTCPeerConnection({
    iceServers:
    [{
    urls: [
    "stun:stun.l.google.com:19302",
    "stun:global.stun.twilio.com:3478"]
    }]
}), []);


const createOffer= async () => {
    const offer= await peer.createOffer();
    await peer.setLocalDescription (offer);
    return offer;
    };


const createAnswere=async (offer)=>{
    await peer.setRemoteDescription(offer);
    const answer= await peer.createAnswer();
    await peer.setLocalDescription(answer);
    return answer;
}
const sendStream=async(stream)=>{
    const tracks=stream.getTracks();
    for(const track of tracks){
        peer.addTrack(track,stream);
    }
}
const setRemoteAns=async (ans)=>{
await peer.setRemoteDescription(ans);
}
const [remoteStream,setRemoteStream]=useState(null)
const handleTrackEvent = useCallback((ev) => {
    const streams= ev.streams;
    setRemoteStream(streams [0])
    }, []); 
    useEffect (() =>{
    peer.addEventListener('track', handleTrackEvent);
    return () => {
    peer. removeEventListener('track',handleTrackEvent)
    }
    }, [peer])
return (
<PeerContext. Provider value={{peer,sendStream,createOffer,remoteStream,createAnswere,setRemoteAns}}>{props.children}</PeerContext. Provider>
);
};