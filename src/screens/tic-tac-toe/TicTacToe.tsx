import React, { useState, useEffect } from "react";
import "./TicTacToe.scss";

const checkForWinner = (board: string[]) => {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  return winningCombinations.some((combination) => {
    const position0 = board[combination[0]];
    const position1 = board[combination[1]];
    const position2 = board[combination[2]];

    if (position0 === "" || position1 === "" || position2 === "") return false;

    return position0 === position1 && position1 === position2;
  });
};

const TicTacToe = () => {
  const [board, setBoard] = useState<string[]>(new Array(9).fill(""));
  const [player, setPlayer] = useState("o");
  const [winner, setWinner] = useState("");

  useEffect(() => {
    const winner = checkForWinner(board);
    if (winner) {
      setWinner(player);
    } else {
      const newPlayer = player === "o" ? "x" : "o";
      setPlayer(newPlayer);
    }
  }, [board]);

  const handleCellClick = (index: number) => {
    const boardUpdate = [...board];
    boardUpdate[index] = player;
    setBoard(boardUpdate);
  };

  const restart = () => {
    setBoard(new Array(9).fill(""));
    setWinner("");
  };

  return (
    <div className="tictactoe__container">
      <header className="tictactoe__header">
        <h1>TicTacToe</h1>
        <p>Current player: {player}</p>
      </header>
      <button onClick={restart}>Restart</button>
      <div className="board__container">
        {board.map((cell, index) => {
          return (
            <button
              className="board__cell"
              onClick={() => handleCellClick(index)}
            >
              {cell}
            </button>
          );
        })}
      </div>
      {winner && <p>{winner} wins!</p>}
    </div>
  );
};

export { TicTacToe };
