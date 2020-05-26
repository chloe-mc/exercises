import React, { ReactElement, useState, useEffect } from "react";
import "./App.scss";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import { exercises } from "./screens";
import { Exercise } from "./global";

function App() {
  const [routes, setRoutes] = useState<ReactElement[]>();
  const [links, setLinks] = useState<ReactElement[]>();

  useEffect(() => {
    const [routes, links] = renderExercises(exercises);
    setRoutes(routes);
    setLinks(links);
  }, []);

  const renderExercises = (exercises: Exercise[]) => {
    const routes: ReactElement[] = [];
    const links: ReactElement[] = [];

    exercises.map((exercise) => {
      routes.push(
        <Route
          key={exercise.link}
          component={exercise.component}
          path={`/${exercise.link}`}
        />
      );
      links.push(
        <Link
          key={exercise.link}
          className="list__item__container"
          to={exercise.link}
        >
          <div className="list__item" data-testid="exercise-list-item">
            <h3>
              <span role="img" aria-label={exercise.emojiAriaLabel}>
                {exercise.emoji}
              </span>{" "}
              {`${exercise.title} `}
              <span role="img" aria-label={exercise.emojiAriaLabel}>
                {exercise.emoji}
              </span>
            </h3>
          </div>
        </Link>
      );
    });
    return [routes, links];
  };

  return (
    <Router>
      <Switch>
        {routes}
        <Route path="/">
          <div className="app">
            <header className="app__header">
              <h1>
                <span role="img" aria-label="muscle arm">
                  💪
                </span>{" "}
                Exercises{" "}
                <span role="img" aria-label="muscle arm">
                  💪
                </span>
              </h1>
            </header>
            <div className="list__container">{links}</div>
          </div>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
