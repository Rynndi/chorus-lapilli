import { useState } from 'react';

function Square({ value, onSquareClick }) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

function isAdjacent(srcIndex, destIndex) {
  const srcRow = Math.floor(srcIndex / 3);
  const srcCol = srcIndex % 3;
  const destRow = Math.floor(destIndex / 3);
  const destCol = destIndex % 3;

  return Math.abs(srcRow - destRow) <= 1 && Math.abs(srcCol - destCol) <= 1;
}

function Board({ xIsNext, squares, onPlay, currentMove }) {
  const [selectedSquare, setSelectedSquare] = useState(null);

  function handleClick(i) {
    if (calculateWinner(squares) || squares[i] && currentMove < 6) {
      return;
    }
      const nextSquares = squares.slice();
      const player = xIsNext ? 'X' : 'O'; 

    if (currentMove >= 6) {
      if (selectedSquare === null && squares[i] === player) {
          setSelectedSquare(i);
        return;
      }

	else if (selectedSquare !== null && squares[i] === null && isAdjacent(selectedSquare, i)) {
        nextSquares[selectedSquare] = null;
        nextSquares[i] = player;
        setSelectedSquare(null);
        onPlay(nextSquares);
        return;
      }
    }
    
      else if (currentMove < 6) {
      nextSquares[i] = player;
      onPlay(nextSquares);
    }
      
  }

  const winner = calculateWinner(squares);
  const status = winner ? 'Winner: ' + winner : 'Next player: ' + (xIsNext ? 'X' : 'O');

  return (
    <>
      <div className="status">{status}</div>
      {Array.from({ length: 3 }).map((_, row) => (
        <div className="board-row" key={row}>
          {Array.from({ length: 3 }).map((_, col) => (
            <Square key={row * 3 + col} value={squares[row * 3 + col]} onSquareClick={() => handleClick(row * 3 + col)} />
          ))}
        </div>
      ))}
    </>
  );
}

function Game() {
  const [history, setHistory] = useState([{ squares: Array(9).fill(null), selectedSquare: null }]);
  const [currentMove, setCurrentMove] = useState(0);
  const xIsNext = currentMove % 2 === 0;
    const currentSquares = history[currentMove].squares;
    const selectedSquare = history[currentMove].selectedSquare;

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), { squares: nextSquares, selectedSquare: null }];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  function setSelectedSquare(index) {
  const newHistory = [...history];
  newHistory[currentMove] = { ...newHistory[currentMove], selectedSquare: index };
  setHistory(newHistory);
}


  const moves = history.map((_, move) => (
    <li key={move}>
      <button onClick={() => jumpTo(move)}>{move > 0 ? `Go to move #${move}` : 'Go to game start'}</button>
    </li>
  ));

  return (
      <div className="game">
	
      <div className="game-board">
          <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} currentMove={currentMove}
		 selectedSquare= {selectedSquare} setSelectedSquare={setSelectedSquare}

	  />
      </div>
      <div className="game-info">
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

export default Game;
