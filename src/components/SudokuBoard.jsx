import React, { useState, useEffect } from 'react';
import './SudokuBoard.css';

const SudokuBoard = () => {
  const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [solution, setSolution] = useState(null);
  const [userBoard, setUserBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [difficulty, setDifficulty] = useState("Hard");
  const [gameStarted, setGameStarted] = useState(false);
  const [isValid, setIsValid] = useState(null);

  // Function to check if a number is valid in a position
  const isValidPlacement = (board, row, col, num) => {
    // Check row
    for (let x = 0; x < 9; x++) {
      if (board[row][x] === num) return false;
    }

    // Check column
    for (let x = 0; x < 9; x++) {
      if (board[x][col] === num) return false;
    }

    // Check 3x3 box
    const boxRow = Math.floor(row / 3) * 3;
    const boxCol = Math.floor(col / 3) * 3;
    for (let i = boxRow; i < boxRow + 3; i++) {
      for (let j = boxCol; j < boxCol + 3; j++) {
        if (board[i][j] === num) return false;
      }
    }

    return true;
  };

  // Generate a new puzzle
  const generatePuzzle = () => {
    // Get difficulty level
    const difficultyMap = {
      "Easy": 1,
      "Medium": 2,
      "Hard": 3,
      "Expert": 4,
      "Extreme": 5
    };
    const difficultyLevel = difficultyMap[difficulty] || 3;
    
    // First create a solved board
    const solvedBoard = Array(9).fill().map(() => Array(9).fill(0));
    solveSudoku(solvedBoard);
    setSolution([...solvedBoard.map(row => [...row])]);
    
    // Create a puzzle by removing numbers
    const puzzleBoard = solvedBoard.map(row => [...row]);
    const holes = difficultyLevel * 10;
    let count = 0;
    
    while (count < holes) {
      const row = Math.floor(Math.random() * 9);
      const col = Math.floor(Math.random() * 9);
      
      if (puzzleBoard[row][col] !== 0) {
        puzzleBoard[row][col] = 0;
        count++;
      }
    }
    
    setBoard(puzzleBoard);
    setUserBoard(puzzleBoard.map(row => [...row]));
    setGameStarted(true);
    setIsValid(null);
  };

  // Solve sudoku using backtracking
  const solveSudoku = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          for (let num = 1; num <= 9; num++) {
            if (isValidPlacement(board, row, col, num)) {
              board[row][col] = num;
              
              if (solveSudoku(board)) {
                return true;
              }
              
              board[row][col] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  // Handle input in cells
  const handleCellInput = (row, col, value) => {
    if (board[row][col] !== 0) return; // Don't allow changing original numbers
    
    const newValue = value === '' ? 0 : parseInt(value, 10);
    if ((newValue >= 0 && newValue <= 9) || isNaN(newValue)) {
      const newUserBoard = userBoard.map(r => [...r]);
      newUserBoard[row][col] = isNaN(newValue) ? 0 : newValue;
      setUserBoard(newUserBoard);
    }
  };

  // Validate the current board
  const validateBoard = () => {
    // Check if board is complete
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (userBoard[row][col] === 0) {
          setIsValid(false);
          return;
        }
      }
    }
    
    // Check if board is valid
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const num = userBoard[row][col];
        
        // Temporarily remove the number to check if it's valid
        userBoard[row][col] = 0;
        const valid = isValidPlacement(userBoard, row, col, num);
        userBoard[row][col] = num;
        
        if (!valid) {
          setIsValid(false);
          return;
        }
      }
    }
    
    // Board is valid
    setIsValid(true);
  };

  // Show the solution
  const showSolution = () => {
    setUserBoard(solution.map(row => [...row]));
  };

  // Initialize with a sample starting board (some numbers filled in)
  useEffect(() => {
    const initialBoard = [
      [1, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    setBoard(initialBoard);
    setUserBoard(initialBoard.map(row => [...row]));
    setGameStarted(false);
  }, []);

  return (
    <div className="sudoku-container">
      <h1>Sudoku</h1>
      
      <div className="controls">
        <label htmlFor="difficulty">Difficulty:</label>
        <select
          id="difficulty"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value)}
        >
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
          <option value="Expert">Expert</option>
          <option value="Extreme">Extreme</option>
        </select>
        
        <button className="generate-button" onClick={generatePuzzle}>
          Generate Puzzle
        </button>
      </div>
      
      <div className="sudoku-board">
        {userBoard.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="board-row">
            {row.map((cell, colIndex) => {
              const isOriginal = board[rowIndex][colIndex] !== 0;
              const cellClass = isOriginal ? 'cell original' : 'cell';
              
              // Add classes for borders
              const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex < 8;
              const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex < 8;
              const borderClass = `${isRightBorder ? 'right-border' : ''} ${isBottomBorder ? 'bottom-border' : ''}`;
              
              return (
                <input
                  key={`cell-${rowIndex}-${colIndex}`}
                  type="text"
                  className={`${cellClass} ${borderClass}`}
                  value={cell === 0 ? '' : cell}
                  onChange={(e) => handleCellInput(rowIndex, colIndex, e.target.value)}
                  disabled={isOriginal}
                  maxLength="1"
                />
              );
            })}
          </div>
        ))}
      </div>

      {gameStarted && (
        <div className="action-buttons">
          <button className="validate-button" onClick={validateBoard}>
            Validate
          </button>
          <button className="solution-button" onClick={showSolution}>
            Show Answer
          </button>
        </div>
      )}
      
      {isValid !== null && (
        <div className={`validation-message ${isValid ? 'valid' : 'invalid'}`}>
          {isValid ? 'Correct solution!' : 'There are errors in your solution.'}
        </div>
      )}
    </div>
  );
};

export default SudokuBoard;