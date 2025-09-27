import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CreateRoomDialog } from "@/components/create-room-dialog"
import { JoinRoomForm } from "@/components/join-room-form"
import { Header } from "@/components/header"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl font-headline text-primary">
              Welcome to SyncWatch
            </CardTitle>
            <CardDescription className="pt-2">
              Your space to watch videos with friends, perfectly in sync.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="create" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="create">Create Room</TabsTrigger>
                <TabsTrigger value="join">Join Room</TabsTrigger>
              </TabsList>
              <TabsContent value="create" className="flex flex-col items-center pt-6">
                 <p className="text-sm text-muted-foreground mb-4">Become the host and start a new watch party.</p>
                <CreateRoomDialog />
              </TabsContent>
              <TabsContent value="join" className="pt-6">
                <JoinRoomForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
