import React, { useState } from 'react';
import { useQuizStore } from '../store/quizStore';

const QuizModal: React.FC = () => {
  const { currentQuestion, showQuiz, submitAnswer } = useQuizStore();
  const [selectedAnswer, setSelectedAnswer] = useState('');

  if (!showQuiz || !currentQuestion) return null;

  console.log(currentQuestion);

  const handleSubmit = () => {
    if (selectedAnswer) {
      submitAnswer(selectedAnswer);
      setSelectedAnswer('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full mx-4">
        <h2 className="text-2xl font-bold mb-4">Quiz Time! 🎯</h2>
        
        <h3 className="text-lg mb-4">{currentQuestion.question}</h3>
        
        <div className="space-y-2 mb-6">
          {currentQuestion.options.map((option) => (
            <label key={option} className="flex items-center space-x-2 cursor-pointer">
              <input
                type="radio"
                name="answer"
                value={option}
                checked={selectedAnswer === option}
                onChange={(e) => setSelectedAnswer(e.target.value)}
                className="text-blue-600"
              />
              <span>{option}</span>
            </label>
          ))}
        </div>
        
        <button
          onClick={handleSubmit}
          disabled={!selectedAnswer}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
        >
          Submit Answer
        </button>
      </div>
    </div>
  );
};

export default QuizModal;