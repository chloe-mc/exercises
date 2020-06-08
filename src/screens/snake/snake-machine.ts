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
  boardDimension: number;
  direction: Direction;
  directions: { [key in Direction]: SnakeSegment };
  food?: SnakeSegment;
  gameOver: boolean;
  highScore: boolean;
  initialSnake: SnakeSegment[];
  score: number;
  snake: SnakeSegment[];
}

const getRandomInt = (dimension: number) =>
  Math.floor(Math.random() * dimension);

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
      boardDimension: 20,
      direction: Direction.Right,
      directions: {
        [Direction.Up]: { x: 0, y: -1 },
        [Direction.Down]: { x: 0, y: 1 },
        [Direction.Left]: { x: -1, y: 0 },
        [Direction.Right]: { x: 1, y: 0 },
      },
      food: undefined,
      gameOver: false,
      highScore: false,
      initialSnake: initialSnake,
      score: 0,
      snake: initialSnake,
    },
    states: {
      idle: {
        on: {
          START_GAME: {
            target: "playing",
            actions: assign<SnakeContext, SnakeEvent>({ highScore: false }),
          },
        },
        exit: assign<SnakeContext, SnakeEvent>({
          gameOver: false,
          direction: Direction.Right,
          score: 0,
        }),
      },
      playing: {
        invoke: {
          src: () => (callback) => {
            const interval = setInterval(() => {
              callback("MOVE_SNAKE");
            }, 100);
            return () => clearInterval(interval);
          },
        },
        on: {
          "": [
            {
              target: "idle",
              actions: [
                "checkHighScore",
                assign<SnakeContext, SnakeEvent>({
                  snake: (context) => context.initialSnake,
                  food: undefined,
                }),
              ],
              cond: (context) => context.gameOver,
            },
            {
              actions: assign({
                food: (context) => ({
                  x: getRandomInt(context.boardDimension),
                  y: getRandomInt(context.boardDimension),
                }),
              }),
              cond: (context) => !context.food,
            },
          ],
          CHANGE_DIRECTION: {
            actions: [
              assign({
                direction: (context, event) => {
                  const horizontal = [Direction.Left, Direction.Right];
                  const vertical = [Direction.Up, Direction.Down];
                  const isOppositeDirection =
                    (horizontal.includes(event.direction) &&
                      horizontal.includes(context.direction)) ||
                    (vertical.includes(event.direction) &&
                      vertical.includes(context.direction));

                  if (isOppositeDirection) return context.direction;

                  return event.direction;
                },
              }),
            ],
          },
          MOVE_SNAKE: {
            actions: "validateAndMoveSnake",
          },
          END_GAME: {
            actions: assign<SnakeContext, SnakeEvent>({
              gameOver: true,
            }),
          },
        },
      },
    },
  },
  {
    actions: {
      checkHighScore: assign({
        highScore: (context) => {
          const currentHighScore =
            parseInt(localStorage.getItem("snakeHighScore") ?? "") || 0;

          let highScore = false;
          if (context.score > currentHighScore) {
            localStorage.setItem("snakeHighScore", context.score.toString());
            highScore = true;
          }

          return highScore;
        },
      }),
      validateAndMoveSnake: assign((context) => {
        const snake = [...context.snake];
        const snakeHead = snake[snake.length - 1];
        const maxBoardEdge = context.boardDimension - 1;

        let nextX = snakeHead.x + context.directions[context.direction].x;
        if (nextX > maxBoardEdge) nextX = 0;
        if (nextX < 0) nextX = maxBoardEdge;

        let nextY = snakeHead.y + context.directions[context.direction].y;
        if (nextY > maxBoardEdge) nextY = 0;
        if (nextY < 0) nextY = maxBoardEdge;

        const gameOver = snake.some(
          (segment) => segment.x === nextX && segment.y === nextY
        );
        if (gameOver) return { gameOver: gameOver };

        const hasEaten = snake.some(
          (segment) =>
            segment.x === context.food?.x && segment.y === context.food?.y
        );

        let food = undefined;
        if (!hasEaten) {
          snake.shift();
          food = context.food;
        }

        let score = hasEaten ? context.score + 10 : context.score;

        snake.push({ x: nextX, y: nextY });

        return { snake, gameOver, food, score };
      }),
    },
  }
);

export { snakeMachine };
