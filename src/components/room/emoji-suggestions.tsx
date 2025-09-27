"use client"

import { useState, useEffect, useTransition } from 'react';
import { getEmojiSuggestions } from '@/ai/flows/emoji-suggestions';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface EmojiSuggestionsProps {
  text: string;
  onEmojiSelect: (emoji: string) => void;
}

export function EmojiSuggestions({ text, onEmojiSelect }: EmojiSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    const fetchSuggestions = () => {
      if (text.trim().length < 3) {
        setSuggestions([]);
        return;
      }
      startTransition(async () => {
        try {
          const result = await getEmojiSuggestions({ text });
          setSuggestions(result.emojis);
        } catch (error) {
          console.error("Failed to fetch emoji suggestions:", error);
          setSuggestions([]);
        }
      });
    };

    const timeoutId = setTimeout(fetchSuggestions, 500); // Debounce
    return () => clearTimeout(timeoutId);
  }, [text]);

  if (isPending) {
    return (
      <div className="h-9 flex items-center text-sm text-muted-foreground">
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        Getting suggestions...
      </div>
    );
  }

  if (suggestions.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-1 items-center flex-wrap">
      <p className="text-xs text-muted-foreground mr-2">Suggestions:</p>
      {suggestions.map((emoji, index) => (
        <Button
          key={index}
          variant="outline"
          size="icon"
          className="h-7 w-7 text-xl rounded-full"
          onClick={() => onEmojiSelect(emoji)}
        >
          {emoji}
        </Button>
      ))}
    </div>
  );
}
