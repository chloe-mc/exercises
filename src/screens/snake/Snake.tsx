import React, { useEffect, useRef } from "react";
import { useMachine } from "@xstate/react";
import { snakeMachine, Direction, SnakeSegment } from "./snake-machine";
import "./Snake.scss";

const Snake = () => {
  const canvasRef = useRef<any>();
  const [state, send] = useMachine(snakeMachine);

  const tileSize = state.context.boardEdgeLength;
  const boardDimension = tileSize ** 2;

  useEffect(() => {
    const spaceBar = 32;
    const onKeyDown = (e: any) => {
      if (e.keyCode in Direction) {
        send("CHANGE_DIRECTION", { direction: e.keyCode });
        return;
      }

      if (e.keyCode === spaceBar) {
        startGame();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    draw(state.context.snake);
  }, [state.context.snake]);

  const draw = (snake: SnakeSegment[]) => {
    const canvas = canvasRef?.current;
    const context = canvas?.getContext("2d");

    context.clearRect(0, 0, boardDimension, boardDimension);

    for (let y = 0; y < tileSize; y++) {
      for (let x = 0; x < tileSize; x++) {
        context.lineWidth = 0.5;
        context.strokeStyle = "lightgray";
        context.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
      }
    }
    context.strokeStyle = "lightgray";
    context.lineWidth = 5;
    context.strokeRect(0, 0, boardDimension, boardDimension);

    snake.map(({ x, y }) => {
      context.fillStyle = "orange";
      context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
      context.lineWidth = 0.5;
      context.strokeStyle = "#eeeeee";
      context.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
    });
  };

  const startGame = () => {
    send("START_GAME");
  };

  const endGame = () => {
    send("END_GAME");
  };

  return (
    <div>
      <div className="snake__header">
        <h1>Snake</h1>
        <button
          className="snake__start-game"
          onClick={() => (state.matches("idle") ? startGame() : endGame())}
          title="Or Press Space Bar"
        >
          {state.matches("idle") ? "Begin" : "End"}
        </button>
      </div>
      <div className="snake__grid">
        <canvas
          height={boardDimension}
          width={boardDimension}
          ref={canvasRef}
        />
      </div>
    </div>
  );
};

export { Snake };
