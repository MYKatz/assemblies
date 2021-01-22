import React, { useMemo, useState } from "react";
import { Card } from "antd";
import { useContractLoader, useContractExistsAtAddress } from "../../hooks";
import Account from "../Account";
import Posts from "./Posts";
import FunctionForm from "./FunctionForm";
import DisplayVariable from "./DisplayVariable";

const isQueryable = fn => (fn.stateMutability === "view" || fn.stateMutability === "pure") && fn.inputs.length === 0;

export default function Contract({
  customContract,
  account,
  gasPrice,
  signer,
  provider,
  name,
  show,
  price,
  blockExplorer,
}) {
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

  console.log(displayedContractFunctions);

  if (!displayedContractFunctions) {
    return null;
  }

  const fn = displayedContractFunctions[0];
  console.log(fn);

  if (!fn) {
    return null;
  }

  const contractDisplay = (
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
    <div style={{ margin: "auto", width: "70vw" }}>
      <Card
        title={<div>Feed</div>}
        size="large"
        style={{ marginTop: 25, width: "100%" }}
        loading={contractDisplay && contractDisplay.length <= 0}
      >
        {contractDisplay}
        <Posts
          headFn={contract["head"]}
          postsFn={contract["posts"]}
          triggerRefresh={triggerRefresh}
          refreshRequired={refreshRequired}
        />
      </Card>
    </div>
  );
}
