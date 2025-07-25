import React from 'react';
import { Routes, Route, Link, Outlet } from 'react-router-dom';

import { FocusTracker } from './components/FocusTracker';
import PresenceCheckSession from './components/PresenceChecker';
import { VideoPlayer } from './components/VideoPlayer';
import QuizModal from './components/QuizModal';

const MainMenu = () => (
  <div className="bg-white p-12 rounded-2xl shadow-xl border border-gray-100 max-w-2xl">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-3">
        Rohith Varma Datla
      </h1>
      <p className="text-lg text-gray-600 mb-6">
        DLED Labs Assignment
      </p>
      
      <div className="flex justify-center gap-6 text-sm">
        <a 
          href="https://www.loom.com/share/c16e82f1fd80477aa2f857acc271a6f4?sid=6ea2c86a-e84e-40ff-88e3-d9e2ab7edb6c"
          className="text-blue-600 hover:text-blue-800 transition-colors"
          target="_blank" 
          rel="noopener noreferrer"
        >
          Video Demo
        </a>
      </div>
    </div>

    <div className="space-y-3">
      <Link 
        to="/presence" 
        className="block w-full py-4 px-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-800 font-medium transition-all duration-200 hover:shadow-sm"
      >
        Random Presence Check
      </Link>
      <Link 
        to="/quiz" 
        className="block w-full py-4 px-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-800 font-medium transition-all duration-200 hover:shadow-sm"
      >
        Quiz-Interrupt Video
      </Link>
      <Link 
        to="/focus" 
        className="block w-full py-4 px-6 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg text-gray-800 font-medium transition-all duration-200 hover:shadow-sm"
      >
        Focus & Trust Score Tracker
      </Link>
    </div>
  </div>
);

const AppLayout = () => (
  <div className="w-full max-w-4xl">
    <div className="text-center mb-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-4">Interactive Learning Demos</h1>
      <Link to="/" className="text-gray-600 hover:text-gray-900 text-sm transition-colors">
        ← Back to Menu
      </Link>
    </div>
    <Outlet /> 
  </div>
);

function App() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
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
