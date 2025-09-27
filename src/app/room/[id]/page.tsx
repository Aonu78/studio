"use client"

import { useState, use } from "react";
import { Header } from "@/components/header";
import { VideoPlayer } from "@/components/room/video-player";
import { ChatSidebar } from "@/components/room/chat-sidebar";
import { ParticipantsGrid } from "@/components/room/participants-grid";
import { AVControls } from "@/components/room/av-controls";
import { cn } from "@/lib/utils";

export default function RoomPage({ params }: { params: Promise<{ id: string }> }) {
  const { id: roomId } = use(params);
  const [isMicOn, setIsMicOn] = useState(true);
  const [isCameraOn, setIsCameraOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(true);

  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <div className={cn(
        "flex-1 grid grid-cols-1 overflow-hidden",
        isChatOpen && "lg:grid-cols-[1fr_auto]"
      )}>
        <div className="relative flex flex-col overflow-hidden">
          <main className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
            <VideoPlayer roomId={roomId} />
            <ParticipantsGrid isMicOn={isMicOn} isCameraOn={isCameraOn} />
          </main>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <AVControls 
              isMicOn={isMicOn}
              onToggleMic={() => setIsMicOn(prev => !prev)}
              isCameraOn={isCameraOn}
              onToggleCamera={() => setIsCameraOn(prev => !prev)}
              isChatOpen={isChatOpen}
              onToggleChat={() => setIsChatOpen(prev => !prev)}
            />
          </div>
        </div>
        {isChatOpen && <ChatSidebar />}
      </div>
    </div>
  );
}
