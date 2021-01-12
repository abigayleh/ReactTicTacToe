import React, {useState} from 'react';
import ReactDOM from "react-dom";
import "./index.css";

function Square(props){
  return(
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  )
}

function Board(props) {

  const renderSquare = (i) => {
    return (
      <Square
        value={props.squares[i]}
        // Game class handles click
        onClick={() => props.onClick(i)}
      />
    );
  }

    return (
      <div>
        <div className="board-row">
          {renderSquare(0)}
          {renderSquare(1)}
          {renderSquare(2)}
        </div>
        <div className="board-row">
          {renderSquare(3)}
          {renderSquare(4)}
          {renderSquare(5)}
        </div>
        <div className="board-row">
          {renderSquare(6)}
          {renderSquare(7)}
          {renderSquare(8)}
        </div>
      </div>
    )
}

function Game() {

  const [history, setHistory] = useState([{
    squares: Array(9).fill(null)
  }]);
  const [xIsNext, changeX] = useState(true);
  const [stepNumber, changeStepNumber] = useState(0);

  const handleClick = (i) => {
    const his = history.slice(0, stepNumber + 1);
    const current = his[his.length - 1];
    const squares = current.squares.slice();

    if(squares[i] == null && calculateWinner(squares) == null) {
      squares[i] = xIsNext ? 'X' : 'O';
      setHistory(history.concat([{
        squares: squares,
      }]));
      changeStepNumber(history.length);
      changeX(!xIsNext);
    }
  }

  const jumpTo = (step) => {
    changeStepNumber(step);
    changeX((step % 2) === 0);
  }

    const outputHistory = history;
    const current = outputHistory[stepNumber];
    const checkWinner = calculateWinner(current.squares);
    
    // Output history of moves
    const moves = outputHistory.map((step, move) => {
      const desc = move ?
      'Go to move ' + move :
      'Go to game start';
      return(
        <li key={move}>
          <button onClick={() => jumpTo(move)}>
            {desc}
          </button>
        </li>
      )
    })
    
    let status;
    if(checkWinner != null) {
      status = "Congratulations player " + checkWinner + "! You have won!";
    }
    else {
      const value = xIsNext ? 'X' : 'O';
      status = "Next player: " + value;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
          squares={current.squares}
          onClick={(i) => handleClick(i)}/>
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

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
