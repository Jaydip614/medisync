"use client";

import { useEffect, useRef, useState } from "react";
import { 
  HMSRoomProvider, 
  useHMSActions, 
  useHMSStore, 
  selectIsConnectedToRoom,
  selectLocalPeer,
  selectPeers,
  selectCameraStreamByPeerID,
  selectAudioTrackByPeerID,
  selectIsPeerAudioEnabled,
  selectIsPeerVideoEnabled
} from "@100mslive/react-sdk";
import { Button } from "@/components/ui/button";
import { Video, VideoOff, Mic, MicOff, PhoneOff, Users } from 'lucide-react';

interface VideoCallProps {
  roomId: string; // 100ms room ID
  token: string; // 100ms auth token
  onLeave: () => void;
}

function VideoCallContent({ roomId, token, onLeave }: VideoCallProps) {
  const hmsActions = useHMSActions();
  const isConnected = useHMSStore(selectIsConnectedToRoom);
  const localPeer = useHMSStore(selectLocalPeer);
  const peers = useHMSStore(selectPeers);
  
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  // Join the room when the component mounts
  useEffect(() => {
    async function joinRoom() {
      try {
        await hmsActions.join({
          authToken: token,
          userName: `user-${Date.now()}`, // Required field
          settings: {
            isAudioMuted: false,
            isVideoMuted: false
          }
        });
      } catch (error) {
        console.error("Error joining room:", error);
      }
    }
    
    joinRoom();

    return () => {
      hmsActions.leave();
    };
  }, [hmsActions, token]);

  // Handle leaving the room
  const leaveCall = async () => {
    await hmsActions.leave();
    onLeave();
  };

  // Toggle local video
  const toggleCamera = async () => {
    try {
      await hmsActions.setLocalVideoEnabled(!isVideoEnabled);
      setIsVideoEnabled(!isVideoEnabled);
    } catch (error) {
      console.error("Error toggling camera:", error);
    }
  };

  // Toggle local audio
  const toggleMic = async () => {
    try {
      await hmsActions.setLocalAudioEnabled(!isAudioEnabled);
      setIsAudioEnabled(!isAudioEnabled);
    } catch (error) {
      console.error("Error toggling microphone:", error);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 bg-black rounded-lg overflow-hidden relative">
        {/* Video grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 h-full p-2">
          {peers.map((peer) => (
            <VideoTile key={peer.id} peerId={peer.id} />
          ))}
        </div>
        
        {/* Participant count */}
        <div className="absolute top-2 right-2 bg-black/50 text-white px-2 py-1 rounded-md flex items-center">
          <Users className="h-4 w-4 mr-1" />
          <span>{peers.length}</span>
        </div>
      </div>
      
      {isConnected && (
        <div className="flex gap-2 justify-center p-4 bg-muted/20 rounded-b-lg">
          <Button 
            onClick={toggleCamera} 
            variant={isVideoEnabled ? "outline" : "secondary"} 
            size="icon"
            className="rounded-full h-12 w-12"
            aria-label="Toggle Camera"
          >
            {isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />}
          </Button>
          
          <Button 
            onClick={toggleMic} 
            variant={isAudioEnabled ? "outline" : "secondary"} 
            size="icon"
            className="rounded-full h-12 w-12"
            aria-label="Toggle Microphone"
          >
            {isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />}
          </Button>
          
          <Button 
            onClick={leaveCall} 
            variant="destructive" 
            size="icon"
            className="rounded-full h-12 w-12"
            aria-label="Leave Call"
          >
            <PhoneOff className="h-5 w-5" />
          </Button>
        </div>
      )}
    </div>
  );
}

function VideoTile({ peerId }: { peerId: string }) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const peer = useHMSStore(selectLocalPeer);
  const videoTrack = useHMSStore(selectCameraStreamByPeerID(peerId));
  const isLocal = peer?.id === peerId;
  const isVideoEnabled = useHMSStore(selectIsPeerVideoEnabled(peerId));
  const isAudioEnabled = useHMSStore(selectIsPeerAudioEnabled(peerId));
  
  useEffect(() => {
    if (videoRef.current && videoTrack) {
      // The correct way to attach video in 100ms SDK
      if (videoTrack.enabled) {
        const mediaStream = new MediaStream();
        // mediaStream.addTrack(videoTrack);
        videoRef.current.srcObject = mediaStream;
        videoRef.current.play().catch(error => console.error("Error playing video:", error));
      } else if (videoRef.current.srcObject) {
        videoRef.current.srcObject = null;
      }
    }
    
    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject = null;
      }
    };
  }, [videoTrack]);

  return (
    <div className="relative bg-muted rounded-lg overflow-hidden h-full min-h-[200px] flex items-center justify-center">
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted={isLocal}
        className={`h-full w-full object-cover ${!isVideoEnabled ? 'hidden' : ''}`}
      />
      
      {!isVideoEnabled && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <div className="h-20 w-20 rounded-full bg-primary/20 flex items-center justify-center text-2xl font-semibold text-primary">
            {peer?.name?.charAt(0) || "U"}
          </div>
        </div>
      )}
      
      <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded-md text-sm">
        {peer?.name || "User"} {isLocal ? "(You)" : ""}
        {!isAudioEnabled && (
          <MicOff className="h-3 w-3 ml-1 inline" />
        )}
      </div>
    </div>
  );
}

export function VideoCall(props: VideoCallProps) {
  return (
    <HMSRoomProvider>
      <VideoCallContent {...props} />
    </HMSRoomProvider>
  );
}
