
import { Header } from "@/components/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { CheckCircle, Film, Gift, MonitorPlay, Tv, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CreateRoomDialog } from "@/components/create-room-dialog";

export default function Home() {
  const heroImage = PlaceHolderImages.find(img => img.id === 'hero-background');

  const features = [
    {
      icon: <Film className="h-10 w-10 text-primary" />,
      title: "Watch Videos",
      description: "Enjoy content from YouTube, or play your own video files.",
    },
    {
      icon: <MonitorPlay className="h-10 w-10 text-primary" />,
      title: "Share your screen",
      description: "Share a browser tab or your entire screen with your friends.",
    },
    {
      icon: <Tv className="h-10 w-10 text-primary" />,
      title: "Watch on your TV",
      description: "Cast your watch party to a Chromecast-enabled TV.",
    },
    {
      icon: <Gift className="h-10 w-10 text-primary" />,
      title: "Free to use",
      description: "WatchMates is free to use for you and your friends.",
    },
  ];

  const howItWorks = [
    {
      title: "Create a room",
      description: "Create a room and choose a video to watch.",
    },
    {
      title: "Invite your friends",
      description: "Share the room link with your friends to invite them.",
    },
    {
      title: "Enjoy the party",
      description: "Watch the video together in perfect sync.",
    },
  ]

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative h-[60vh] flex items-center justify-center text-center text-white overflow-hidden">
          <video
            autoPlay
            loop
            muted
            playsInline
            className="absolute z-0 w-auto min-w-full min-h-full max-w-none"
          >
            <source src="https://cdn-front.freepik.com/revamp/temp/hero/v4-home-video-with-logos.webm" type="video/webm" />
          </video>
          <div className="absolute inset-0 bg-black/60" />
          <div className="relative z-10 p-4">
            <h1 className="text-4xl md:text-6xl font-bold font-headline">
              Watch videos in sync with friends
            </h1>
            <p className="mt-4 text-lg md:text-xl max-w-2xl mx-auto">
              Create a room, invite your friends, and enjoy your favorite content together.
            </p>
            <div className="mt-8">
              <CreateRoomDialog />
            </div>
          </div>
        </section>

        {/* How it works Section */}
        <section className="py-16 bg-secondary">
            <div className="container mx-auto px-4 text-center">
                <h2 className="text-3xl font-bold font-headline mb-12">How it works</h2>
                <div className="grid md:grid-cols-3 gap-8">
                    {howItWorks.map((step, index) => (
                         <div key={index} className="flex flex-col items-center">
                            <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground text-2xl font-bold mb-4">
                                {index + 1}
                            </div>
                            <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                            <p className="text-muted-foreground">{step.description}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>


        {/* Features Section */}
        <section className="py-16">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold font-headline mb-12">
              Everything you need for a great watch party
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature) => (
                <Card key={feature.title} className="text-center">
                  <CardContent className="p-6 flex flex-col items-center">
                    {feature.icon}
                    <h3 className="text-xl font-bold mt-4 mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
        
        {/* No Registration Section */}
        <section className="py-16 bg-primary text-primary-foreground">
             <div className="container mx-auto px-4 text-center">
                <Users className="h-12 w-12 mx-auto mb-4"/>
                <h2 className="text-3xl font-bold font-headline mb-4">No registration required</h2>
                <p className="text-lg max-w-3xl mx-auto mb-8">Your friends don't need to create an account to join your watch party. Just share the room link and they're in!</p>
                <div className="flex justify-center">
                    <CreateRoomDialog />
                </div>
            </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="border-t">
        <div className="container mx-auto flex items-center justify-between p-4">
            <p className="text-sm text-muted-foreground">&copy; 2024 WatchMates. All rights reserved.</p>
            <div className="flex gap-4">
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Privacy Policy</Link>
                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground">Terms of Service</Link>
            </div>
        </div>
      </footer>
    </div>
  );
}
