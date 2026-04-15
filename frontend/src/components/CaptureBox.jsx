import React, { useState } from 'react';
import axios from 'axios';
import { PenLine } from 'lucide-react';

const CaptureBox = ({ onTaskCaptured }) => {
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleProcess = async () => {
    if (!inputText.trim()) return;

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
      <div className="flex items-center bg-white rounded-px p-2 px-3 shadow-sm border border-nordic-border gap-3">
        <PenLine size={20} className="text-nordic-mint shrink-0" />
        <input
          type="text"
          placeholder="Type anything... (e.g., Finalize report by tomorrow high priority)"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
          className="flex-1 border-none outline-none text-base text-nordic-text py-2.5 bg-transparent"
          disabled={isProcessing}
        />
        <button 
          onClick={handleProcess} 
          className={`bg-nordic-navy text-white px-5 py-2 rounded-lg font-semibold text-sm transition-all hover:bg-slate-800 shrink-0 ${
            isProcessing ? 'opacity-70 cursor-not-allowed' : 'cursor-pointer active:scale-95'
          }`}
          disabled={isProcessing}
        >
          {isProcessing ? 'Processing...' : 'Process'}
        </button>
      </div>
    </div>
  );
};

export default CaptureBox;
