import React from "react";
import { render, fireEvent } from "@testing-library/react";
import { exercises } from "./screens";
import App from "./App";

test("renders exercise list", () => {
  const { getAllByTestId } = render(<App />);
  const linkElements = getAllByTestId(/exercise-list-item/i);
  expect(linkElements.length).toBe(exercises.length);
});

test("changes window location when exercise is pressed", () => {
  const { getByTestId } = render(<App />);
  const linkElement = getByTestId(/exercise-list-item/i);
  fireEvent.click(linkElement);
  expect(window.location.pathname).toBe(`/${exercises[0].link}`);
});
