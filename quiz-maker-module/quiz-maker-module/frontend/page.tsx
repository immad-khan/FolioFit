"use client";

import React, { useEffect } from 'react';
import { useInterviewStore } from './interviewStore';
import InterviewStart from './InterviewStart';
import InterviewQuiz from './InterviewQuiz';
import InterviewResult from './InterviewResult';
import InterviewResume from './InterviewResume';

export default function QuizMakerPage() {
  const { step, setStep, questions, answers } = useInterviewStore();

  // If user has progress but is on START step, offer to resume
  useEffect(() => {
    if (step === 'START' && questions.length > 0 && answers.length < questions.length && answers.length > 0) {
      setStep('PAUSED');
    }
  }, []);

  const renderStep = () => {
    switch (step) {
      case 'START':
        return <InterviewStart />;
      case 'QUIZ':
        return <InterviewQuiz />;
      case 'PAUSED':
        return <InterviewResume />;
      case 'RESULT':
        return <InterviewResult />;
      default:
        return <InterviewStart />;
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 min-h-[calc(100vh-100px)]">
      {renderStep()}
    </div>
  );
}
