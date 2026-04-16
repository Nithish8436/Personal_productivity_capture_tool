import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { PenLine, Mic, MicOff, ArrowRight } from 'lucide-react';

const CaptureBox = ({ onTaskCaptured }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Initialize SpeechRecognition if available
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        setInputText(transcript);
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setInputText('');
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const handleProcess = async () => {
    if (!inputText.trim()) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    }

    setIsProcessing(true);
    try {
      const response = await axios.post('http://localhost:5000/api/tasks/parse', {
        text: inputText
      });

      if (response.status === 201) {
        onTaskCaptured(response.data);
        setInputText('');
      }
    } catch (error) {
      console.error('Failed to parse task:', error);
      alert('Failed to process task. Make sure the backend is running.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="my-8">
      <div className={`flex items-center bg-white rounded-px p-1.5 md:p-2 px-3 shadow-sm border transition-all duration-300 gap-2 md:gap-3 ${
        isListening ? 'border-nordic-mint ring-2 ring-nordic-mint/20' : 'border-nordic-border'
      }`}>
        <div className="relative flex items-center justify-center shrink-0">
          <PenLine size={18} className={`transition-opacity duration-300 ${isListening ? 'opacity-0' : 'opacity-100 text-nordic-mint'}`} />
          {isListening && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-2.5 h-2.5 bg-nordic-mint rounded-full animate-ping"></div>
            </div>
          )}
        </div>
        <input
          type="text"
          placeholder={isListening ? "Listening..." : (window.innerWidth < 1024 ? "Capture thought..." : "Type anything... (e.g., Finalize report by tomorrow high priority)")}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
          className="flex-1 border-none outline-none text-sm md:text-base text-nordic-text py-2 md:py-2.5 bg-transparent min-w-0"
          disabled={isProcessing}
        />
        <div className="flex items-center gap-1 md:gap-2">
          <button
            onClick={toggleListening}
            className={`p-2 md:p-2.5 rounded-lg transition-all ${
              isListening 
                ? 'bg-nordic-mint text-white animate-pulse' 
                : 'text-nordic-muted hover:bg-slate-50 hover:text-nordic-navy'
            }`}
            title={isListening ? "Stop listening" : "Start voice input"}
          >
            {isListening ? <MicOff size={18} /> : <Mic size={18} />}
          </button>
          <button 
            onClick={handleProcess} 
            className={`bg-nordic-navy text-white p-2.5 md:px-5 md:py-2.5 rounded-lg font-semibold text-sm transition-all hover:bg-slate-800 shrink-0 flex items-center justify-center gap-2 ${
              isProcessing || !inputText.trim() ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'
            }`}
            disabled={isProcessing || !inputText.trim()}
          >
            {isProcessing ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span className="hidden md:inline">Processing...</span>
              </>
            ) : (
              <>
                <span className="hidden md:inline">Process</span>
                <ArrowRight size={18} className="md:hidden" />
              </>
            )}
          </button>
        </div>
      </div>
      {isListening && (
        <p className="text-[0.65rem] font-bold text-nordic-mint uppercase tracking-[2px] mt-2 ml-1 animate-pulse">
          Recording Audio...
        </p>
      )}
    </div>
  );
};

export default CaptureBox;
