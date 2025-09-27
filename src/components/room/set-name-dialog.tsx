"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormMessage } from "../ui/form";
import { useUser, useFirestore, setDocumentNonBlocking } from "@/firebase";
import { doc } from "firebase/firestore";

interface SetNameDialogProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onNameSet: (name: string) => void;
}

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
});

export function SetNameDialog({ isOpen, onOpenChange, onNameSet }: SetNameDialogProps) {
  const { user } = useUser();
  const firestore = useFirestore();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
    },
  });

  const handleSubmit = (values: z.infer<typeof formSchema>) => {
    onNameSet(values.name);
    if (user && firestore) {
      const userRef = doc(firestore, 'users', user.uid);
      setDocumentNonBlocking(userRef, { displayName: values.name }, { merge: true });
    }
    onOpenChange(false);
    form.reset();
  };

  // Prevent closing the dialog by clicking outside or pressing ESC
  const handleOpenChange = (open: boolean) => {
    if (!open) return;
    onOpenChange(open);
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Welcome to the Room!</DialogTitle>
          <DialogDescription>
            Please set your display name before joining the party.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4 py-4">
                 <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <Label htmlFor="name">Display Name</Label>
                            <FormControl>
                                <Input id="name" placeholder="Your Name" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                    />
                <DialogFooter>
                    <Button type="submit">Join Party</Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
