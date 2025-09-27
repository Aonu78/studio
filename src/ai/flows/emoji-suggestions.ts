'use server';

/**
 * @fileOverview An AI agent that suggests relevant emojis based on user text input for the chat system.
 *
 * - getEmojiSuggestions - A function that takes text input and returns suggested emojis.
 * - EmojiSuggestionsInput - The input type for the getEmojiSuggestions function.
 * - EmojiSuggestionsOutput - The return type for the getEmojiSuggestions function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EmojiSuggestionsInputSchema = z.object({
  text: z.string().describe('The text input from the user.'),
});
export type EmojiSuggestionsInput = z.infer<typeof EmojiSuggestionsInputSchema>;

const EmojiSuggestionsOutputSchema = z.object({
  emojis: z.array(z.string()).describe('An array of suggested emojis based on the text input.'),
});
export type EmojiSuggestionsOutput = z.infer<typeof EmojiSuggestionsOutputSchema>;

export async function getEmojiSuggestions(input: EmojiSuggestionsInput): Promise<EmojiSuggestionsOutput> {
  return emojiSuggestionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'emojiSuggestionsPrompt',
  input: {schema: EmojiSuggestionsInputSchema},
  output: {schema: EmojiSuggestionsOutputSchema},
  prompt: `You are a helpful assistant that suggests relevant emojis based on the user's text input in a chat system.

  Given the following text: "{{text}}", suggest up to 5 relevant emojis that the user can use to react to the message. Return the emojis as a JSON array of strings.
  Do not include any explanation or other text in your response, only the JSON array of emojis.
  Example: ['😂', '👍', '🤔']`,
});

const emojiSuggestionsFlow = ai.defineFlow(
  {
    name: 'emojiSuggestionsFlow',
    inputSchema: EmojiSuggestionsInputSchema,
    outputSchema: EmojiSuggestionsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
