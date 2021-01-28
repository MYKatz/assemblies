import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import Explore from "./Explore";
import Gov from "./Gov/index";

const Main = props => {
  return (
    <Switch>
      <Route path="/explore/:contractAddress?/:postId?" children={<Explore {...props} />}></Route>
      <Route exact path="/gov">
        <Gov {...props} name="Gerontocracy" />
      </Route>
      <Route exact path="/factory">
        Factory
      </Route>
    </Switch>
  );
};

export default Main;
