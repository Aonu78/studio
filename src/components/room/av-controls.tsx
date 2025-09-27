"use client"

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, Settings, ChevronUp, MessageSquareOff, ScreenShareOff } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AVControlsProps {
    isMicOn: boolean;
    onToggleMic: () => void;
    isCameraOn: boolean;
    onToggleCamera: () => void;
    isChatOpen: boolean;
    onToggleChat: () => void;
    isScreenSharing: boolean;
    onToggleScreenShare: () => void;
    onOpenSettings: () => void;
}

export function AVControls({
    isMicOn,
    onToggleMic,
    isCameraOn,
    onToggleCamera,
    isChatOpen,
    onToggleChat,
    isScreenSharing,
    onToggleScreenShare,
    onOpenSettings
}: AVControlsProps) {
    return (
        <TooltipProvider>
            <Card className="p-2 bg-card/80 backdrop-blur-sm shadow-2xl">
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={isMicOn ? "secondary" : "destructive"} size="icon" className="rounded-full w-12 h-12" onClick={onToggleMic}>
                                {isMicOn ? <Mic className="h-6 w-6" /> : <MicOff className="h-6 w-6" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{isMicOn ? "Mute" : "Unmute"}</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={isCameraOn ? "secondary" : "destructive"} size="icon" className="rounded-full w-12 h-12" onClick={onToggleCamera}>
                                {isCameraOn ? <Video className="h-6 w-6" /> : <VideoOff className="h-6 w-6" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{isCameraOn ? "Stop Video" : "Start Video"}</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant={isScreenSharing ? "destructive" : "secondary"} size="icon" className="rounded-full w-12 h-12" onClick={onToggleScreenShare}>
                               {isScreenSharing ? <ScreenShareOff className="h-6 w-6" /> : <ScreenShare className="h-6 w-6" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{isScreenSharing ? "Stop Sharing" : "Share Screen"}</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full w-12 h-12" onClick={onOpenSettings}>
                                <Settings className="h-6 w-6" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Settings</TooltipContent>
                    </Tooltip>

                     <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full w-12 h-12" onClick={onToggleChat}>
                                {isChatOpen ? <MessageSquareOff className="h-6 w-6" /> : <ChevronUp className="h-6 w-6" />}
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>{isChatOpen ? "Hide Chat" : "Show Chat"}</TooltipContent>
                    </Tooltip>
                    
                    <div className="w-px h-8 bg-border mx-2"></div>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="destructive" size="icon" className="rounded-full w-12 h-12">
                                <PhoneOff className="h-6 w-6" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Leave Call</TooltipContent>
                    </Tooltip>
                </div>
            </Card>
        </TooltipProvider>
    )
}
