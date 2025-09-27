import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, ScreenShare, PhoneOff, Settings, ChevronUp } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function AVControls() {
    return (
        <TooltipProvider>
            <Card className="p-2 bg-card/80 backdrop-blur-sm shadow-2xl">
                <div className="flex items-center gap-2">
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="secondary" size="icon" className="bg-primary hover:bg-primary/90 rounded-full w-12 h-12">
                                <Mic className="h-6 w-6 text-primary-foreground" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Mute/Unmute</TooltipContent>
                    </Tooltip>

                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="secondary" size="icon" className="bg-primary hover:bg-primary/90 rounded-full w-12 h-12">
                                <Video className="h-6 w-6 text-primary-foreground" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Start/Stop Video</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full w-12 h-12">
                                <ScreenShare className="h-6 w-6" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Share Screen</TooltipContent>
                    </Tooltip>
                    
                    <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full w-12 h-12">
                                <Settings className="h-6 w-6" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Settings</TooltipContent>
                    </Tooltip>

                     <Tooltip>
                        <TooltipTrigger asChild>
                            <Button variant="secondary" size="icon" className="rounded-full w-12 h-12">
                                <ChevronUp className="h-6 w-6" />
                            </Button>
                        </TooltipTrigger>
                        <TooltipContent>Show Chat</TooltipContent>
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
