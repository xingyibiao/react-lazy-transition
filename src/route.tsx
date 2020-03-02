import {
  BrowserRouter as Router,
  Route,
  Switch,
  useHistory
} from "react-router-dom";
import React, { FC, Suspense, lazy, useState, useEffect } from "react";
import { CSSTransition, TransitionGroup } from "react-transition-group";

import "./route.css";

const Hello = lazy(() => import("./views/hello"));
const Home = lazy(() => import("./views/home"));

type EventBus = {
  bus: Array<string | Function>[];
  emit: (evt: string, payload?: any) => void;
  on: (evt: string, listener: Function) => void;
  off: (evt: string, listener: Function) => void;
};

const eventBus: EventBus = {
  bus: [],
  emit(evt: string, payload?: any) {
    const { bus } = eventBus;
    let i = 0;
    while (i < bus.length) {
      if (!bus[i]) {
        i++;
        continue;
      }
      const [name, ...listeners] = bus[i];
      console.log(evt, name, listeners, i);
      if (name && listeners.length) {
        if (name === evt) {
          listeners.forEach(listener => {
            if (typeof listener === "function") {
              console.log("before call", listener);
              listener(payload);
            }
          });
        }
      }
      i++;
    }
  },
  on(evt: string, listener: Function) {
    const { bus } = eventBus;
    if (!bus.length) {
      bus.push([evt, listener]);
      return;
    }
    let i = 0;
    let has = false;
    while (i < bus.length) {
      i++;
      if (!bus[i]) continue;
      const [name, ...listeners] = bus[i];
      if (name === evt) {
        if (listeners.indexOf(listener) <= 0) {
          has = true;
          bus[i].push(listener);
        }
      }
    }
    if (!has) {
      bus.push([evt, listener]);
    }
  },
  off(evt: string, listener: Function) {
    const { bus } = eventBus;
    let i = 0;
    if (!bus.length) return;

    while (i < bus.length) {
      i++;
      if (!bus[i]) continue;
      const [name, ...listeners] = bus[i];
      if (evt === name) {
        const index = listeners.findIndex(l => l === listener);
        listeners.splice(index, 1);
      }
    }
  }
};

const wrap: (component: any) => any = WrapComponent => {
  return (
    <div className="page">
      <Suspense fallback={<div>loading</div>}>
        <WrapComponent />
      </Suspense>
    </div>
  );
};

const historyStack: string[] = [];
const Nav = () => {
  const history = useHistory();

  function navTo(path: string) {
    if (historyStack.indexOf(path) > -1) {
      eventBus.emit("navBack");
    } else {
      historyStack.push(path);
      eventBus.emit("navForWard");
    }
    history.push(path);
  }

  return (
    <ul>
      <li onClick={() => navTo("/")}>home</li>
      <li onClick={() => navTo("/hello")}>hello</li>
    </ul>
  );
};

const App: FC = () => {
  const [cName, setCName] = useState("forward");
  const [forward, setForward] = useState<boolean>(true);
  const id = 1;
  // useEffect(() => {
  //   console.log("effect");
  //   eventBus.on("navBack", handlerBack);
  //   eventBus.on("navForWard", handlerForward);
  //   return () => {
  //     console.log('unmount')
  //     eventBus.off("navBack", handlerBack);
  //     eventBus.off('navForWard', handlerForward)
  //   }
  // }, [id]);

  function handlerBack() {
    console.log("back");
    setCName("back");
  }

  function handlerForward() {
    console.log("forward");
    setCName("forward");
  }

  const routes = [
    {
      path: "/",
      Component: Home,
      exact: true
    },
    {
      path: "/hello",
      Component: Hello
    }
  ];

  return (
    <>
      <Router>
        <label>
          <input
            type="checkbox"
            checked={forward}
            onChange={() => setForward(preState => !preState)}
          />
          forward
        </label>
        <Nav />
        <div>
          <Route
            render={({ location }) => (
              <TransitionGroup>
                <CSSTransition
                  key={location.pathname}
                  classNames={forward ? "forward" : "back"}
                  appear
                  timeout={5000}
                >
                  <Switch location={location}>
                    {routes.map(r => {
                      return (
                        <Route exact={r.exact} path={r.path} key={r.path}>
                          {wrap(r.Component)}
                        </Route>
                      );
                    })}
                  </Switch>
                </CSSTransition>
              </TransitionGroup>
            )}
          />
        </div>
      </Router>
    </>
  );
};

export default App;
