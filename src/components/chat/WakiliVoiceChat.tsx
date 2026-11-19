import React, { useState, useRef, useEffect } from "react";
import {
  Mic,
  Volume2,
  VolumeX,
  Square,
  Send,
  Sparkles,
  Scale,
  Loader2,
  Radio,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { askWakiliAI, type ChatMessage } from "@/lib/civic-ai-service";
import { MarkdownMessage } from "@/lib/markdown-simple";
import {
  playMsingiSpeech,
  stopCurrentAudio,
  transcribeVoiceRecording,
} from "@/lib/msingi-client";

interface WakiliVoiceChatProps {
  lessonContext?: {
    title: string;
    articles: string[];
    summary: string;
  };
  triggerButton?: React.ReactNode;
}

export function WakiliVoiceChat({ lessonContext, triggerButton }: WakiliVoiceChatProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: lessonContext
        ? `Habari! Mimi ni **Wakili AI**, mwenzako wa kisheria kwa somo la **${lessonContext.title}**. Unaweza kuongea nami kwa Kiswahili, Sheng au Kiingereza kwa kubonyeza maikrofoni hapa chini!`
        : `Habari! Mimi ni **Wakili AI**, mwenzako wa kisheria na Katiba ya Kenya 2010. Unaweza kuongea nami kwa kubonyeza maikrofoni au kuandika swali lako. Karibu!`,
    },
  ]);
  const [inputText, setInputText] = useState("");
  const [isAiLoading, setIsAiLoading] = useState(false);

  // Audio recording state
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Audio playing state
  const [playingMessageIdx, setPlayingMessageIdx] = useState<number | null>(null);
  const [isAudioLoading, setIsAudioLoading] = useState<number | null>(null);
  const [autoSpeak, setAutoSpeak] = useState(true);
  const currentAudioRef = useRef<HTMLAudioElement | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isAiLoading, isTranscribing]);

  useEffect(() => {
    return () => {
      stopCurrentAudio();
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  // Voice recording logic using standard MediaRecorder + Msingi STT
  const startRecording = async () => {
    try {
      stopCurrentAudio();
      setPlayingMessageIdx(null);

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioChunksRef.current = [];

      const mimeType = MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
        ? "audio/webm;codecs=opus"
        : "audio/mp4";

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = async () => {
        stream.getTracks().forEach((track) => track.stop());
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });

        if (audioBlob.size < 1000) {
          toast.info("Recording too short. Please try again.");
          return;
        }

        setIsTranscribing(true);
        try {
          const res = await transcribeVoiceRecording(audioBlob);
          if (res.text && res.text.trim()) {
            toast.success("Voice transcribed by Msingi STT!");
            await handleSendMessage(res.text.trim());
          } else {
            toast.info("No speech detected. Please speak clearly into the microphone.");
          }
        } catch (err) {
          toast.error(err instanceof Error ? err.message : "Failed to transcribe audio.");
        } finally {
          setIsTranscribing(false);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
      toast.info("Recording started. Speak in Swahili, Sheng, or English.");
    } catch (err) {
      console.error(err);
      toast.error("Could not access microphone. Please grant microphone permissions.");
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
    }
  };

  // Play audio for a specific assistant message using Msingi TTS (voice female3)
  const handlePlaySpeech = async (idx: number, text: string) => {
    if (playingMessageIdx === idx) {
      stopCurrentAudio();
      setPlayingMessageIdx(null);
      return;
    }

    stopCurrentAudio();
    setIsAudioLoading(idx);

    try {
      const audio = await playMsingiSpeech(text, {
        voiceId: "female3",
        onStart: () => {
          setIsAudioLoading(null);
          setPlayingMessageIdx(idx);
        },
        onEnd: () => {
          setPlayingMessageIdx(null);
        },
        onError: (err) => {
          setIsAudioLoading(null);
          setPlayingMessageIdx(null);
          toast.error(err.message || "Audio playback error.");
        },
      });
      currentAudioRef.current = audio;
    } catch (err) {
      setIsAudioLoading(null);
      setPlayingMessageIdx(null);
      toast.error(err instanceof Error ? err.message : "Failed to synthesize speech.");
    }
  };

  // Send message
  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isAiLoading) return;

    const newMsgs: ChatMessage[] = [...messages, { role: "user", content: text }];
    // Add a streaming placeholder immediately
    setMessages([...newMsgs, { role: "assistant", content: "" }]);
    if (!textToSend) setInputText("");
    setIsAiLoading(true);

    try {
      const reply = await askWakiliAI(
        newMsgs,
        lessonContext,
        // Real-time streaming: update last message as tokens arrive
        (currentText) => {
          setMessages([...newMsgs, { role: "assistant", content: currentText }]);
        },
      );

      const updated = [...newMsgs, { role: "assistant" as const, content: reply }];
      setMessages(updated);

      // Auto-speak the final reply with Msingi TTS if enabled
      if (autoSpeak && reply.trim()) {
        handlePlaySpeech(updated.length - 1, reply);
      }
    } catch {
      setMessages([
        ...newMsgs,
        {
          role: "assistant",
          content:
            "Pole sana! Hukuweza kuunganishwa kwa sasa. Kumbuka Katiba ya Kenya 2010 ndiyo sheria kuu inayolinda haki zako daima!",
        },
      ]);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {triggerButton || (
          <Button
            size="sm"
            className="rounded-full bg-gradient-to-r from-flag-green to-emerald-700 text-white shadow-lg hover:shadow-xl font-semibold gap-2 border border-white/20"
          >
            <Radio className="h-4 w-4 animate-pulse text-gold" />
            <span>Ongea na Wakili AI</span>
          </Button>
        )}
      </DialogTrigger>

      <DialogContent className="max-w-2xl h-[85vh] p-0 flex flex-col gap-0 overflow-hidden rounded-3xl border-border bg-card">
        {/* Header */}
        <DialogHeader className="p-4 border-b bg-muted/40 flex flex-row items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-flag-green text-white shadow-md">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <DialogTitle className="text-base font-display font-bold">
                  Wakili AI · Voice & Chat Copilot
                </DialogTitle>
                <Badge variant="outline" className="text-[10px] bg-flag-green/10 text-flag-green border-flag-green/30">
                  Msingi AI (Swahili female3)
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {lessonContext ? `Context: ${lessonContext.title}` : "Katiba ya Kenya 2010 Civic Intelligence"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setAutoSpeak(!autoSpeak)}
              className={cn(
                "h-8 px-2.5 text-xs rounded-full border",
                autoSpeak
                  ? "bg-flag-green/10 text-flag-green border-flag-green/30"
                  : "text-muted-foreground border-transparent",
              )}
              title={autoSpeak ? "Auto-speak replies is ON" : "Auto-speak replies is OFF"}
            >
              {autoSpeak ? <Volume2 className="h-3.5 w-3.5 mr-1" /> : <VolumeX className="h-3.5 w-3.5 mr-1" />}
              <span className="hidden sm:inline">Auto-Voice</span>
            </Button>
          </div>
        </DialogHeader>

        {/* Chat message stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((m, idx) => {
            const isAssistant = m.role === "assistant";
            const isPlayingThis = playingMessageIdx === idx;
            const isLoadingThis = isAudioLoading === idx;

            return (
              <div
                key={idx}
                className={cn(
                  "flex flex-col gap-1.5 max-w-[85%]",
                  isAssistant ? "mr-auto items-start" : "ml-auto items-end",
                )}
              >
                <div
                  className={cn(
                    "rounded-2xl p-4 text-sm leading-relaxed shadow-sm",
                    isAssistant
                      ? "bg-muted/80 text-foreground border border-border/70 rounded-tl-none"
                      : "bg-primary text-primary-foreground font-medium rounded-tr-none",
                  )}
                >
                  {isAssistant ? (
                    <MarkdownMessage>{m.content}</MarkdownMessage>
                  ) : (
                    <div className="whitespace-pre-wrap">{m.content}</div>
                  )}

                  {isAssistant && (
                    <div className="mt-3 pt-2.5 border-t border-border/40 flex items-center justify-between gap-2 text-xs">
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handlePlaySpeech(idx, m.content)}
                        disabled={isLoadingThis}
                        className={cn(
                          "h-7 rounded-full text-[11px] gap-1.5 px-3 transition-colors",
                          isPlayingThis
                            ? "bg-red-500/10 text-red-600 hover:bg-red-500/20 border border-red-500/30"
                            : "bg-background/80 hover:bg-background border border-border/60",
                        )}
                      >
                        {isLoadingThis ? (
                          <>
                            <Loader2 className="h-3 w-3 animate-spin text-flag-green" />
                            <span>Inatengeneza sauti...</span>
                          </>
                        ) : isPlayingThis ? (
                          <>
                            <Square className="h-3 w-3 fill-current text-red-500" />
                            <span>Sitisha (Stop)</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3 w-3 text-flag-green" />
                            <span>Sikiza (Listen)</span>
                          </>
                        )}
                      </Button>

                      {isPlayingThis && (
                        <div className="flex items-center gap-1 text-[11px] text-flag-green font-mono">
                          <span className="inline-block h-2 w-1 bg-flag-green animate-pulse" />
                          <span className="inline-block h-3.5 w-1 bg-flag-green animate-bounce" />
                          <span className="inline-block h-2 w-1 bg-flag-green animate-pulse" />
                          <span className="ml-1 text-[10px] text-muted-foreground">Msingi female3</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}

          {isTranscribing && (
            <div className="mr-auto rounded-2xl bg-gold/10 border border-gold/30 p-3.5 text-xs text-gold flex items-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Msingi STT: Inanukuu sauti yako kwa Kiswahili / Sheng...</span>
            </div>
          )}

          {isAiLoading && messages[messages.length - 1]?.role !== "assistant" && (
            <div className="mr-auto rounded-2xl bg-muted/70 p-3.5 text-xs text-muted-foreground flex items-center gap-2 animate-pulse">
              <Sparkles className="h-3.5 w-3.5 text-flag-green" />
              <span>Wakili AI anatafuta vifungu vya Katiba...</span>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Quick Swahili / Civic Prompts */}
        <div className="border-t border-border/40 p-2.5 bg-muted/20 flex flex-wrap gap-1.5 shrink-0">
          <button
            onClick={() => handleSendMessage("Nielezee haki zangu nikikamatwa na polisi kwa Kiswahili na Sheng")}
            className="rounded-full bg-card border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-flag-green transition-colors"
          >
            👮 Haki wakati wa kukamatwa
          </button>
          <button
            onClick={() => handleSendMessage("Je, nina haki ya kufanya maandamano ya amani chini ya Ibara ya 37?")}
            className="rounded-full bg-card border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-flag-green transition-colors"
          >
            📢 Maandamano ya amani (Art. 37)
          </button>
          <button
            onClick={() => handleSendMessage("Polisi wanaweza kuchukua au kupekua simu yangu bila kibali?")}
            className="rounded-full bg-card border px-2.5 py-1 text-[11px] text-muted-foreground hover:text-foreground hover:border-flag-green transition-colors"
          >
            📱 Upekuzi wa simu (Privacy Art. 31)
          </button>
        </div>

        {/* Input Bar with Mic & Send */}
        <div className="border-t p-3 bg-card flex items-center gap-2 shrink-0">
          {/* Microphone button */}
          <Button
            type="button"
            size="icon"
            onClick={isRecording ? stopRecording : startRecording}
            disabled={isAiLoading || isTranscribing}
            className={cn(
              "rounded-full shrink-0 h-10 w-10 transition-all",
              isRecording
                ? "bg-red-600 text-white animate-pulse hover:bg-red-700 shadow-md ring-4 ring-red-500/20"
                : "bg-flag-green hover:bg-flag-green/90 text-white shadow-sm",
            )}
            title={isRecording ? "Stop recording and transcribe" : "Record your voice to talk"}
          >
            {isRecording ? <Square className="h-4 w-4 fill-current" /> : <Mic className="h-4 w-4" />}
          </Button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
            placeholder={
              isRecording
                ? "🎙️ Inarekodi... Zungumza sasa..."
                : isTranscribing
                  ? "Inanukuu sauti yako..."
                  : "Andika swali lako au bonyeza maikrofoni kuongea..."
            }
            disabled={isRecording || isTranscribing}
            className="flex-1 rounded-full border border-border bg-muted/50 px-4 py-2.5 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-flag-green"
          />

          <Button
            type="button"
            size="icon"
            onClick={() => handleSendMessage()}
            disabled={!inputText.trim() || isAiLoading || isRecording || isTranscribing}
            className="rounded-full shrink-0 h-10 w-10 bg-primary text-primary-foreground hover:opacity-90"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
