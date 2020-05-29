import { Machine, assign } from "xstate";

export enum Direction {
  Up = 38,
  Down = 40,
  Left = 37,
  Right = 39,
}

export type SnakeSegment = {
  x: number;
  y: number;
};

type SnakeEvent =
  | { type: "START_GAME" }
  | { type: "CHANGE_DIRECTION"; direction: Direction }
  | { type: "END_GAME" }
  | { type: "EAT" }
  | { type: "MOVE_SNAKE"; snake: SnakeSegment[] };

interface SnakeStateSchema {
  states: {
    idle: {};
    playing: {};
  };
}
interface SnakeContext {
  boardEdgeLength: number;
  direction: SnakeSegment;
  snake: SnakeSegment[];
  wonLastRound?: boolean;
}

const directions = {
  [Direction.Up]: { x: 0, y: -1 },
  [Direction.Down]: { x: 0, y: 1 },
  [Direction.Left]: { x: -1, y: 0 },
  [Direction.Right]: { x: 1, y: 0 },
};

const initialSnake = [
  { x: 7, y: 9 },
  { x: 8, y: 9 },
  { x: 9, y: 9 },
];

const snakeMachine = Machine<SnakeContext, SnakeStateSchema, SnakeEvent>(
  {
    id: "snake",
    initial: "idle",
    context: {
      boardEdgeLength: 20,
      direction: directions[Direction.Right],
      snake: initialSnake,
      wonLastRound: undefined,
    },
    states: {
      idle: {
        on: {
          START_GAME: "playing",
        },
      },
      playing: {
        invoke: {
          src: (context) => (callback) => {
            const interval = setInterval(() => {
              callback("MOVE_SNAKE");
            }, 100);
            return () => clearInterval(interval);
          },
        },
        on: {
          CHANGE_DIRECTION: {
            actions: [
              assign({
                direction: (_, event) => directions[event.direction],
              }),
            ],
          },
          MOVE_SNAKE: {
            actions: "validateAndMoveSnake",
          },
          END_GAME: {
            target: "idle",
            actions: assign({ snake: (_) => initialSnake }),
          },
        },
      },
    },
  },
  {
    actions: {
      validateAndMoveSnake: assign({
        snake: (context) => {
          const nuSnake = [...context.snake];
          const lastPosition = nuSnake[nuSnake.length - 1];

          let nextX = lastPosition.x + context.direction.x;
          if (nextX > context.boardEdgeLength - 1) nextX = 0;
          if (nextX < 0) nextX = context.boardEdgeLength - 1;

          let nextY = lastPosition.y + context.direction.y;
          if (nextY > context.boardEdgeLength - 1) nextY = 0;
          if (nextY < 0) nextY = context.boardEdgeLength - 1;

          nuSnake.shift();
          nuSnake.push({
            x: nextX,
            y: nextY,
          });
          return nuSnake;
        },
      }),
    },
  }
);

export { snakeMachine };
