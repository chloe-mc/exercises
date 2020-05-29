import { TextEditor } from "./text-editor/TextEditor";
import { TicTacToe } from "./tic-tac-toe/TicTacToe";
import { CoordyGolfing } from "./coordy-goes-golfing/CoordyGolfing";
import { Snake } from "./snake/Snake";
import { Exercise } from "../global";

const exercises: Exercise[] = [
  {
    title: "Text Editor",
    emoji: "📝",
    emojiAriaLabel: "Pen and paper",
    component: TextEditor,
    link: "text-editor",
  },
  {
    title: "TicTacToe",
    emoji: "❌⭕",
    emojiAriaLabel: "Big X and big O",
    component: TicTacToe,
    link: "tic-tac-toe",
  },
  {
    title: "Coordy Goes Golfing",
    emoji: "⛳",
    emojiAriaLabel: "Golf hole with flag and ball",
    component: CoordyGolfing,
    link: "coordy-goes-golfing",
  },
  {
    title: "Snake",
    emoji: "🐍",
    emojiAriaLabel: "Snake curled up",
    component: Snake,
    link: "snake",
  },
];

export { exercises };
