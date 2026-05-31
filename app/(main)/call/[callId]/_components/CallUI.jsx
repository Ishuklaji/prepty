"use client";

import { useEffect, useCallback, useState } from "react";

// Stream Video
import {
  StreamTheme,
  SpeakerLayout,
  useCallStateHooks,
  useCall,
  CallingState,
  CallControls,
} from "@stream-io/video-react-sdk";
import "@stream-io/video-react-sdk/dist/css/styles.css";

// Stream Chat
import {
  Chat,
  Channel,
  MessageList,
  MessageComposer,
  Window,
  useCreateChatClient,
} from "stream-chat-react";
import "stream-chat-react/dist/css/index.css";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Sparkles, Loader2 } from "lucide-react";
import AIQuestionsPanel from "./AIQuestions";

// ─── Call UI (inside StreamCall context) ─────────────────────────────────────

export default function CallUI({
  callId,
  isInterviewer,
  booking,
  onLeave,
  apiKey,
  token,
  currentUser,
}) {
  const { useCallCallingState } = useCallStateHooks();
  const call = useCall();
  const callingState = useCallCallingState();

  // Auto-stop recording before leaving
  const handleLeave = useCallback(async () => {
    try {
      if (call) {
        const isRecording = call.state?.recording;
        if (isRecording) {
          await call.stopRecording().catch(() => {});
        }
        await call.leave().catch(() => {});
      }
    } finally {
      onLeave();
    }
  }, [call, onLeave]);

  // ── Chat client — same token works for both Video + Chat SDKs ──
  const chatClient = useCreateChatClient({
    apiKey,
    tokenOrProvider: token,
    userData: {
      id: currentUser.id,
      name: currentUser.name,
      image: currentUser.imageUrl,
    },
  });

  const [chatChannel, setChatChannel] = useState(null);

  useEffect(() => {
    if (!chatClient) return;

    const channel = chatClient.channel("messaging", callId, {
      name: "Interview Chat",
      members: [
        booking.interviewer.clerkUserId,
        booking.interviewee.clerkUserId,
      ],
    });

    channel
      .watch()
      .then(() => setChatChannel(channel))
      .catch(console.error);

    return () => {
      channel.stopWatching().catch(() => {});
    };
  }, [chatClient, callId, booking]);

  if (callingState === CallingState.LEFT) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex flex-col items-center justify-center gap-3">
        <p className="text-stone-400 text-sm">Leaving call…</p>
      </div>
    );
  }

  return (
    <div className="grid flex-1 min-h-0 w-full overflow-hidden grid-cols-[minmax(0,1fr)_380px]">
      <div className="min-w-0 min-h-0 overflow-hidden">
        <StreamTheme className="flex h-full min-h-0 flex-col">
          <div className="call-video-stage flex-1 min-h-0 w-full overflow-hidden">
            <SpeakerLayout participantBarPosition="bottom" />
          </div>

          <div className="shrink-0">
            <CallControls onLeave={handleLeave} />
          </div>
        </StreamTheme>
      </div>

      <div className="min-h-0 min-w-0 overflow-hidden border-l border-white/[0.08] bg-[#0a0a0b]">
        <Tabs
          defaultValue="chat"
          className="flex h-full min-h-0 w-full min-w-0 flex-col overflow-hidden"
        >
          <TabsList
            variant="line"
            className={`shrink-0 grid w-full ${isInterviewer ? "grid-cols-1" : "grid-cols-2"}`}
          >
            <TabsTrigger value="chat" className="min-w-0 gap-2">
              <MessageSquare size={13} />
              Chat
            </TabsTrigger>

            {!isInterviewer && (
              <TabsTrigger value="questions" className="min-w-0 gap-2">
                <Sparkles size={13} />
                AI Questions
              </TabsTrigger>
            )}
          </TabsList>

          <TabsContent
            value="chat"
            className="m-0 flex-1 min-h-0 min-w-0 overflow-hidden"
          >
            {chatClient && chatChannel ? (
              <div className="h-full min-h-0 w-full min-w-0 overflow-hidden">
                <Chat client={chatClient} theme="str-chat__theme-dark">
                  <Channel channel={chatChannel}>
                    <Window>
                      <MessageList />
                      <MessageComposer focus />
                    </Window>
                  </Channel>
                </Chat>
              </div>
            ) : (
              <div className="flex h-full items-center justify-center">
                <Loader2 size={18} className="text-stone-600 animate-spin" />
              </div>
            )}
          </TabsContent>

          <TabsContent
            value="questions"
            className="p-4 h-full overflow-y-scroll max-h-screen"
          >
            <AIQuestionsPanel categories={booking.categories} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
