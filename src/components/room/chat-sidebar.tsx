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
import { useUser, useFirestore, useCollection, addDocumentNonBlocking, useMemoFirebase } from "@/firebase"
import { collection, query, orderBy, serverTimestamp, Timestamp } from "firebase/firestore"

interface ChatMessage {
  id: string;
  user: string;
  userId: string;
  text: string;
  avatar: string;
  timestamp: Timestamp;
}


export function ChatSidebar({ displayName, roomId }: { displayName: string, roomId: string }) {
    const [chatInput, setChatInput] = useState("");
    const scrollAreaRef = useRef<HTMLDivElement>(null);
    const { user } = useUser();
    const firestore = useFirestore();

    const messagesCollectionRef = useMemoFirebase(() => {
        if (!firestore) return null;
        return collection(firestore, `rooms/${roomId}/messages`);
    }, [firestore, roomId]);

    const messagesQuery = useMemoFirebase(() => {
        if (!messagesCollectionRef) return null;
        return query(messagesCollectionRef, orderBy("timestamp", "asc"));
    }, [messagesCollectionRef]);
    
    const { data: messages, isLoading } = useCollection<ChatMessage>(messagesQuery);

    const handleSendMessage = (e: FormEvent) => {
        e.preventDefault();
        if (chatInput.trim() === "" || !messagesCollectionRef || !displayName) return;

        const newMessage = {
            user: displayName,
            userId: user?.uid || 'guest',
            text: chatInput,
            avatar: user?.photoURL || 'avatar-1',
            timestamp: serverTimestamp(),
            expireAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 hours from now
        };

        addDocumentNonBlocking(messagesCollectionRef, newMessage);
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

    const canChat = !!displayName;

    return (
        <Card className="flex flex-col border-l rounded-none w-[350px] h-full">
            <CardHeader className="flex-shrink-0">
                <CardTitle className="flex items-center gap-2 font-headline">
                    <MessageSquare className="h-6 w-6" />
                    Chat
                </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col p-0 min-h-0">
                <ScrollArea className="flex-1 p-6" ref={scrollAreaRef}>
                    <div className="space-y-4">
                        {isLoading && <p>Loading messages...</p>}
                        {messages && messages.map((msg) => {
                            const avatar = PlaceHolderImages.find(img => img.id === msg.avatar) || (msg.avatar && !msg.avatar.startsWith('avatar-') ? { imageUrl: msg.avatar } : null);
                            const isYou = msg.userId === (user?.uid || 'guest') && msg.user === displayName;
                            return (
                                <div key={msg.id} className={cn("flex items-start gap-3", isYou && "justify-end")}>
                                    {!isYou && (
                                        <Avatar className="h-8 w-8">
                                            {avatar && <AvatarImage src={avatar.imageUrl} />}
                                            <AvatarFallback>{msg.user?.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                    <div className={cn("rounded-lg px-3 py-2 max-w-xs", isYou ? 'bg-primary text-primary-foreground' : 'bg-secondary')}>
                                        <div className="flex items-baseline gap-2">
                                            {!isYou && <p className="text-xs font-semibold">{msg.user}</p>}
                                            <p className="text-xs text-muted-foreground">{msg.timestamp?.toDate().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                        </div>
                                        <p className="text-sm">{msg.text}</p>
                                    </div>
                                    {isYou && (
                                        <Avatar className="h-8 w-8">
                                            {avatar && <AvatarImage src={avatar.imageUrl} />}
                                            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                                        </Avatar>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </ScrollArea>
            </CardContent>
            <CardFooter className="flex-col items-start gap-2 border-t pt-4 flex-shrink-0">
                <EmojiSuggestions text={chatInput} onEmojiSelect={(emoji) => setChatInput(prev => prev + emoji)} />
                <form onSubmit={handleSendMessage} className="flex w-full items-center space-x-2">
                    <div className="relative flex-1">
                        <Input 
                            type="text" 
                            placeholder="Type a message..."
                            value={chatInput}
                            onChange={(e) => setChatInput(e.target.value)}
                            className="pr-10"
                            disabled={!canChat}
                        />
                        <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8">
                            <Smile className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </div>
                    <Button type="submit" size="icon" disabled={!canChat || chatInput.trim() === ""}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send Message</span>
                    </Button>
                </form>
            </CardFooter>
        </Card>
    )
}
