"use client";

import React from 'react';
import { useInterviewStore } from './interviewStore';
import { CheckCircle2, RotateCcw, TrendingUp } from 'lucide-react';

export const InterviewResult: React.FC = () => {
  const { result, resetInterview, difficulty, timeStarted, timeEnded } = useInterviewStore();

  if (!result) return null;

  const getDuration = () => {
    if (!timeStarted || !timeEnded) return '00:00';
    const diff = timeEnded - timeStarted;
    const mins = Math.floor(diff / 60000);
    const secs = Math.floor((diff % 60000) / 1000);
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header Result Card */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm flex items-center gap-12">
        <div className="flex-1 space-y-4">
           <p className="text-sm text-gray-400 font-bold uppercase tracking-wider">Mock interview quiz</p>
           <h1 className="text-3xl font-bold text-gray-900">Your results summary</h1>
           <p className="text-gray-500 text-lg">You've completed this quiz. Review your performance and decide your next step.</p>
           <div className="flex gap-3">
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-100">Score: {result.score}%</span>
              <span className="bg-green-50 text-green-700 px-3 py-1 rounded-full text-sm font-medium border border-green-100">Level: {difficulty}</span>
           </div>
           <div className="flex gap-4 pt-4">
              <button 
                onClick={resetInterview}
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 transition-colors"
                >
                <RotateCcw size={18} /> Retake quiz
              </button>
           </div>
        </div>

        <div className="flex flex-col items-center gap-4">
            <div className="w-32 h-32 relative">
                <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-100" />
                    <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-green-500" strokeDasharray={364.4} strokeDashoffset={364.4 - (364.4 * result.score) / 100} />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-gray-900">{result.score}%</span>
                    <span className="text-[10px] uppercase font-bold text-gray-400">Score</span>
                </div>
            </div>
            <div className="text-center">
                <h3 className="font-bold text-gray-900">Nice work, you're on track</h3>
                <p className="text-xs text-gray-400 max-w-[200px] mt-1">{result.summary}</p>
            </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Performance Breakdown */}
         <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm space-y-6">
            <h3 className="text-xl font-bold text-gray-900 border-b border-gray-100 pb-4">Performance breakdown</h3>
            <p className="text-sm text-gray-400">Overview of how you did across this quiz session.</p>
            
            <div className="grid grid-cols-2 gap-y-8">
                <div>
                   <p className="text-sm text-gray-400">Overall Score</p>
                   <p className="text-2xl font-bold text-gray-900">{result.score}%</p>
                </div>
                <div>
                   <p className="text-sm text-gray-400">Questions Evaluated</p>
                   <p className="text-2xl font-bold text-gray-900">{result.detailedBreakdown?.length || 10} questions</p>
                </div>
                <div>
                   <p className="text-sm text-gray-400">Time taken</p>
                   <p className="text-2xl font-bold text-gray-900">{getDuration()} minutes</p>
                </div>
            </div>
            <div className="bg-green-50 p-2 px-4 rounded-full w-fit">
                <p className="text-xs font-bold text-green-700 flex items-center gap-1"><TrendingUp size={12} /> Target skill level: {difficulty}</p>
            </div>
         </div>

         {/* Your Strengths */}
         <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your strengths</h3>
            <p className="text-sm text-gray-400 mb-6">Areas where you demonstrated strong knowledge.</p>
            <ul className="space-y-4">
               {result.strengths.map((str, i) => (
                 <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 mt-2"></div>
                    <span className="text-gray-700 text-sm">{str}</span>
                 </li>
               ))}
            </ul>
         </div>

         {/* Areas to improve */}
         <div className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Areas to improve</h3>
            <p className="text-sm text-gray-400 mb-6">Focus here to reach higher mastery.</p>
            <ul className="space-y-4">
               {result.improvements.map((imp, i) => (
                 <li key={i} className="flex items-start gap-3">
                    <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-2"></div>
                    <span className="text-gray-700 text-sm">{imp}</span>
                 </li>
               ))}
            </ul>
         </div>
      </div>

      {/* Detailed Question Review */}
      <div className="space-y-6">
         <h2 className="text-2xl font-bold text-gray-900">Detailed Feedback & Ideal STAR Answers</h2>
         <div className="grid grid-cols-1 gap-6">
            {result.detailedBreakdown.map((item, index) => (
               <div key={index} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <div className="p-6 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                     <h3 className="font-bold text-gray-900">Question {index + 1}</h3>
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${item.rating >= 7 ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                        Rating: {item.rating}/10
                     </span>
                  </div>
                  <div className="p-8 space-y-6">
                     <div>
                        <p className="text-sm font-bold text-gray-400 uppercase mb-2">The Question</p>
                        <p className="text-lg text-gray-900 font-medium leading-relaxed">{item.question}</p>
                     </div>
                     
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                           <div>
                              <p className="text-sm font-bold text-green-600 uppercase mb-2 flex items-center gap-2">
                                 <CheckCircle2 size={16} /> AI Feedback
                              </p>
                              <p className="text-sm text-gray-600 leading-relaxed bg-green-50/50 p-4 rounded-xl border border-green-50">{item.feedback}</p>
                           </div>
                        </div>

                        <div className="space-y-4">
                           <div>
                              <p className="text-sm font-bold text-blue-600 uppercase mb-2">Ideal Answer (STAR Method)</p>
                              <p className="text-sm text-gray-800 leading-relaxed bg-blue-50/30 p-4 rounded-xl border border-blue-50 italic">"{item.correctAnswer}"</p>
                           </div>
                           <div>
                              <p className="text-sm font-bold text-gray-900 uppercase mb-2">Why this works</p>
                              <p className="text-xs text-gray-500 leading-relaxed">{item.explanation}</p>
                           </div>
                        </div>
                     </div>
                  </div>
               </div>
            ))}
         </div>
      </div>
    </div>
  );
};

export default InterviewResult;
