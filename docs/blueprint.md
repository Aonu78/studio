# **App Name**: SyncWatch

## Core Features:

- User Authentication: Allow users to join as guests or with Google/email login. Store display name and avatar.
- Room Management: Enable users to create and join rooms, setting the content source to either a URL or a video file. Room will generate a shareable link. Room locks.
- Playback Synchronization: Synchronize video playback across all users. Transfer host controls if the host leaves.
- Text Chat: Provide a real-time text chat system with timestamps, emoji reactions, and optional GIF/sticker support. Leverage AI to suggest relevant emojis for the user to choose; this will act as a tool for more efficient emoji reactions.
- Live Voice/Video Chat: Integrate an optional voice/video communication system, allowing users to toggle mic/camera, share screen, and switch between audio-only and video participation. The host will have mute and remove rights.
- Responsive Layout: Maintain a central video player with a docked voice/video panel that can be expanded or minimized. Floating Picture-in-Picture mode for minimized AV panel.
- Performance Handling: Utilize peer-to-peer WebRTC mesh for up to 6 live AV participants. Auto-switch extra users to viewer-only mode.

## Style Guidelines:

- Primary color: Vibrant blue (#29ABE2) to evoke connection and engagement.
- Background color: Light gray (#F0F2F5), a muted shade of the primary, to keep the focus on the video content.
- Accent color: Soft orange (#FFB347) for interactive elements like buttons and chat highlights.
- Font pairing: 'Poppins' (sans-serif) for headlines and 'PT Sans' (sans-serif) for body text, combining clarity with a touch of modernity.
- Use clean, minimalist icons to represent actions like play, pause, mute, camera on/off, and screen sharing.
- Maintain a central video player with a docked voice/video panel that can be expanded or minimized. Implement a floating Picture-in-Picture mode for the AV panel.
- Incorporate subtle transitions and animations for a polished user experience. For instance, smooth transitions when toggling mic/camera or expanding/collapsing the AV panel.