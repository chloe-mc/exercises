import React, { useEffect, useRef } from "react";
import { useMachine } from "@xstate/react";
import { snakeMachine, Direction, SnakeSegment } from "./snake-machine";
import "./Snake.scss";

const Snake = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [state, send, service] = useMachine(snakeMachine);

  const tileSize = state.context.boardDimension;
  const boardDimension = tileSize ** 2;

  useEffect(() => {
    const spaceBar = 32;
    const onKeyDown = (e: any) => {
      if (e.keyCode in Direction) {
        send("CHANGE_DIRECTION", { direction: e.keyCode });
        return;
      }

      if (e.keyCode === spaceBar) {
        toggleGame();
      }
    };
    document.addEventListener("keydown", onKeyDown);

    draw();

    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  useEffect(() => {
    draw(state.context.snake, state.context.food);
  }, [state.context.snake]);

  const draw = (snake?: SnakeSegment[], food?: SnakeSegment) => {
    const canvas = canvasRef?.current;
    const context = canvas?.getContext("2d");

    if (context) {
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

      snake &&
        snake.map(({ x, y }) => {
          context.fillStyle = "orange";
          context.fillRect(x * tileSize, y * tileSize, tileSize, tileSize);
          context.lineWidth = 0.5;
          context.strokeStyle = "#eeeeee";
          context.strokeRect(x * tileSize, y * tileSize, tileSize, tileSize);
        });

      if (food) {
        context.fillStyle = "brown";
        context.fillRect(
          food.x * tileSize,
          food.y * tileSize,
          tileSize,
          tileSize
        );
        context.lineWidth = 0.5;
        context.strokeStyle = "#eeeeee";
        context.strokeRect(
          food.x * tileSize,
          food.y * tileSize,
          tileSize,
          tileSize
        );
      }
    }
  };

  const toggleGame = () => {
    if (service.state.matches("idle")) return send("START_GAME");
    send("END_GAME");
  };

  return (
    <div>
      <div className="header">
        <h1>Snake</h1>
      </div>
      <div className="content">
        <button
          className="button"
          onClick={() => toggleGame()}
          title="Or Press Space Bar"
        >
          {state.matches("idle") ? "Begin" : "End"}
        </button>

        <div>(Or Press Spacebar)</div>
        <div className="grid">
          <canvas
            height={boardDimension}
            width={boardDimension}
            ref={canvasRef}
          />
        </div>
        {state.context.gameOver && (
          <div>
            You lost{" "}
            <span role="img" aria-label="sob">
              😭
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export { Snake };
