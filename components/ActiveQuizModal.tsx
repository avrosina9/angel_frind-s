/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect } from 'react';
import { ActiveExam } from '../types';
import { QUIZ_QUESTIONS } from '../data';
import { X, ChevronLeft, ChevronRight, Award, Clock, HelpCircle, CheckCircle } from 'lucide-react';

interface ActiveQuizModalProps {
  exam: ActiveExam;
  onClose: () => void;
  onFinish: (achievedScore: number) => void;
}

export default function ActiveQuizModal({ exam, onClose, onFinish }: ActiveQuizModalProps) {
  const [questions] = useState(() => {
    const saved = localStorage.getItem('angels_quiz_questions_v1');
    if (saved) {
      try {
        const db = JSON.parse(saved);
        if (db[exam.id] && db[exam.id].length > 0) {
          return db[exam.id];
        }
      } catch (e) {
        console.error(e);
      }
    }
    return QUIZ_QUESTIONS[exam.id] || QUIZ_QUESTIONS['active-1'];
  });
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: number }>(() => {
    const saved = localStorage.getItem(`angels_active_answers_${exam.id}`);
    return saved ? JSON.parse(saved) : {};
  });
  const [quizFinished, setQuizFinished] = useState(false);
  const [calculatedScore, setCalculatedScore] = useState(0);

  // Auto-save answers on state change
  useEffect(() => {
    localStorage.setItem(`angels_active_answers_${exam.id}`, JSON.stringify(selectedAnswers));
  }, [selectedAnswers, exam.id]);

  const handleSelectOption = (optionIndex: number) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [currentQuestionIndex]: optionIndex,
    });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    questions.forEach((q, idx) => {
      if (selectedAnswers[idx] === q.correctAnswerIndex) {
        correctCount++;
      }
    });

    const percentScore = Math.round((correctCount / questions.length) * 100);
    setCalculatedScore(percentScore);
    setQuizFinished(true);
  };

  const handleDone = () => {
    localStorage.removeItem(`angels_active_answers_${exam.id}`);
    onFinish(calculatedScore);
  };

  const currentQuestion = questions[currentQuestionIndex];
  const progressPercent = ((currentQuestionIndex + 1) / questions.length) * 100;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 text-right">
      <div className="bg-[#f9f9ff] text-[#151c27] rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col border border-[#c3c5d7]">
        
        {/* Header */}
        <div className="bg-[#15803d] text-white p-5 flex items-center justify-between">
          <button 
            onClick={onClose}
            className="text-white/80 hover:text-white hover:bg-white/15 p-2 rounded-lg transition-colors ms-0 me-auto"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="text-center">
            <h3 className="font-display text-lg font-bold">{exam.title}</h3>
            <p className="text-xs text-white/80 font-label">{exam.category}</p>
          </div>
          
          <div className="flex items-center gap-2 bg-white/15 px-3 py-1.5 rounded-full text-xs font-semibold me-0 ms-4">
            <CheckCircle className="w-4 h-4 text-white animate-pulse" />
            <span>تركيز وهدوء 🧘</span>
          </div>
        </div>

        {/* Content Area */}
        {!quizFinished ? (
          <div className="p-6 flex-grow flex flex-col">
            {/* Progress indicator */}
            <div className="mb-6">
              <div className="flex justify-between items-center text-sm text-[#434654] mb-2 font-label">
                <span>السؤال {currentQuestionIndex + 1} من {questions.length}</span>
                <span>نسبة الإكمال: {Math.round(progressPercent)}%</span>
              </div>
              <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-[#15803d] transition-all duration-300 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                ></div>
              </div>
            </div>

            {/* Question Text */}
            <div className="bg-white p-5 rounded-xl border border-[#c3c5d7]/50 mb-6 flex-grow flex flex-col justify-center">
              <div className="flex items-start gap-3">
                <HelpCircle className="w-6 h-6 text-[#15803d] shrink-0 mt-1" />
                <h4 className="font-display font-semibold text-lg text-[#151c27] leading-relaxed">
                  {currentQuestion.questionText}
                </h4>
              </div>
            </div>

            {/* Options list */}
            <div className="space-y-3 mb-8">
              {currentQuestion.options.map((option, idx) => {
                const isSelected = selectedAnswers[currentQuestionIndex] === idx;
                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full p-4 rounded-xl border transition-all text-right flex items-center gap-3 font-sans ${
                      isSelected
                        ? 'border-[#15803d] bg-[#dcfce7] text-[#15803d] font-semibold ring-2 ring-[#15803d]/30'
                        : 'border-[#c3c5d7] bg-white hover:border-[#737686] hover:bg-slate-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'border-[#15803d] bg-[#15803d]' : 'border-[#737686]'
                    }`}>
                      {isSelected && <div className="w-2.5 h-2.5 bg-white rounded-full"></div>}
                    </div>
                    <span className="text-md">{option}</span>
                  </button>
                );
              })}
            </div>

            {/* Navigation buttons */}
            <div className="flex justify-between items-center pt-4 border-t border-[#c3c5d7]/40">
              <button
                onClick={handlePrev}
                disabled={currentQuestionIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-[#c3c5d7] font-label text-sm text-[#434654] flex items-center gap-1 hover:bg-slate-50 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
                السابق
              </button>

              {currentQuestionIndex === questions.length - 1 ? (
                <button
                  onClick={handleSubmit}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                  className="px-6 py-2.5 rounded-xl bg-[#006c49] text-white font-label text-sm font-semibold flex items-center gap-1.5 hover:bg-[#005236] disabled:opacity-50 transition-colors shadow-md"
                >
                  إنهاء وتوجيه النتيجة
                  <CheckCircle className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={selectedAnswers[currentQuestionIndex] === undefined}
                  className="px-6 py-2.5 rounded-xl bg-[#15803d] text-white font-label text-sm font-semibold flex items-center gap-1 hover:bg-[#166534] disabled:opacity-50 transition-all shadow-md"
                >
                  التالي
                  <ChevronLeft className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ) : (
          /* Finished Quiz State Screen */
          <div className="p-8 text-center flex flex-col items-center justify-center max-w-md mx-auto">
            <div className="w-20 h-20 bg-[#6cf8bb]/20 rounded-full flex items-center justify-center mb-6 animate-bounce">
              <Award className="w-12 h-12 text-[#00714d]" />
            </div>

            <h4 className="font-display text-2xl font-bold mb-2">تم إنهاء الاختبار بنجاح!</h4>
            <p className="text-sm font-sans text-[#434654] mb-6">
              لقد قمت بإتمام وتجريب اختبار <strong className="text-[#151c27]">{exam.title}</strong> بنجاح. تم رصد النتيجة وتحديث لوحة التحكم وبيان درجاتك المكتسبة.
            </p>

            <div className="bg-[#dcfce7] rounded-2xl w-full p-6 border border-[#c3c5d7] mb-8">
              <span className="text-xs text-[#434654] uppercase tracking-wider block font-label">الدرجة المحققة</span>
              <span className="text-5xl font-display font-extrabold text-[#15803d] block mt-2">{calculatedScore}%</span>
              <span className={`inline-block mt-3 px-3 py-1 rounded-full text-xs font-semibold ${
                calculatedScore >= 60 ? 'bg-[#6ffbbe] text-[#00714d]' : 'bg-[#ffdad6] text-[#93000a]'
              }`}>
                {calculatedScore >= 60 ? 'ناجح (اجتياز متميز)' : 'يحتاج لإعادة'}
              </span>
            </div>

            <button
              onClick={handleDone}
              className="w-full py-3.5 bg-[#15803d] text-white rounded-xl font-label text-md font-semibold hover:bg-[#166534] active:scale-95 transition-all shadow-md"
            >
              الرجوع إلى صفحة الاختبارات
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
