import { motion } from 'motion/react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';
import { Cpu, Wifi, ShieldAlert } from 'lucide-react';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan selection:bg-magenta selection:text-black overflow-x-hidden">
      {/* CRT Overlay Effects */}
      <div className="static-noise" />
      <div className="scanline" />
      
      <main className="relative z-10 container mx-auto px-4 py-12 flex flex-col items-center gap-12">
        {/* Cryptic Header */}
        <motion.header 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="w-full max-w-4xl border-b-4 border-magenta pb-8 flex flex-col md:flex-row items-end justify-between gap-8"
        >
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <Cpu className="h-10 w-10 text-magenta animate-pulse" />
              <h1 className="glitch-text text-5xl font-black uppercase tracking-tighter text-white" data-text="CORE_ACCESS">
                CORE_ACCESS
              </h1>
            </div>
            <p className="font-mono text-xs uppercase tracking-[0.5em] text-cyan/60">
              TERMINAL_ID: 844852220067 // AUTH_LEVEL: OMEGA
            </p>
          </div>

          <div className="flex flex-col items-end gap-1 font-mono text-[10px] uppercase text-magenta">
            <div className="flex items-center gap-2">
              <Wifi className="h-3 w-3" />
              <span>UPLINK_STABLE</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldAlert className="h-3 w-3" />
              <span>ENCRYPTION_ACTIVE</span>
            </div>
          </div>
        </motion.header>

        {/* Main Interface Grid */}
        <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Left: System Diagnostics */}
          <motion.div 
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-3 flex flex-col gap-8"
          >
            <div className="border-2 border-cyan p-4 bg-cyan/5">
              <h4 className="text-xs font-bold uppercase mb-4 border-b border-cyan/30 pb-2">SYS_LOG</h4>
              <div className="font-mono text-[10px] space-y-2 text-cyan/80">
                <p className="text-magenta">[0.000] KERNEL_INIT_SUCCESS</p>
                <p>[0.124] MEMORY_ALLOC_OK</p>
                <p>[0.452] AUDIO_DRIVER_LOADED</p>
                <p className="text-magenta">[0.891] SNAKE_ENGINE_READY</p>
                <p className="animate-pulse">[1.204] WAITING_FOR_INPUT...</p>
              </div>
            </div>

            <div className="border-2 border-magenta p-4 bg-magenta/5">
              <h4 className="text-xs font-bold uppercase mb-4 border-b border-magenta/30 pb-2">PROTOCOL_V4</h4>
              <p className="font-mono text-[10px] leading-relaxed text-magenta/80">
                NEURAL_LINK_ESTABLISHED. DO_NOT_DISCONNECT_DURING_DATA_TRANSFER.
                FAILURE_TO_COMPLY_RESULTS_IN_CORE_CORRUPTION.
              </p>
            </div>
          </motion.div>

          {/* Center: The Core (Game) */}
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', damping: 12 }}
            className="lg:col-span-6 flex justify-center"
          >
            <div className="w-full">
              <SnakeGame />
            </div>
          </motion.div>

          {/* Right: Audio Uplink (Player) */}
          <motion.div 
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-3 flex flex-col gap-8"
          >
            <MusicPlayer />
            
            <div className="border-2 border-cyan p-4 bg-cyan/5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1 bg-cyan animate-pulse" />
              <h4 className="text-xs font-bold uppercase mb-2 text-cyan">SIGNAL_INTEL</h4>
              <p className="font-mono text-[10px] text-cyan/60 italic">
                "THE_VOID_WHISPERS_IN_BINARY. LISTEN_TO_THE_PULSE. GROW_THE_SNAKE. CONSUME_THE_DATA."
              </p>
            </div>
          </motion.div>
        </div>

        {/* Footer */}
        <motion.footer 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="w-full border-t-2 border-cyan/20 pt-8 mt-12 text-center"
        >
          <p className="font-mono text-[8px] uppercase tracking-[1em] text-cyan/40">
            [ PROPERTY_OF_VOID_CORP // NO_TRESPASSING ]
          </p>
        </motion.footer>
      </main>
    </div>
  );
}


