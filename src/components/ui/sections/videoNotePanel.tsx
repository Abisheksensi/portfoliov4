"use client";

import { motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { tokens } from "../../../tokens/tokens";

type VideoNoteStatus =
  | "requesting"
  | "ready"
  | "recording"
  | "review"
  | "sending"
  | "sent"
  | "error";

interface VideoNotePanelProps {
  readonly onSchedule: () => void;
  readonly onStageChange: (stage: "capture" | "review") => void;
}

const panelEase = [0.22, 1, 0.36, 1] as const;

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

function getRecordingMimeType() {
  if (typeof MediaRecorder === "undefined") return "";

  return (
    [
      "video/webm;codecs=vp9,opus",
      "video/webm;codecs=vp8,opus",
      "video/webm",
      "video/mp4",
    ].find((type) => MediaRecorder.isTypeSupported(type)) ?? ""
  );
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 18 18" className="h-[18px] w-[18px]" fill="none" aria-hidden="true">
      <rect x="2" y="4.25" width="9.5" height="9.5" rx="1.8" stroke="currentColor" strokeWidth="1.4" />
      <path d="m11.5 7 4-2v8l-4-2V7Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
    </svg>
  );
}

export default function VideoNotePanel({
  onSchedule,
  onStageChange,
}: VideoNotePanelProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordedUrlRef = useRef<string | null>(null);
  const isMountedRef = useRef(true);
  const [status, setStatus] = useState<VideoNoteStatus>("requesting");
  const [recordedBlob, setRecordedBlob] = useState<Blob | null>(null);
  const [message, setMessage] = useState("Allow camera and microphone access to begin.");
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  const attachStreamToPreview = useCallback((stream: MediaStream) => {
    const preview = videoRef.current;
    if (!preview) return;

    preview.src = "";
    preview.srcObject = stream;
    preview.muted = true;
    preview.controls = false;
    void preview.play().catch(() => undefined);
  }, []);

  const requestCamera = useCallback(async () => {
    if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
      setStatus("error");
      setMessage("Video recording is not supported in this browser.");
      return;
    }

    setStatus("requesting");
    setMessage("Allow camera and microphone access to begin.");

    try {
      stopStream(streamRef.current);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: "user",
          width: { ideal: 1280 },
          height: { ideal: 720 },
        },
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
        },
      });

      if (!isMountedRef.current) {
        stopStream(stream);
        return;
      }

      streamRef.current = stream;
      attachStreamToPreview(stream);
      setStatus("ready");
      setMessage("Camera ready. Record a short introduction when you are ready.");
    } catch {
      setStatus("error");
      setMessage("Camera access was unavailable. Check your browser permissions and try again.");
    }
  }, [attachStreamToPreview]);

  useEffect(() => {
    isMountedRef.current = true;
    const cameraTimer = window.setTimeout(() => {
      void requestCamera();
    }, 0);

    return () => {
      window.clearTimeout(cameraTimer);
      isMountedRef.current = false;
      const recorder = recorderRef.current;
      if (recorder?.state === "recording") {
        recorder.ondataavailable = null;
        recorder.onstop = null;
        recorder.stop();
      }
      stopStream(streamRef.current);
      if (recordedUrlRef.current) URL.revokeObjectURL(recordedUrlRef.current);
    };
  }, [requestCamera]);

  useEffect(() => {
    if (status !== "recording") return;

    const timer = window.setInterval(() => {
      setElapsedSeconds((seconds) => seconds + 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [status]);

  const startRecording = () => {
    const stream = streamRef.current;
    if (!stream) {
      void requestCamera();
      return;
    }

    const mimeType = getRecordingMimeType();
    let recorder: MediaRecorder;

    try {
      recorder = new MediaRecorder(
        stream,
        mimeType ? { mimeType, videoBitsPerSecond: 2_500_000 } : undefined
      );
    } catch {
      setStatus("error");
      setMessage("Recording could not start in this browser. Please try again.");
      return;
    }

    chunksRef.current = [];
    setElapsedSeconds(0);
    setRecordedBlob(null);
    onStageChange("capture");

    recorder.ondataavailable = (event) => {
      if (event.data.size > 0) chunksRef.current.push(event.data);
    };

    recorder.onstop = () => {
      if (!isMountedRef.current) return;

      const blob = new Blob(chunksRef.current, {
        type: recorder.mimeType || "video/webm",
      });
      const url = URL.createObjectURL(blob);

      if (recordedUrlRef.current) URL.revokeObjectURL(recordedUrlRef.current);
      recordedUrlRef.current = url;
      setRecordedBlob(blob);
      setStatus("review");
      setMessage("Your video is ready to review and send.");
      onStageChange("review");
      stopStream(streamRef.current);
      streamRef.current = null;

      const preview = videoRef.current;
      if (preview) {
        preview.srcObject = null;
        preview.src = url;
        preview.muted = false;
        preview.controls = true;
        preview.currentTime = 0;
      }
    };

    recorderRef.current = recorder;
    try {
      recorder.start(250);
      setStatus("recording");
      setMessage("Recording in progress.");
    } catch {
      setStatus("error");
      setMessage("Recording could not start in this browser. Please try again.");
    }
  };

  const stopRecording = () => {
    if (recorderRef.current?.state === "recording") {
      recorderRef.current.stop();
    }
  };

  const sendVideo = async () => {
    if (!recordedBlob) return;

    setStatus("sending");
    setMessage("Preparing your video note…");

    const isMp4 = recordedBlob.type.includes("mp4");
    const file = new File(
      [recordedBlob],
      `video-note-${new Date().toISOString().replace(/[:.]/g, "-")}.${isMp4 ? "mp4" : "webm"}`,
      { type: recordedBlob.type }
    );
    const endpoint = process.env.NEXT_PUBLIC_VIDEO_NOTE_ENDPOINT;

    try {
      if (endpoint) {
        const formData = new FormData();
        formData.append("video", file);
        const response = await fetch(endpoint, { method: "POST", body: formData });
        if (!response.ok) throw new Error("Video upload failed");

        setStatus("sent");
        setMessage("Video note sent. Thank you.");
        return;
      }

      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: "Portfolio video note",
          text: "A video note recorded from the portfolio contact page.",
        });
        setStatus("sent");
        setMessage("Video note shared. Thank you.");
        return;
      }

      const downloadLink = document.createElement("a");
      downloadLink.href = recordedUrlRef.current ?? URL.createObjectURL(recordedBlob);
      downloadLink.download = file.name;
      downloadLink.click();
      setStatus("sent");
      setMessage("Video saved to your device. Attach it to your message to send it.");
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        setStatus("review");
        setMessage("Your video is ready whenever you want to send it.");
        return;
      }

      setStatus("review");
      setMessage("The video could not be sent. Please try again.");
    }
  };

  const handlePrimaryAction = () => {
    if (status === "ready") startRecording();
    else if (status === "recording") stopRecording();
    else if (status === "review" || status === "sent") void sendVideo();
    else if (status === "error") void requestCamera();
  };

  const primaryLabel = {
    requesting: "Connecting Camera…",
    ready: "Start Recording",
    recording: "Stop Recording",
    review: "Send The Video Note",
    sending: "Preparing Video…",
    sent: "Send The Video Note",
    error: "Try Camera Again",
  }[status];

  return (
    <motion.div
      key="video-note"
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: "auto", opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{
        height: { type: "spring", bounce: 0.04, duration: 0.62 },
        opacity: { duration: 0.25, ease: panelEase },
      }}
      className="overflow-hidden"
      style={{ fontFamily: tokens.typography.font.family.title }}
    >
      <div className="flex flex-col gap-3 px-4 pb-4 pt-5">
        <div className="relative aspect-[16/10] w-full overflow-hidden rounded-[24px] bg-[#d9d9d9]">
          <video
            ref={videoRef}
            className={`h-full w-full object-cover ${
              status === "review" || status === "sent" || status === "sending"
                ? ""
                : "[transform:scaleX(-1)]"
            }`}
            playsInline
            autoPlay
            aria-label={status === "review" || status === "sent" ? "Recorded video preview" : "Live camera preview"}
          />

          {status === "requesting" || status === "error" ? (
            <div className="absolute inset-0 flex items-center justify-center px-8 text-center text-xs leading-relaxed text-[#666]">
              {message}
            </div>
          ) : null}

          {status === "recording" ? (
            <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-[#23282b]/85 px-3 py-1.5 text-[11px] text-white backdrop-blur-sm">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#f8703e]" />
              REC {String(Math.floor(elapsedSeconds / 60)).padStart(2, "0")}:{String(elapsedSeconds % 60).padStart(2, "0")}
            </div>
          ) : null}
        </div>

        <button
          type="button"
          onClick={handlePrimaryAction}
          disabled={status === "requesting" || status === "sending"}
          className="flex h-[54px] w-full items-center justify-center gap-4 rounded-lg border border-[#34393c] bg-[#23282b] text-xs text-[#edecec] transition-colors hover:border-[#5b6164] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#edecec] disabled:cursor-wait disabled:opacity-60"
        >
          {status === "ready" ? <CameraIcon /> : null}
          {status === "recording" ? <span className="h-3.5 w-3.5 rounded-[2px] bg-[#edecec]" aria-hidden="true" /> : null}
          <span>{primaryLabel}</span>
        </button>

        <button
          type="button"
          onClick={onSchedule}
          className="flex h-[54px] w-full items-center justify-center rounded-lg bg-[#f0ebe0] text-xs text-[#23282b] transition-colors hover:bg-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#edecec]"
        >
          Schedule A Call
        </button>

        <p className="sr-only" aria-live="polite">{message}</p>
      </div>
    </motion.div>
  );
}
