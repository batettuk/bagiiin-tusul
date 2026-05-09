'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import dynamic from 'next/dynamic';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from '@google/genai';
import AssistantPanel from '@/components/AssistantPanel';

// Dynamically import Map to avoid SSR issues with Leaflet
const Map = dynamic(() => import('@/components/Map'), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-[#05060f] font-sans text-white/20">
      Газрын зураг ачаалж байна...
    </div>
  ),
});

const genAI = new GoogleGenAI({
  apiKey: process.env.NEXT_PUBLIC_GEMINI_API_KEY,
});

export default function Home() {
  const [isListening, setIsListening] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [status, setStatus] = useState('Тусслах унтарсан байна');
  const [transcript, setTranscript] = useState('');
  const [response, setResponse] = useState('');

  const recognitionRef = useRef<any>(null);

  const speak = useCallback((text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const utterance = new SpeechSynthesisUtterance(text);
      const voices = window.speechSynthesis.getVoices();
      const mnVoice = voices.find((v) => v.lang.includes('mn'));
      if (mnVoice) utterance.voice = mnVoice;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const handleAIService = useCallback(
    async (userText: string) => {
      setIsThinking(true);
      setStatus('Бодож байна...');

      try {
        const response = await genAI.models.generateContent({
          model: 'gemini-2.0-flash',
          contents: userText,
          config: {
            systemInstruction:
              "Чи бол 'Nara' нэртэй Монгол туслах AI юм. Хэрэглэгчтэй зөвхөн Монгол кирилл үсгээр харилцана. Хариулт нь товч бөгөөд тодорхой байх ёстой. Зам тээвэр, байршил, мэдээллийн асуултуудад хамгийн түрүүнд туслана уу.",
          },
        });

        const aiText = response.text || 'Уучлаарай, хариулт олдохгүй байна.';
        setResponse(aiText);
        setStatus(aiText);
        speak(aiText);
      } catch (error) {
        console.error('AI Error:', error);
        setStatus('AI холболтод алдаа гарлаа.');
      } finally {
        setIsThinking(false);
      }
    },
    [speak]
  );

  useEffect(() => {
    // Initialize Speech Recognition if supported
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;
        recognitionRef.current.lang = 'mn-MN';

        recognitionRef.current.onstart = () => {
          setIsListening(true);
          setStatus('Сонсож байна...');
        };

        recognitionRef.current.onresult = async (event: any) => {
          const text = event.results[0][0].transcript;
          setTranscript(text);
          setStatus(`Ойлгосон: ${text}`);
          await handleAIService(text);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error', event.error);
          setIsListening(false);
          if (event.error === 'network') {
            setStatus(
              'Сүлжээний алдаа! Монгол хэлний багц ачаалахад асуудал гарлаа. Та гараар бичиж үзнэ үү.'
            );
          } else if (event.error === 'not-allowed') {
            setStatus('Микрофон ашиглах эрх алга.');
          } else {
            setStatus('Дуу танихад алдаа гарлаа. Дахин оролдоно уу.');
          }
        };

        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      } else {
        setTimeout(
          () => setStatus('Таны хөтөч дуу хоолой таних боломжгүй байна.'),
          0
        );
      }
    }
  }, [handleAIService]);

  const handleManualSubmit = (text: string) => {
    if (text.trim()) {
      handleAIService(text);
    }
  };

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
    } else {
      recognitionRef.current?.start();
    }
  };

  return (
    <main className="flex h-screen flex-col bg-[#05060f] font-sans text-white">
      {/* Top Half: Map */}
      <section className="group relative h-[55%]">
        <Map />

        {/* Overlay Badges */}
        <div className="absolute top-6 left-6 z-[1000] flex flex-col space-y-2">
          <div className="flex items-center space-x-2 rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 font-mono text-[10px] backdrop-blur-md">
            <div className="h-1.5 w-1.5 animate-pulse rounded-full bg-green-500" />
            <span>GPS • ±35m</span>
          </div>
        </div>

        <div className="absolute top-6 right-6 z-[1000]">
          <div className="rounded-lg border border-white/10 bg-black/40 px-3 py-1.5 text-[10px] font-bold tracking-widest uppercase backdrop-blur-md">
            mn-MN
          </div>
        </div>
      </section>

      {/* Bottom Half: Assistant Panel */}
      <section className="h-[45%] border-t border-white/5 bg-[#0a0c1a] shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
        <AnimatePresence mode="wait">
          {isThinking ? (
            <motion.div
              key="thinking"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex h-full items-center justify-center"
            >
              <div className="flex space-x-2">
                {[0, 1, 2].map((i) => (
                  <motion.div
                    key={i}
                    animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                    transition={{
                      repeat: Infinity,
                      duration: 1,
                      delay: i * 0.2,
                    }}
                    className="h-3 w-3 rounded-full bg-blue-500"
                  />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="panel"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="h-full"
            >
              <AssistantPanel
                isListening={isListening}
                status={status}
                toggleListening={toggleListening}
                onManualSubmit={handleManualSubmit}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </main>
  );
}
