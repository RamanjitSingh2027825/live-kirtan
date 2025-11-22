import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Radio, Loader2 } from 'lucide-react';
import { STREAM_URL } from '../constants';
import { ConnectionStatus } from '../types';
import WaveVisualizer from './WaveVisualizer';

const AudioPlayer: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [status, setStatus] = useState<ConnectionStatus>(ConnectionStatus.DISCONNECTED);
  const [retryCount, setRetryCount] = useState(0);

  // Handle Audio Stream setup
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleWaiting = () => setStatus(ConnectionStatus.CONNECTING);
    const handlePlaying = () => {
        setStatus(ConnectionStatus.CONNECTED);
        setIsPlaying(true);
    };
    const handleError = () => {
        setStatus(ConnectionStatus.ERROR);
        setIsPlaying(false);
        // Auto retry logic for live streams
        if (retryCount < 3) {
            setTimeout(() => {
                setRetryCount(prev => prev + 1);
                if(audio) {
                    audio.load(); 
                    audio.play().catch(() => setIsPlaying(false));
                }
            }, 2000);
        }
    };

    audio.addEventListener('waiting', handleWaiting);
    audio.addEventListener('playing', handlePlaying);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('waiting', handleWaiting);
      audio.removeEventListener('playing', handlePlaying);
      audio.removeEventListener('error', handleError);
    };
  }, [retryCount]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
      setStatus(ConnectionStatus.DISCONNECTED);
    } else {
      setStatus(ConnectionStatus.CONNECTING);
      try {
        // For live streams, it's often good to reload the source to get the "live" edge
        if (status === ConnectionStatus.DISCONNECTED || status === ConnectionStatus.ERROR) {
            audio.load();
        }
        await audio.play();
        setIsPlaying(true);
      } catch (err) {
        console.error("Playback failed", err);
        setStatus(ConnectionStatus.ERROR);
        setIsPlaying(false);
      }
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-2xl relative overflow-hidden group">
        {/* Decorative Glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center space-y-6">
        
        {/* Status Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium transition-colors duration-300 ${
            status === ConnectionStatus.CONNECTED ? 'bg-green-500/20 text-green-400' :
            status === ConnectionStatus.CONNECTING ? 'bg-amber-500/20 text-amber-400' :
            status === ConnectionStatus.ERROR ? 'bg-red-500/20 text-red-400' :
            'bg-slate-800 text-slate-400'
        }`}>
            {status === ConnectionStatus.CONNECTING ? <Loader2 className="w-3 h-3 animate-spin" /> : <Radio className={`w-3 h-3 ${status === ConnectionStatus.CONNECTED ? 'animate-pulse' : ''}`} />}
            {status}
        </div>

        {/* Main Visual */}
        <div className="w-full py-2">
            <WaveVisualizer isPlaying={isPlaying} />
        </div>

        {/* Main Controls */}
        <div className="flex items-center justify-center gap-8">
           <button 
            onClick={toggleMute}
            className="p-3 text-slate-400 hover:text-white hover:bg-slate-800 rounded-full transition-all"
            aria-label="Toggle Mute"
           >
            {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
           </button>

           <button 
            onClick={togglePlay}
            className={`w-16 h-16 flex items-center justify-center rounded-full shadow-lg transition-all duration-300 transform active:scale-95 ${
                isPlaying 
                ? 'bg-amber-500 text-slate-950 hover:bg-amber-400 shadow-amber-500/20' 
                : 'bg-slate-100 text-slate-900 hover:bg-white'
            }`}
            aria-label={isPlaying ? "Pause" : "Play"}
           >
             {status === ConnectionStatus.CONNECTING ? (
                <Loader2 className="w-8 h-8 animate-spin" />
             ) : isPlaying ? (
                <Pause className="w-8 h-8 fill-current" />
             ) : (
                <Play className="w-8 h-8 fill-current ml-1" />
             )}
           </button>

           <div className="w-12 h-12" /> {/* Spacer to center play button visually against mute button */}
        </div>

        <div className="text-slate-400 text-sm font-light">
            <p>Live from Sri Harmandir Sahib</p>
            <p className="text-xs text-slate-600 mt-1">Amritsar, Punjab</p>
        </div>
      </div>

      <audio 
        ref={audioRef} 
        src={STREAM_URL} 
        preload="none"
        crossOrigin="anonymous"
      />
    </div>
  );
};

export default AudioPlayer;