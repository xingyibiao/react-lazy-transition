import React from "react";
import { useHistory, withRouter } from "react-router-dom";

const Nav = () => {
  const history = useHistory();
  function navTo(path: string) {
    console.log(history);
    history.push(path);
  }

  return (
    <ul>
      <li onClick={() => navTo("/")}>home</li>
      <li onClick={() => navTo("/hello")}>hello</li>
    </ul>
  );
};

export default Nav;
