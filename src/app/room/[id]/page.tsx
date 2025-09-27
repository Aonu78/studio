"use client"

import { useState, use, useRef, useEffect } from "react";
import { Header } from "@/components/header";
import { VideoPlayer } from "@/components/room/video-player";
import { ChatSidebar } from "@/components/room/chat-sidebar";
import { ParticipantsGrid } from "@/components/room/participants-grid";
import { AVControls } from "@/components/room/av-controls";
import { cn } from "@/lib/utils";
import { SettingsDialog } from "@/components/room/settings-dialog";
import { useToast } from "@/hooks/use-toast";
import { useUser, setDocumentNonBlocking, useFirestore, useAuth, useMemoFirebase, addDocumentNonBlocking } from "@/firebase";
import { SetNameDialog } from "@/components/room/set-name-dialog";
import { doc, setDoc, serverTimestamp, collection, writeBatch } from "firebase/firestore";
import { signInAnonymously } from "firebase/auth";


export default function RoomPage({ params }: { params: { id: string } }) {
  const { id: roomId } = use(params);
  const [isMicOn, setIsMicOn] = useState(false);
  const [isCameraOn, setIsCameraOn] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isNameDialogOpen, setIsNameDialogOpen] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();
  const [displayName, setDisplayName] = useState(user?.displayName || "");


  useEffect(() => {
    if (isUserLoading || !firestore || !auth) return;
    
    if (!user) {
      signInAnonymously(auth).catch((error) => {
        console.error("Anonymous sign-in failed:", error);
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description: "Could not join the room as a guest.",
        });
      });
      return; 
    }

    // Only prompt for name if it's not already set
    if (!displayName && user) {
        setIsNameDialogOpen(true);
    }
  }, [isUserLoading, user, auth, firestore, toast, displayName]);

  const joinRoom = async (name: string) => {
    if (!firestore || !user) return;

    const roomRef = doc(firestore, 'rooms', roomId);
    const roomUserRef = doc(firestore, `rooms/${roomId}/users`, user.uid);

    try {
      const batch = writeBatch(firestore);

      // Set the room document
      batch.set(roomRef, {
          createdAt: serverTimestamp(),
          hostId: user.uid,
      }, { merge: true });

      // Set the user document in the subcollection
      batch.set(roomUserRef, {
          displayName: name,
          isConnected: true,
          isHost: true, 
          isMuted: !isMicOn,
          cameraEnabled: isCameraOn,
      }, { merge: true });
      
      await batch.commit();

    } catch (error) {
      console.error("Error joining room:", error);
      toast({
        variant: "destructive",
        title: "Failed to Join Room",
        description: "Could not write user data to the room.",
      });
    }
  };


  const handleNameSet = (name: string) => {
    setDisplayName(name);
    setIsNameDialogOpen(false);
    
    // Only save display name for non-anonymous users
    if (user && firestore && !user.isAnonymous) {
      const userRef = doc(firestore, 'users', user.uid);
      setDocumentNonBlocking(userRef, { displayName: name }, { merge: true });
    }
    
    joinRoom(name);
  }

  const handleToggleScreenShare = async () => {
    if (isScreenSharing) {
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
      screenStreamRef.current = null;
      setIsScreenSharing(false);
    } else {
      try {
        const stream = await navigator.mediaDevices.getDisplayMedia({ video: true, audio: true });
        screenStreamRef.current = stream;
        setIsScreenSharing(true);
        stream.getTracks().forEach(track => {
            track.onended = () => {
                setIsScreenSharing(false);
                screenStreamRef.current = null;
            }
        })
      } catch (error) {
        console.error("Error starting screen share:", error);
        toast({
          variant: "destructive",
          title: "Screen Share Failed",
          description: "Could not start screen sharing. Please check browser permissions.",
        });
      }
    }
  };

  useEffect(() => {
    const getMedia = async () => {
        if (isCameraOn || isMicOn) {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: isCameraOn, audio: isMicOn });
                if (!isCameraOn) {
                    stream.getVideoTracks().forEach(track => {
                        track.enabled = false;
                    });
                }
                if (!isMicOn) {
                    stream.getAudioTracks().forEach(track => {
                        track.enabled = false;
                    });
                }
                setLocalStream(stream);
            } catch (err) {
                console.error("Error accessing media devices.", err);
                toast({
                  variant: "destructive",
                  title: "Device Error",
                  description: "Could not access media devices. Please check browser permissions.",
                });
                setIsCameraOn(false);
                setIsMicOn(false);
            }
        } else {
            localStream?.getTracks().forEach(track => track.stop());
            setLocalStream(null);
        }
    };
    getMedia();

    return () => {
        localStream?.getTracks().forEach(track => track.stop());
    }
  }, [isCameraOn, isMicOn, toast]);


  useEffect(() => {
    // Clean up streams on component unmount
    return () => {
      localStream?.getTracks().forEach(track => track.stop());
      screenStreamRef.current?.getTracks().forEach(track => track.stop());
    };
  }, [localStream]);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <div className={cn(
        "flex-1 grid grid-cols-1 overflow-hidden",
        isChatOpen && "lg:grid-cols-[1fr_auto]"
      )}>
        <div className="relative flex flex-col overflow-hidden">
          <main className="flex-1 flex flex-col p-4 gap-4 overflow-auto">
            <VideoPlayer 
              roomId={roomId}
              screenShareStream={isScreenSharing ? screenStreamRef.current : null} 
            />
            <ParticipantsGrid 
              localStream={localStream} 
              isMicOn={isMicOn} 
              isCameraOn={isCameraOn} 
              displayName={displayName}
            />
          </main>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <AVControls 
              isMicOn={isMicOn}
              onToggleMic={() => setIsMicOn(prev => !prev)}
              isCameraOn={isCameraOn}
              onToggleCamera={() => setIsCameraOn(prev => !prev)}
              isChatOpen={isChatOpen}
              onToggleChat={() => setIsChatOpen(prev => !prev)}
              isScreenSharing={isScreenSharing}
              onToggleScreenShare={handleToggleScreenShare}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </div>
        </div>
        <div className={cn("h-full", !isChatOpen && "hidden")}>
          <ChatSidebar displayName={displayName} roomId={roomId} />
        </div>
      </div>
      <SettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
       <SetNameDialog
        isOpen={isNameDialogOpen}
        onOpenChange={setIsNameDialogOpen}
        onNameSet={handleNameSet}
      />
    </div>
  );
}
