import { Header } from "@/components/header";
import { VideoPlayer } from "@/components/room/video-player";
import { ChatSidebar } from "@/components/room/chat-sidebar";
import { ParticipantsGrid } from "@/components/room/participants-grid";
import { AVControls } from "@/components/room/av-controls";

export default function RoomPage({ params }: { params: { id: string } }) {
  return (
    <div className="flex flex-col h-screen bg-background text-foreground">
      <Header />
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-[1fr_auto] overflow-hidden">
        <div className="relative flex flex-col overflow-hidden">
          <main className="flex-1 flex flex-col p-4 gap-4 overflow-y-auto">
            <VideoPlayer roomId={params.id} />
            <ParticipantsGrid />
          </main>
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20">
            <AVControls />
          </div>
        </div>
        <ChatSidebar />
      </div>
    </div>
  );
}
