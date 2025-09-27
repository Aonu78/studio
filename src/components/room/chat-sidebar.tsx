"use client"

import { useState, FormEvent, useRef, useEffect } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { PlaceHolderImages } from "@/lib/placeholder-images"
import { MessageSquare, Send, Smile } from "lucide-react"
import { EmojiSuggestions } from "./emoji-suggestions"
import { cn } from "@/lib/utils"

interface ChatMessage {
  user: string;
  text: string;
  avatar: string;
  time: string;
}

const initialMessages: ChatMessage[] = [
    { user: 'Alice', text: 'This movie is awesome!', avatar: 'avatar-2', time: '10:30 PM' },
    { user: 'Bob', text: 'Has anyone seen the sequel?', avatar: 'avatar-3', time: '10:31 PM' },
    { user: 'Charlie', text: 'No spoilers please!', avatar: 'avatar-4', time: '10:32 PM' },
    { user: 'Diana', text: '😂', avatar: 'avatar-5', time: '10:32 PM' },
    { user: 'Alice', text: 'The cinematography is just breathtaking.', avatar: 'avatar-2', time: '10:35 PM' },
    { user: 'Eve', text: 'I agree, the visuals are stunning.', avatar: 'avatar-6', time: '10:36 PM' },
    { user: 'Frank', text: 'The soundtrack is also incredible.', avatar: 'avatar-1', time: '10:37 PM' },
    { user: 'Grace', text: 'Who is the lead actor?', avatar: 'avatar-2', time: '10:38 PM' },
    { user: 'Heidi', text: 'I think it\'s the same person from that other film.', avatar: 'avatar-3', time: '10:39 PM' },
    { user: 'Ivan', text: 'Oh, right! He was great in that.', avatar: 'avatar-4', time: '10:40 PM' },
    { user: 'Judy', text: 'Can we rewind a bit? I missed that last part.', avatar: 'avatar-5', time: '10:41 PM' },
    { user: 'Mallory', text: 'The host can control playback.', avatar: 'avatar-6', time: '10:42 PM' },
    { user: 'Oscar', text: 'This is so much better than watching alone!', avatar: 'avatar-1', time: '10:43 PM' },
    { user: 'Peggy', text: 'Totally!', avatar: 'avatar-2', time: '10:44 PM' },
    { user: 'Walter', text: 'Let\'s do this again next week.', avatar: 'avatar-3', time: '10:45 PM' },
];


export function ChatSidebar({ displayName }: { displayName: string }) {
    const [messages, setMessages] = useState<ChatMessage[]>(initialMessages);
    const [chatInput, setChatInput] = useState("");
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const handleSendMessage = (e: FormEvent) => {
        e.preventDefault();
        if (chatInput.trim() === "") return;

        const newMessage: ChatMessage = {
            user: displayName || 'You',
            text: chatInput,
            avatar: 'avatar-1',
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setMessages(prev => [...prev, newMessage]);
        setChatInput("");
    };

    useEffect(() => {
        if (scrollAreaRef.current) {
            const viewport = scrollAreaRef.current.querySelector('div[data-radix-scroll-area-viewport]');
            if (viewport) {
                viewport.scrollTo({ top: viewport.scrollHeight, behavior: 'smooth' });
            }
        }
    }, [messages]);

    return (
        <Card className="flex flex-col border-l rounded-none w-[350px] h-full">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 font-headline">
                    <MessageSquare className="h-6 w-6" />
                    Chat
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 overflow-hidden p-0">
                <ScrollArea className="h-full p-6" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {messages.map((msg, index) => {
                            const avatar = PlaceHolderImages.find(img => img.id === msg.avatar)
                            const isYou = msg.user === displayName;
                            return (
                                <div key={index} className={cn("flex items-start gap-3", isYou && "justify-end")}>
                                    {!isYou && (
                                        <Avatar className="h-8 w-8">
                                            {avatar && <AvatarImage src={avatar.imageUrl} />}
                                            <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn("rounded-lg px-3 py-2 max-w-xs", isYou ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                                        <div className="flex items-baseline gap-2">
                                            {!isYou && <p className="text-xs font-semibold">{msg.user}</p>}
                                            <p className="text-xs text-muted-foreground">{msg.time}</p>
                                        </div>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                    {isYou && (
                                        <Avatar className="h-8 w-8">
                                            {avatar && <AvatarImage src={avatar.imageUrl} />}
                                            <AvatarFallback>{msg.user.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 border-t pt-4">
                <EmojiSuggestions text={chatInput} onEmojiSelect={(emoji) => setChatInput(prev => prev + emoji)} />
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                    <div className="relative flex-1">
                        <Input 
                            type="text" 
                            placeholder="Type a message..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            className="pr-10"
                        />
                        <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                            <Smile className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </div>
                    <Button type="submit" size="icon">
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send Message</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}
