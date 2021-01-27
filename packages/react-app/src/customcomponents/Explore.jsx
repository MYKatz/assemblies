/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from "react";
import Blockies from "react-blockies";
import { Row, Col, Divider } from "antd";
import tryToDisplay from "./utils";
import FunctionForm from "./FunctionForm";

import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

const Feed = ({ headFn, postsFn, triggerRefresh, refreshRequired }) => {
  const [posts, setPosts] = useState([]);

  const refresh = useCallback(async () => {
    try {
      let curr = await headFn();
      let p = [];
      for (var i = 0; i < 8; i++) {
        let post = await postsFn(curr);
        p.push(post);
        if (post.next == 0) break;
        curr = post.next;
      }
      setPosts(p);
      console.log(p);
      triggerRefresh(false);
    } catch (e) {
      console.log(e);
    }
  }, [triggerRefresh, refreshRequired]);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <div>
      {posts.map(post => (
        <figure class="md:flex bg-gray-100 rounded-xl p-8 md:p-0">
            <img class="w-32 h-32 md:w-48 md:h-auto md:rounded-none rounded-full mx-auto" src="/sarah-dayan.jpg" alt="" width="384" height="512">
            <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
              <blockquote>
                <p class="text-lg font-semibold">
                  “Tailwind CSS is the only framework that I've seen scale
                  on large teams. It’s easy to customize, adapts to any design,
                  and the build size is tiny.”
                </p>
              </blockquote>
              <figcaption class="font-medium">
                <div class="text-cyan-600">
                  Sarah Dayan
                </div>
                <div class="text-gray-500">
                  Staff Engineer, Algolia
                </div>
              </figcaption>
            </div>
        </figure>
      ))}
    </div>
  );
};

export default Feed;
