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


export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: roomId } = use(params);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const screenStreamRef = useRef<MediaStream | null>(null);
  const { toast } = useToast();

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
          <main className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
            <VideoPlayer 
              roomId={roomId}
              screenShareStream={isScreenSharing ? screenStreamRef.current : null} 
            />
            <ParticipantsGrid localStream={localStream} setLocalStream={setLocalStream} />
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
        {isChatOpen && <ChatSidebar />}
      </div>
      <SettingsDialog
        isOpen={isSettingsOpen}
        onOpenChange={setIsSettingsOpen}
      />
    </div>
  );
}
