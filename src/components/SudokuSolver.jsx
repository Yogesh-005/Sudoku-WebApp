import React, { useState } from 'react';
import './SudokuSolver.css';

const SudokuSolver = () => {
  const [board, setBoard] = useState(Array(9).fill().map(() => Array(9).fill(0)));
  const [solveStatus, setSolveStatus] = useState(null); // null, 'solved', 'unsolvable'
  const [solving, setSolving] = useState(false);

  // Handle input in cells
  const handleCellInput = (row, col, value) => {
    const newValue = value === '' ? 0 : parseInt(value, 10);
    if ((newValue >= 0 && newValue <= 9) || isNaN(newValue)) {
      const newBoard = board.map(r => [...r]);
      newBoard[row][col] = isNaN(newValue) ? 0 : newValue;
      setBoard(newBoard);
      // Reset status when user modifies the board
      setSolveStatus(null);
    }
  };

  // Clear the board
  const clearBoard = () => {
    setBoard(Array(9).fill().map(() => Array(9).fill(0)));
    setSolveStatus(null);
  };

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

  // Solve sudoku using backtracking
  const solveSudoku = (boardToSolve) => {
    // Find an empty cell
    let emptyCell = findEmptyCell(boardToSolve);
    
    // If no empty cell is found, the puzzle is solved
    if (!emptyCell) {
      return true;
    }
    
    const [row, col] = emptyCell;
    
    // Try digits 1-9
    for (let num = 1; num <= 9; num++) {
      if (isValidPlacement(boardToSolve, row, col, num)) {
        // Place the number
        boardToSolve[row][col] = num;
        
        // Recursively try to solve the rest
        if (solveSudoku(boardToSolve)) {
          return true;
        }
        
        // If placing this number doesn't lead to a solution, backtrack
        boardToSolve[row][col] = 0;
      }
    }
    
    // No solution found with current configuration
    return false;
  };

  // Find an empty cell (value 0)
  const findEmptyCell = (board) => {
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        if (board[row][col] === 0) {
          return [row, col];
        }
      }
    }
    return null; // No empty cell found
  };

  // Check if the initial board configuration is valid
  const isInitialBoardValid = (board) => {
    // Check each cell with a number
    for (let row = 0; row < 9; row++) {
      for (let col = 0; col < 9; col++) {
        const num = board[row][col];
        if (num !== 0) {
          // Temporarily remove the number to check if it's valid
          board[row][col] = 0;
          const valid = isValidPlacement(board, row, col, num);
          board[row][col] = num; // Put it back
          
          if (!valid) {
            return false;
          }
        }
      }
    }
    return true;
  };

  // Solve button handler
  const handleSolve = () => {
    if (!isInitialBoardValid(board)) {
      setSolveStatus('invalid');
      return;
    }

    setSolving(true);
    
    // Use setTimeout to allow UI to update before intensive computation
    setTimeout(() => {
      // Create a copy of the board to solve
      const boardCopy = board.map(row => [...row]);
      
      // Try to solve
      const solved = solveSudoku(boardCopy);
      
      if (solved) {
        setBoard(boardCopy);
        setSolveStatus('solved');
      } else {
        setSolveStatus('unsolvable');
      }
      
      setSolving(false);
    }, 100);
  };

  return (
    <div className="sudoku-solver">
      <h1>Sudoku Solver</h1>
      <p className="instructions">
        Enter the known numbers and click "Solve" to complete the puzzle.
      </p>
      
      <div className="solver-board">
        {board.map((row, rowIndex) => (
          <div key={`row-${rowIndex}`} className="board-row">
            {row.map((cell, colIndex) => {
              // Add classes for borders
              const isRightBorder = (colIndex + 1) % 3 === 0 && colIndex < 8;
              const isBottomBorder = (rowIndex + 1) % 3 === 0 && rowIndex < 8;
              const borderClass = `${isRightBorder ? 'right-border' : ''} ${isBottomBorder ? 'bottom-border' : ''}`;
              
              return (
                <input
                  key={`cell-${rowIndex}-${colIndex}`}
                  type="text"
                  className={`cell ${borderClass}`}
                  value={cell === 0 ? '' : cell}
                  onChange={(e) => handleCellInput(rowIndex, colIndex, e.target.value)}
                  maxLength="1"
                  disabled={solving}
                />
              );
            })}
          </div>
        ))}
      </div>

      <div className="solver-controls">
        <button 
          className="solve-button" 
          onClick={handleSolve}
          disabled={solving}
        >
          {solving ? 'Solving...' : 'Solve'}
        </button>
        <button 
          className="clear-button" 
          onClick={clearBoard}
          disabled={solving}
        >
          Clear
        </button>
      </div>
      
      {solveStatus && (
        <div className={`status-message ${solveStatus}`}>
          {solveStatus === 'solved' && 'Puzzle solved successfully!'}
          {solveStatus === 'unsolvable' && 'This puzzle cannot be solved. Please check your inputs.'}
          {solveStatus === 'invalid' && 'Invalid starting configuration. Please check for duplicates.'}
        </div>
      )}
    </div>
  );
};

export default SudokuSolver;