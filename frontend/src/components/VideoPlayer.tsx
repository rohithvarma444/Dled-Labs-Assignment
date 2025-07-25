import React, { useRef, useEffect } from 'react';
import ReactPlayer from 'react-player';
import { useQuizStore } from '../store/quizStore';
import QuizModal from './QuizModal';

export const VideoPlayer: React.FC = () => {
  const playerRef = useRef<ReactPlayer | null>(null);
  const {
    isPlaying,
    showQuiz,
    videoDuration,
    videoProgress,
    updateProgress,
    setVideoDuration,
    playVideo,
    pauseVideo,
    startSession,
  } = useQuizStore();

  useEffect(() => {
    startSession();
    playVideo();
  }, []);

  const handleProgress = (state: { playedSeconds: number }) => {
    updateProgress(state.playedSeconds);
  };

  const handleDuration = (duration: number) => {
    setVideoDuration(duration);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (): number => {
    return videoDuration > 0 ? (videoProgress / videoDuration) * 100 : 0;
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-black rounded-lg overflow-hidden">
      <ReactPlayer
        ref={playerRef}
        url="http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4"
        playing={isPlaying && !showQuiz}
        controls={!showQuiz}
        width="100%"
        height="500px"
        onProgress={handleProgress}
        onPlay={playVideo}
        onPause={pauseVideo}
        onDuration={handleDuration}
      />
      <div className="p-4 bg-gray-800 text-white">
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => (isPlaying ? pauseVideo() : playVideo())}
            disabled={showQuiz}
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <div className="text-sm">
            Duration: {formatTime(videoDuration)} | Progress: {formatTime(videoProgress)} (
            {Math.round(getProgressPercentage())}%)
          </div>
        </div>
        <div className="relative w-full bg-gray-600 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${getProgressPercentage()}%` }}
          />
          {[25, 50, 75].map((percent) => (
            <div
              key={percent}
              className="absolute top-0 w-1 h-2 bg-yellow-400 transform -translate-x-0.5"
              style={{ left: `${percent}%` }}
              title={`Quiz at ${percent}%`}
            />
          ))}
        </div>
      </div>
      {showQuiz && <QuizModal/>}
    </div>
  );
};