import React, { useState, useEffect, useCallback, useMemo } from "react";
import Blockies from "react-blockies";
import { useContractLoader, useContractExistsAtAddress } from "../hooks";
import { Row, Col, Divider } from "antd";

import { BrowserRouter, Switch, Route, Link, useParams } from "react-router-dom";

import FunctionForm from "./FunctionForm";
import DisplayVariable from "./DisplayVariable";

import AddPost from "./AddPost";

import { hexToString } from "./utils";

const Post = ({ sender, body }) => {
  body = hexToString(body);

  return (
    <figure class="md:flex bg-gray-100 rounded-xl p-8 md:p-0 mb-10 shadow-lg">
      <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
        <blockquote>
          <p class="text-lg font-semibold">{body}</p>
        </blockquote>
        <figcaption class="font-medium flex">
          <div class="rounded-lg">
            <Blockies seed={sender.toLowerCase()} size={8} scale={4} />
          </div>
          <div class="text-gray-500 self-end ml-2">{sender}</div>
        </figcaption>
      </div>
    </figure>
  );
};

const Feed = ({ headFn, postsFn, triggerRefresh, refreshRequired }) => {
  const [posts, setPosts] = useState([]);

  let { contractAddress, postId } = useParams();

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

  useEffect(() => {
    const timer = setInterval(() => {
      refresh();
    }, 10000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div>
      {contractAddress}
      {postId}
      {posts.map(post => {
        if (post.data) {
          return <Post sender={post.author} body={post.data} />;
        }
      })}
    </div>
  );
};

const Explore = ({ customContract, account, gasPrice, signer, provider, name, show, price, blockExplorer }) => {
  const contracts = useContractLoader(provider);
  const [refreshRequired, triggerRefresh] = useState(false);
  let contract;
  if (!customContract) {
    contract = contracts ? contracts[name] : "";
  } else {
    contract = customContract;
  }

  const address = contract ? contract.address : "";
  const contractIsDeployed = useContractExistsAtAddress(provider, address);

  const displayedContractFunctions = useMemo(
    () =>
      contract
        ? Object.values(contract.interface.functions).filter(
            fn => fn.type === "function" && !(show && show.indexOf(fn.name) < 0),
          )
        : [],
    [contract, show],
  );

  if (!displayedContractFunctions) {
    return null;
  }

  const fn = displayedContractFunctions.find(fn => fn.name === "addPost");

  if (!fn) {
    return null;
  }

  const addPost = (
    <FunctionForm
      key={"FF" + fn.name}
      contractFunction={
        fn.stateMutability === "view" || fn.stateMutability === "pure"
          ? contract[fn.name]
          : contract.connect(signer)[fn.name]
      }
      functionInfo={fn}
      provider={provider}
      gasPrice={gasPrice}
      triggerRefresh={triggerRefresh}
    />
  );

  return (
    <>
      <AddPost
        contractFunction={
          fn.stateMutability === "view" || fn.stateMutability === "pure"
            ? contract[fn.name]
            : contract.connect(signer)[fn.name]
        }
        functionInfo={fn}
        provider={provider}
        gasPrice={gasPrice}
        triggerRefresh={triggerRefresh}
      />
      <Feed
        headFn={contract["head"]}
        postsFn={contract["posts"]}
        triggerRefresh={triggerRefresh}
        refreshRequired={refreshRequired}
      />
    </>
  );
};

export default Explore;
