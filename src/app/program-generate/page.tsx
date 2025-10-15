import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const ProgramGenerate = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user } = useUser;
  const router = useRouter;

  const messageContainerRef = useRef<HTMLDivElement>(null);

  // SOLUTION to get rid of "Meeting has ended" error
  useEffect(() => {
    const originalError = console.error;

    // override console.error to ignore "Meeting has ended" errors
    console.error = function (msg, ...args) {
      if (
        msg &&
        (msg.includes("Meeting has ended") ||
          (args[0] && args[0].toString().includes("Meeting has ended")))
      ) {
        console.log("Ignoring known error: Meeting has ended");
        return; // don't pass to original handler
      }

      // pass all other errors to the original handler
      return originalError.call(console, msg, ...args);
    };

    // restore original handler on unmount
    return () => {
      console.error = originalError;
    };
  }, []);

  // auto-scroll messages
  useEffect(() => {
    if (messageContainerRef.current) {
      messageContainerRef.current.scrollTop =
        messageContainerRef.current.scrollHeight;
    }
  }, [messages]);

  // navigate user to profile page after the call ends
  useEffect(() => {
    if (callEnded) {
      const redirectTimer = setTimeout(() => {
        router.push("/profile");
      }, 1500);

      return () => clearTimeout(redirectTimer);
    }
  }, [callEnded, router]);

  useEffect(() => {
    const HandleCallStart = () => {
      console.log("Call Started");
      setConnecting(false);
      setCallActive(true);
      setCallEnded(false);
    };

    const HandelCallEnded = () => {
      console.log("Call Ended");
      setConnecting(false);
      setCallActive(false);
      setSpeaking(false);
      setCallEnded(true);
    };

    const HandleSpeechStart = () => {
      console.log("AI Started Speaking");
      setSpeaking(true);
    };

    const HandleSpeechEnd = () => {
      console.log("AI Ended Speaking");
      setSpeaking(false);
    };

    const HandleMessages = (messages: any) => {};
    const HandleError = (error: any) => {
      console.log("Vapi Error", error);
      setConnecting(false);
      setCallActive(false);
    };

    vapi
      .on("call-start", HandleCallStart)
      .on("call-end", HandelCallEnded)
      .on("speech-start", HandleSpeechStart)
      .on("speech-end", HandleSpeechEnd)
      .on("message", HandleMessages)
      .on("error", HandleError);

    return () => {
      vapi
        .off("call-start", HandleCallStart)
        .off("call-end", HandelCallEnded)
        .off("speech-start", HandleSpeechStart)
        .off("speech-end", HandleSpeechEnd)
        .off("message", HandleMessages)
        .off("error", HandleError);
    };
  }, []);

  const toggleCall = async () => {
    if (callActive) vapi.stop();
    else {
      try {
        setConnecting(true);
        setMessages([]);
        setCallEnded(false);

        const fullName = user?.firstName
        ?`${user.firstName} ${user.lastName} || ""`.trim()
        : "There's no user right now"

        await vapi.start(process.env.NEXT_PUBLIC_VAPI_WORKFLOW_ID!, {
          variableValues: {
            full_name: fullName,
            user_id: user?.id,
          },
        });
      } catch (error) {
        console.log("Failed to start call", error);
        setConnecting(false);
      }
    }
  };

  return <div>this is the program page</div>;
};

export default ProgramGenerate;
