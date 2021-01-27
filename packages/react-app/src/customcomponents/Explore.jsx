/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from "react";
import Blockies from "react-blockies";
import { Row, Col, Divider } from "antd";

import { BrowserRouter, Switch, Route, Link } from "react-router-dom";

const Post = ({ sender, body }) => {
  return (
    <figure class="md:flex bg-gray-100 rounded-xl p-8 md:p-0 mb-10 shadow-lg">
      <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
        <blockquote>
          <p class="text-lg font-semibold">{body}</p>
        </blockquote>
        <figcaption class="font-medium flex">
          <div class="rounded-lg">
            <Blockies seed={sender} size={8} scale={4} />
          </div>
          <div class="text-gray-500 self-end ml-2">{sender}</div>
        </figcaption>
      </div>
    </figure>
  );
};

const Feed = ({ headFn, postsFn, triggerRefresh, refreshRequired }) => {
  const [posts, setPosts] = useState([1, 2, 3]);

  const refresh = useCallback(async () => {
    try {
      let curr = await headFn();
      let p = [];
      for (var i = 0; i < 32; i++) {
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
        <Post sender={post.sender} body={post.body} />
      ))}
    </div>
  );
};

export default Feed;
