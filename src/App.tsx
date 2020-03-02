import * as React from "react";

import "./styles.css";
import Routes from "./route";

export default function App() {
  // const history = useHistory();

  function link(route: string) {
    // history.push(route);
    // return;
  }

  return (
    <div className="App">
      {/* <Link to="/">home</Link>
      <Link to="/hello">hello</Link> */}
      <Routes />
    </div>
  );
}
