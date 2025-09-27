import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { CreateRoomForm } from "@/components/create-room-form"

export function CreateRoomDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full max-w-xs bg-primary hover:bg-primary/90">Create a New Room</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle className="font-headline">Create New Watch Party</DialogTitle>
          <DialogDescription>
            Configure your room and start watching with friends.
          </DialogDescription>
        </DialogHeader>
        <CreateRoomForm />
      </DialogContent>
    </Dialog>
  )
}
