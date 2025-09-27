"use client";

import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Card, CardContent } from '@/components/ui/card';
import { Mic, MicOff, Pin, Video, VideoOff, XCircle } from 'lucide-react';
import { Badge } from '../ui/badge';
import React, { useEffect, useRef, useState } from 'react';
import { useUser } from '@/firebase';
import { cn } from '@/lib/utils';

interface ParticipantsGridProps {
  localStream: MediaStream | null;
  isMicOn: boolean;
  isCameraOn: boolean;
  displayName: string;
}

const mockParticipantsList = [
  { id: '2', name: 'Alice', avatarId: 'avatar-2', isHost: false, micOn: false, videoOn: true },
  { id: '3', name: 'Bob', avatarId: 'avatar-3', isHost: false, micOn: true, videoOn: false },
  { id: '4', name: 'Charlie', avatarId: 'avatar-4', isHost: false, micOn: false, videoOn: false },
  { id: '5', name: 'Diana', avatarId: 'avatar-5', isHost: false, micOn: true, videoOn: true },
];

export function ParticipantsGrid({ localStream, isMicOn, isCameraOn, displayName }: ParticipantsGridProps) {
  const { user } = useUser();
  const [participants, setParticipants] = useState(mockParticipantsList);

  const currentUserParticipant = {
    id: user?.uid || '1',
    name: displayName || 'You',
    avatarId: 'avatar-1',
    isHost: true,
    micOn: isMicOn,
    videoOn: isCameraOn,
  };

  const allParticipants = [currentUserParticipant, ...participants];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
      {allParticipants.map((p) => {
        const isYou = p.id === currentUserParticipant.id;
        return (
          <ParticipantTile
            key={p.id}
            participant={p}
            isYou={isYou}
            localStream={isYou ? localStream : null}
            isMicOn={isYou ? isMicOn : p.micOn}
            isCameraOn={isYou ? isCameraOn : p.videoOn}
          />
        );
      })}
    </div>
  );
}


interface ParticipantTileProps {
  participant: typeof mockParticipantsList[0] & { id: string, name: string };
  isYou: boolean;
  localStream: MediaStream | null;
  isMicOn: boolean;
  isCameraOn: boolean;
}

function ParticipantTile({ participant, isYou, localStream, isMicOn, isCameraOn }: ParticipantTileProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const avatar = PlaceHolderImages.find(img => img.id === participant.avatarId);
  
  useEffect(() => {
    if (videoRef.current && localStream) {
        if (videoRef.current.srcObject !== localStream) {
            videoRef.current.srcObject = localStream;
        }
        const videoTrack = localStream.getVideoTracks()[0];
        if (videoTrack) {
            videoTrack.enabled = isCameraOn;
        }
        const audioTrack = localStream.getAudioTracks()[0];
        if (audioTrack) {
            audioTrack.enabled = isMicOn;
        }
    } else if (videoRef.current) {
        videoRef.current.srcObject = null;
    }
  }, [localStream, isCameraOn, isMicOn]);


  const MicIcon = isMicOn ? Mic : MicOff;
  const VideoIcon = isCameraOn ? Video : VideoOff;

  return (
    <Card className="relative group overflow-hidden">
      <CardContent className="p-0">
        <div className="aspect-video bg-secondary rounded-lg flex items-center justify-center">
          {isCameraOn && localStream ? (
            <video ref={videoRef} autoPlay playsInline muted={isYou} className="w-full h-full object-cover" />
          ) : (
             <div className={cn(
              "relative w-full h-full flex items-center justify-center",
              !avatar && "bg-secondary"
            )}>
              {avatar ? (
                <>
                <Image 
                  src={avatar.imageUrl} 
                  alt={participant.name} 
                  fill
                  className="w-full h-full object-cover" 
                  data-ai-hint={avatar.imageHint}
                />
                <div className="absolute inset-0 bg-card/70 backdrop-blur-sm"></div>
                </>
              ) : null}
              <div className="relative w-16 h-16 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-2xl font-bold">
                {participant.name.charAt(0)}
              </div>
            </div>
          )}
        </div>

        <div className="absolute bottom-2 left-2 flex items-center gap-2">
          <Badge variant={participant.isHost ? 'default' : 'secondary'}>{isYou ? participant.name : participant.name}</Badge>
        </div>

        <div className="absolute top-2 right-2 flex items-center gap-2">
          <div className={`p-1.5 rounded-full ${isMicOn ? 'bg-black/20' : 'bg-destructive'}`}>
              <MicIcon className="h-4 w-4 text-white" />
          </div>
           {!isYou && (
              <div className={`p-1.5 rounded-full ${isCameraOn ? 'bg-black/20' : 'bg-destructive'}`}>
                  <VideoIcon className="h-4 w-4 text-white" />
              </div>
           )}
        </div>

        {isYou && participant.isHost && (
          <div className="absolute inset-0 bg-black/50 flex-col gap-2 items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity flex">
            <p className='text-xs text-white/80'>Host Controls</p>
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
          </div>
        )}
      </CardContent>
    </Card>
  );
}
