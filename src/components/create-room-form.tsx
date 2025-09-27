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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadCloud, Link, Monitor } from "lucide-react"

const formSchema = z.object({
  sourceType: z.enum(["url", "upload", "screen"]),
  sourceUrl: z.string().url({ message: "Please enter a valid URL." }).optional(),
  sourceFile: z.any().optional(),
  mode: z.enum(["watch", "hangout"]),
})

export function CreateRoomForm() {
  const router = useRouter()

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      sourceType: "url",
      mode: "watch",
    },
  })

  function onSubmit(values: z.infer<typeof formSchema>) {
    // In a real app, you would create the room and get an ID
    const newRoomId = Math.random().toString(36).substr(2, 9)
    console.log("Creating room with values:", values)
    router.push(`/room/${newRoomId}`)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <Tabs defaultValue="url" className="w-full" onValueChange={(value) => form.setValue("sourceType", value as "url" | "upload" | "screen")}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="url"><Link className="mr-2 h-4 w-4" />URL</TabsTrigger>
            <TabsTrigger value="upload"><UploadCloud className="mr-2 h-4 w-4" />Upload</TabsTrigger>
            <TabsTrigger value="screen"><Monitor className="mr-2 h-4 w-4" />Screen</TabsTrigger>
          </TabsList>
          <TabsContent value="url" className="pt-4">
            <FormField
              control={form.control}
              name="sourceUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>YouTube / Direct Video Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://www.youtube.com/watch?v=..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="upload" className="pt-4">
            <FormField
              control={form.control}
              name="sourceFile"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Upload MP4 File</FormLabel>
                  <FormControl>
                    <Input type="file" accept=".mp4" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </TabsContent>
          <TabsContent value="screen" className="pt-4">
            <div className="text-center p-4 border-dashed border-2 rounded-lg">
                <Monitor className="mx-auto h-12 w-12 text-muted-foreground" />
                <p className="mt-2 text-sm text-muted-foreground">You will be prompted to share your screen after creating the room.</p>
            </div>
          </TabsContent>
        </Tabs>

        <FormField
          control={form.control}
          name="mode"
          render={({ field }) => (
            <FormItem className="space-y-3">
              <FormLabel>Room Mode</FormLabel>
              <FormControl>
                <RadioGroup
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  className="flex flex-col space-y-1"
                >
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="watch" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Watch Mode (Video + Text Chat only)
                    </FormLabel>
                  </FormItem>
                  <FormItem className="flex items-center space-x-3 space-y-0">
                    <FormControl>
                      <RadioGroupItem value="hangout" />
                    </FormControl>
                    <FormLabel className="font-normal">
                      Hangout Mode (Video + Live Voice/Video Chat)
                    </FormLabel>
                  </FormItem>
                </RadioGroup>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground">Create Room</Button>
      </form>
    </Form>
  )
}
