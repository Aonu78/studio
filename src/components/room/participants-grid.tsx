import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Pin, Video, VideoOff, XCircle } from 'lucide-react';
import { Badge } from '../ui/badge';

interface ParticipantsGridProps {
  isMicOn: boolean;
  isCameraOn: boolean;
}

const mockParticipantsList = [
  { name: 'Alice', avatarId: 'avatar-2', isHost: false, micOn: false, videoOn: true },
  { name: 'Bob', avatarId: 'avatar-3', isHost: false, micOn: true, videoOn: false },
  { name: 'Charlie', avatarId: 'avatar-4', isHost: false, micOn: false, videoOn: false },
  { name: 'Diana', avatarId: 'avatar-5', isHost: false, micOn: true, videoOn: true },
];

export function ParticipantsGrid({ isMicOn, isCameraOn }: ParticipantsGridProps) {
  const currentUser = { name: 'You', avatarId: 'avatar-1', isHost: true, micOn: isMicOn, videoOn: isCameraOn };
  const mockParticipants = [currentUser, ...mockParticipantsList];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {mockParticipants.map((p) => {
        const avatar = PlaceHolderImages.find(img => img.id === p.avatarId);
        const isYou = p.name === 'You';
        return (
          <Card key={p.name} className="relative group overflow-hidden">
            <CardContent className="p-0">
              <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
                {p.videoOn && avatar ? (
                  <Image 
                    src={avatar.imageUrl} 
                    alt={p.name} 
                    width={160} 
                    height={90} 
                    className="w-full h-full object-cover" 
                    data-ai-hint={avatar.imageHint}
                  />
                ) : (
                   <div className="relative w-full h-full flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                      {p.name.charAt(0)}
                    </div>
                    <div className="absolute inset-0 bg-card/70 backdrop-blur-sm"></div>
                  </div>
                )}
              </div>

              <div className="absolute bottom-2 left-2 flex items-center gap-2">
                <Badge variant={p.isHost ? 'default' : 'secondary'}>{p.isHost ? 'Host' : p.name}</Badge>
              </div>

              <div className="absolute top-2 right-2 flex items-center gap-2">
                <div className={`p-1.5 rounded-full ${p.micOn ? 'bg-black/20' : 'bg-destructive'}`}>
                    {p.micOn ? <Mic className="h-4 w-4 text-white" /> : <MicOff className="h-4 w-4 text-destructive-foreground" />}
                </div>
                 {!isYou && (
                    <div className={`p-1.5 rounded-full ${p.videoOn ? 'bg-black/20' : 'bg-destructive'}`}>
                        {p.videoOn ? <Video className="h-4 w-4 text-white" /> : <VideoOff className="h-4 w-4 text-destructive-foreground" />}
                    </div>
                 )}
              </div>

              <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                {currentUser.isHost && !p.isHost && (
                    <div className='flex gap-2'>
                        <button className='p-2 rounded-full bg-background/80 hover:bg-background'>
                            <MicOff className='h-5 w-5'/>
                        </button>
                        <button className='p-2 rounded-full bg-background/80 hover:bg-background'>
                            <Pin className='h-5 w-5'/>
                        </button>
                         <button className='p-2 rounded-full bg-destructive/80 hover:bg-destructive'>
                            <XCircle className='h-5 w-5 text-destructive-foreground'/>
                        </button>
                    </div>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
