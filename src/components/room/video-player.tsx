"use client";

import Image from "next/image";
import { AspectRatio } from "@/components/aspect-ratio";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Button } from "@/components/ui/button";
import { 
  Play, 
  Pause, 
  Volume2, 
  Maximize, 
  Share2, 
  Lock,
  Copy
} from "lucide-react";
import { Slider } from "@/components/ui/slider";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { Card, CardContent } from "../ui/card";
import { useEffect, useRef } from "react";


export function VideoPlayer({ roomId, screenShareStream }: { roomId: string, screenShareStream: MediaStream | null }) {
  const videoPlaceholder = PlaceHolderImages.find((img) => img.id === "video-placeholder-1");
  const shareableLink = typeof window !== 'undefined' ? `${window.location.origin}/room/${roomId}`: '';
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current) {
      if (screenShareStream) {
        videoRef.current.srcObject = screenShareStream;
        videoRef.current.play().catch(e => console.error("Play failed", e));
      } else {
        videoRef.current.srcObject = null;
      }
    }
  }, [screenShareStream]);

  return (
    <Card className="overflow-hidden relative group">
      <CardContent className="p-0">
        <AspectRatio ratio={16 / 9} className="bg-black">
          {screenShareStream ? (
            <video ref={videoRef} className="w-full h-full object-contain" autoPlay playsInline />
          ) : (
            videoPlaceholder && (
              <Image
                src={videoPlaceholder.imageUrl}
                alt={videoPlaceholder.description}
                fill
                className="object-cover rounded-t-lg"
                data-ai-hint={videoPlaceholder.imageHint}
              />
            )
          )}
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
            
            {/* Top Controls */}
            <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold text-white shadow-md">Movie Title Here</h2>
                <div className="flex items-center gap-2">
                    <TooltipProvider>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button 
                                  variant="ghost" 
                                  size="icon" 
                                  className="text-white hover:bg-white/20 hover:text-white"
                                  onClick={() => navigator.clipboard.writeText(shareableLink)}
                                >
                                    <Share2 className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Copy share link</p>
                            </TooltipContent>
                        </Tooltip>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                                    <Lock className="h-5 w-5" />
                                </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>Lock Room</p>
                            </TooltipContent>
                        </Tooltip>
                    </TooltipProvider>
                </div>
            </div>

            {/* Bottom Controls */}
            <div className="flex flex-col gap-2">
                {/* Seek Bar */}
                <Slider defaultValue={[33]} max={100} step={1} className="w-full" />
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                            <Play className="h-6 w-6" />
                        </Button>
                        <div className="flex items-center gap-2">
                            <Volume2 className="h-5 w-5 text-white" />
                            <Slider defaultValue={[50]} max={100} step={1} className="w-24" />
                        </div>
                        <span className="text-white text-xs">15:30 / 45:00</span>
                    </div>
                    <Button variant="ghost" size="icon" className="text-white hover:bg-white/20 hover:text-white">
                        <Maximize className="h-5 w-5" />
                    </Button>
                </div>
            </div>

          </div>
        </AspectRatio>
      </CardContent>
    </Card>
  );
}
