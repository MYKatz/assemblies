import React, { useState, useEffect, useCallback, useMemo } from "react";
import Blockies from "react-blockies";
import { useContractLoader, useContractExistsAtAddress } from "../hooks";
import { Row, Col, Input, Divider, Tooltip, Button } from "antd";

import { BrowserRouter, Switch, Route, Link, useParams } from "react-router-dom";

import FunctionForm from "./FunctionForm";
import DisplayVariable from "./DisplayVariable";

import { hexToString } from "./utils";

import { BigNumber } from "@ethersproject/bignumber";
import { Transactor } from "../helpers";
import { tryToDisplay } from "./utils";

const { utils } = require("ethers");

const AddPost = ({ contractFunction, functionInfo, provider, gasPrice, triggerRefresh }) => {
  const [form, setForm] = useState("");
  const [txValue, setTxValue] = useState();
  const [returnValue, setReturnValue] = useState();

  const tx = Transactor(provider, gasPrice);

  const parent = "0x0000000000000000000000000000000000000000000000000000000000000000";
  const postType = 1;

  let inputIndex = 0;

  const input = functionInfo.inputs.find(input => input.name == "body");

  const inputs = [
    <div className="">
      <textarea
        size="large"
        autoComplete="off"
        value={form}
        onChange={event => {
          setForm(event.target.value);
        }}
        style={{ fontSize: "1.6rem" }}
        rows="3"
        placeholder="What's happening?"
        className="mt-1 block w-full rounded-md text-xl focus:border-transparent"
      />
    </div>,
  ];

  const buttonIcon = <Button style={{ marginLeft: -32 }}>Post</Button>;

  inputs.push(
    <div className="py-2 md:w-4/5 w-11/12 px-6" key={"goButton"}>
      <div
        type="default"
        onClick={async () => {
          let innerIndex = 0;

          let body;

          if (utils.isHexString(form)) {
            const formUpdate = utils.toUtf8String(form);
            body = formUpdate;
          } else {
            const formUpdate = utils.hexlify(utils.toUtf8Bytes(form));
            body = formUpdate;
          }

          if (!body) return;

          const args = [parent, postType, body];

          let result;
          if (functionInfo.stateMutability === "view" || functionInfo.stateMutability === "pure") {
            const returned = await contractFunction(...args);
            result = tryToDisplay(returned);
          } else {
            const overrides = {};
            if (txValue) {
              overrides.value = txValue; // ethers.utils.parseEther()
            }

            // console.log("Running with extras",extras)
            const returned = await tx(contractFunction(...args, overrides));
            result = tryToDisplay(returned);
          }

          console.log("SETTING RESULT:", result);
          setForm("");
          triggerRefresh(true);
        }}
      >
        {buttonIcon}
      </div>
    </div>,
  );

  return (
    <div>
      {inputs}
      <Divider />
    </div>
  );
};

export default AddPost;
