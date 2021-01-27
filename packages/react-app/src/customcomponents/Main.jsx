import React, { useCallback, useEffect, useState } from "react";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

const Main = () => {
  return (
    <Switch>
      <Route exact path="/explore">
        Explore
      </Route>
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
