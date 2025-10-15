import { vapi } from "@/lib/vapi";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

const ProgramGenerate = () => {
  const [callActive, setCallActive] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [messages, setMessages] = useState([]);
  const [callEnded, setCallEnded] = useState(false);

  const { user } = useUser;
  const router = useRouter;

  const messageContainerRef = useRef<HTMLDivElement>(null);

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

  return <div>this is the program page</div>;
};

export default ProgramGenerate;
