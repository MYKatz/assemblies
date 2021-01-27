import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

import Explore from "./Explore";

const Main = props => {
  return (
    <Switch>
      <Route path="/explore/:contractAddress?/:postId?" children={<Explore {...props} />}></Route>
      <Route exact path="/gov">
        Gov
      </Route>
      <Route exact path="/factory">
        Factory
      </Route>
    </Switch>
  );
};

export default Main;
