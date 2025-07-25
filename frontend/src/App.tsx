import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';

import { FocusTracker } from './components/FocusTracker';
import  PresenceCheckSession  from './components/PresenceChecker';
import { VideoPlayer } from './components/VideoPlayer';
import QuizModal from './components/QuizModal';

// A simple menu component for the home page
const MainMenu = () => (
  <div className="text-center">
    <h2 className="text-2xl font-semibold text-gray-700 mb-6">Choose a demo to run</h2>
    <div className="flex flex-col items-center gap-4">
      <Link to="/presence" className="w-64 bg-blue-500 hover:bg-blue-600 px-6 py-3 rounded-lg text-white shadow-md">
        1. Random Presence Check
      </Link>
      <Link to="/quiz" className="w-64 bg-green-500 hover:bg-green-600 px-6 py-3 rounded-lg text-white shadow-md">
        2. Quiz-Interrupt Video
      </Link>
      <Link to="/focus" className="w-64 bg-indigo-500 hover:bg-indigo-600 px-6 py-3 rounded-lg text-white shadow-md">
        3. Focus & Trust Score Tracker
      </Link>
    </div>
  </div>
);

// A layout for the individual app pages to share the header and back button
const AppLayout = () => (
  <div className="w-full max-w-4xl">
    <div className="text-center mb-10">
      <h1 className="text-4xl font-bold">Interactive Learning Demos</h1>
      <Link to="/" className="mt-4 text-sm text-gray-600 hover:text-black">
        &larr; Back to Menu
      </Link>
    </div>
    <Outlet /> 
  </div>
);



function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex items-center justify-center p-4">
      <Routes>
        <Route path="/" element={<MainMenu />} />
        <Route element={<AppLayout />}>
          <Route path="/presence" element={<PresenceCheckSession />} />
          <Route path="/quiz" element={<VideoPlayer />} />
          <Route path="/focus" element={<FocusTracker />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
