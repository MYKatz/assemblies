/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from "react";
import Blockies from "react-blockies";
import { Row, Col, Divider } from "antd";
import tryToDisplay from "./utils";
import FunctionForm from "./FunctionForm";

const DisplayVariable = ({ headFn, postsFn, triggerRefresh, refreshRequired }) => {
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
        <>
          <Row>
            <Col span={8} style={{ display: "flex", justifyContent: "space-around" }}>
              <Blockies seed={post.sender.toLowerCase()} size={8} scale={4} />
              <div
                style={{
                  textAlign: "center",
                  opacity: 0.333,
                  paddingRight: 6,
                  fontSize: 24,
                }}
              >
                {post.sender.slice(0, 8)}
              </div>
            </Col>
            <Col span={14}>
              <h2>{post.body}</h2>
            </Col>
          </Row>
          <Divider />
        </>
      ))}
    </div>
  );
};

export default DisplayVariable;
