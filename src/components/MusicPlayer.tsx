import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Pause, SkipForward, SkipBack, Volume2, Activity } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';

const PLAYLIST = [
  {
    id: 1,
    title: "SIGNAL_01",
    artist: "VOID_RUNNER",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "#ff00ff"
  },
  {
    id: 2,
    title: "SIGNAL_02",
    artist: "CYBER_GHOST",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "#00ffff"
  },
  {
    id: 3,
    title: "SIGNAL_03",
    artist: "STATIC_PULSE",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "#ffffff"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(50);
  const audioRef = useRef<HTMLAudioElement>(null);

  const currentTrack = PLAYLIST[currentTrackIndex];

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    if (isPlaying) {
      audioRef.current?.play().catch(e => console.log("Audio play blocked", e));
    } else {
      audioRef.current?.pause();
    }
  }, [isPlaying, currentTrackIndex]);

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      const p = (audioRef.current.currentTime / audioRef.current.duration) * 100;
      setProgress(p || 0);
    }
  };

  const handleTrackEnd = () => {
    nextTrack();
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % PLAYLIST.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="flex flex-col gap-4 border-2 border-cyan bg-black p-4 font-mono shadow-[0_0_15px_rgba(0,255,255,0.3)]">
      <audio
        ref={audioRef}
        src={currentTrack.url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={handleTrackEnd}
      />

      <div className="flex items-center gap-4 border-b border-magenta/30 pb-4">
        <motion.div 
          key={currentTrack.id}
          className="relative h-16 w-16 flex-shrink-0 border-2 border-magenta bg-black"
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <Activity className="h-8 w-8 text-magenta animate-pulse" />
          </div>
          {isPlaying && (
            <div className="absolute inset-0 bg-magenta/10 mix-blend-screen" />
          )}
        </motion.div>

        <div className="flex flex-col overflow-hidden">
          <motion.h3 
            key={currentTrack.title}
            className="glitch-text truncate text-lg font-bold text-cyan"
            data-text={currentTrack.title}
          >
            {currentTrack.title}
          </motion.h3>
          <motion.p 
            key={currentTrack.artist}
            className="text-[10px] text-magenta"
          >
            SOURCE: {currentTrack.artist}
          </motion.p>
        </div>
      </div>

      <div className="space-y-1">
        <div className="h-2 w-full bg-magenta/20">
          <motion.div 
            className="h-full bg-magenta"
            animate={{ width: `${progress}%` }}
            transition={{ type: 'spring', bounce: 0, duration: 0.1 }}
          />
        </div>
        <div className="flex justify-between text-[8px] text-cyan/60">
          <span>{audioRef.current ? formatTime(audioRef.current.currentTime) : "00:00"}</span>
          <span>{audioRef.current ? formatTime(audioRef.current.duration) : "00:00"}</span>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="sm" className="text-cyan hover:bg-cyan hover:text-black rounded-none" onClick={prevTrack}>
            <SkipBack className="h-4 w-4" />
          </Button>
          <Button 
            size="sm" 
            className="bg-cyan text-black hover:bg-magenta transition-colors rounded-none"
            onClick={togglePlay}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button variant="ghost" size="sm" className="text-cyan hover:bg-cyan hover:text-black rounded-none" onClick={nextTrack}>
            <SkipForward className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 w-24">
          <Volume2 className="h-3 w-3 text-cyan" />
          <Slider 
            value={[volume]} 
            onValueChange={(v) => setVolume(v[0])} 
            max={100} 
            step={1} 
            className="w-full"
          />
        </div>
      </div>
      
      <div className="text-[8px] uppercase text-magenta/40 text-center">
        ENCRYPTED_AUDIO_STREAM_ACTIVE
      </div>
    </div>
  );
}

function formatTime(seconds: number) {
  if (isNaN(seconds)) return "00:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

