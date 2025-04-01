// src/App.js
import React, { useState } from 'react';
import SudokuBoard from './components/SudokuBoard';
import SudokuSolver from './components/SudokuSolver';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('game');

  return (
    <div className="App">
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'game' ? 'active' : ''}`}
          onClick={() => setActiveTab('game')}
        >
          Sudoku Game
        </button>
        <button 
          className={`tab-button ${activeTab === 'solver' ? 'active' : ''}`}
          onClick={() => setActiveTab('solver')}
        >
          Sudoku Solver
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'game' && <SudokuBoard />}
        {activeTab === 'solver' && <SudokuSolver />}
      </div>
    </div>
  );
}

export default App;

