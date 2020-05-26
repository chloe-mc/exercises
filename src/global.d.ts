import React from "react";

export type Exercise = {
  title: string;
  emoji: string;
  emojiAriaLabel: string;
  component: React.FunctionComponent<any>;
  link: string;
};
