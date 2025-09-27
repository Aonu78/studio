"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

interface SettingsDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function SettingsDialog({ isOpen, onOpenChange }: SettingsDialogProps) {
  const [audioDevices, setAudioDevices] = useState<MediaDeviceInfo[]>([]);
  const [videoDevices, setVideoDevices] = useState<MediaDeviceInfo[]>([]);
  const [selectedAudioDevice, setSelectedAudioDevice] = useState<string>("");
  const [selectedVideoDevice, setSelectedVideoDevice] = useState<string>("");
  const { toast } = useToast();

  useEffect(() => {
    const getDevices = async () => {
      try {
        // Request permissions
        await navigator.mediaDevices.getUserMedia({ audio: true, video: true });
        
        const devices = await navigator.mediaDevices.enumerateDevices();
        const audio = devices.filter((d) => d.kind === "audioinput");
        const video = devices.filter((d) => d.kind === "videoinput");
        
        setAudioDevices(audio);
        setVideoDevices(video);

        if (audio.length > 0) setSelectedAudioDevice(audio[0].deviceId);
        if (video.length > 0) setSelectedVideoDevice(video[0].deviceId);

      } catch (error) {
        console.error("Error enumerating devices:", error);
        toast({
          variant: "destructive",
          title: "Device Error",
          description: "Could not access your media devices. Please check permissions.",
        });
      }
    };

    if (isOpen) {
      getDevices();
    }
  }, [isOpen, toast]);

  const handleSaveChanges = () => {
    // In a real app, you would save these device preferences
    console.log("Selected Audio Device:", selectedAudioDevice);
    console.log("Selected Video Device:", selectedVideoDevice);
    toast({
        title: "Settings Saved",
        description: "Your device preferences have been updated.",
    })
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>
            Manage your audio and video devices.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="mic-select" className="text-right">
              Microphone
            </Label>
            <Select
              value={selectedAudioDevice}
              onValueChange={setSelectedAudioDevice}
            >
              <SelectTrigger id="mic-select" className="col-span-3">
                <SelectValue placeholder="Select a microphone" />
              </SelectTrigger>
              <SelectContent>
                {audioDevices.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Microphone ${audioDevices.indexOf(device) + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="cam-select" className="text-right">
              Camera
            </Label>
            <Select
              value={selectedVideoDevice}
              onValueChange={setSelectedVideoDevice}
            >
              <SelectTrigger id="cam-select" className="col-span-3">
                <SelectValue placeholder="Select a camera" />
              </SelectTrigger>
              <SelectContent>
                {videoDevices.map((device) => (
                  <SelectItem key={device.deviceId} value={device.deviceId}>
                    {device.label || `Camera ${videoDevices.indexOf(device) + 1}`}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSaveChanges}>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
