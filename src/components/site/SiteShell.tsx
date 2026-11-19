import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
import { WakiliVoiceChat } from "@/components/chat/WakiliVoiceChat";

export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col relative">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />

      {/* Floating Wakili AI Voice Copilot */}
      <div className="fixed bottom-6 right-6 z-50">
        <WakiliVoiceChat
          triggerButton={
            <button
              className="flex items-center gap-2.5 rounded-full bg-gradient-to-r from-flag-green to-emerald-700 px-4 py-2.5 text-white shadow-xl hover:shadow-2xl hover:scale-105 active:scale-95 transition-all border border-white/20 cursor-pointer"
              title="Chat & Talk with Wakili AI (Msingi Swahili Voice)"
            >
              <div className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
              </div>
              <span className="text-xs font-bold tracking-wide">Wakili AI</span>
              <span className="text-[10px] bg-white/20 px-2 py-0.5 rounded-full text-white/90 font-medium">Voice</span>
            </button>
          }
        />
      </div>
    </div>
  );
}
