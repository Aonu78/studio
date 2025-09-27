"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { useRouter } from "next/navigation"

import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

const formSchema = z.object({
  roomCode: z.string().min(6, {
    message: "Room code must be at least 6 characters.",
  }),
})

export function JoinRoomForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      roomCode: "",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log("Joining room with code:", values.roomCode)
    router.push(`/room/${values.roomCode}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="roomCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Room Code or Link</FormLabel>
              <FormControl>
                <Input placeholder="Enter code..." {...field} />
              </FormControl>
              <FormDescription>
                Paste the shared link or code to join a room.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Join Room</Button>
      </form>
    </Form>
  )
}
