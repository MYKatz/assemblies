import React, { useMemo, useState } from "react";
import { Card } from "antd";
import { useContractLoader, useContractExistsAtAddress } from "../../hooks";
import Account from "../Account";
import Proposals from "./Proposals";
import FunctionForm from "./FunctionForm";

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
  userAddress,
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

  if (!displayedContractFunctions) {
    return null;
  }

  const createBanProposal = displayedContractFunctions.find(fn => fn.name === "createBanProposal");

  const numBanProposals = contract["numBanProposals"];
  const banProposalAddresses = contract["banProposalAddresses"];
  const banProposals = contract["banProposals"];
  const userState = contract["userState"];
  const hasUserVoted = contract["hasUserVoted"];
  let voteToBan;
  let ban;
  if (contract.connect) {
    voteToBan = contract.connect(signer)["voteToBan"];
    ban = contract.connect(signer)["ban"];
  }

  if (!createBanProposal) {
    return null;
  }

  const contractDisplay = [createBanProposal].map(fn => {
    return (
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
  });

  return (
    <div style={{ margin: "auto", width: "70vw" }}>
      <Card
        title={<div>Gov</div>}
        size="large"
        style={{ marginTop: 25, width: "100%" }}
        loading={contractDisplay && contractDisplay.length <= 0}
      >
        {contractDisplay}
        <Proposals
          numBanProposals={numBanProposals}
          banProposalAddresses={banProposalAddresses}
          banProposals={banProposals}
          userState={userState}
          userAddress={userAddress}
          hasUserVoted={hasUserVoted}
          voteToBan={voteToBan}
          ban={ban}
          triggerRefresh={triggerRefresh}
          refreshRequired={refreshRequired}
        />
      </Card>
    </div>
  );
}
