import React, { useMemo, useState, useEffect } from "react";
import ContractDisplay from "./Contract";

import { useContractLoader, useContractExistsAtAddress } from "../../hooks";
import { Button } from "antd";

import { format, render, cancel, register } from "timeago.js";
import Blockies from "react-blockies";
import { Transactor } from "../../helpers";

const parseDisplayString = displayString => {
  let pairs = displayString.split(";");
  let out = [];
  for (let i = 0; i < pairs.length; i++) {
    const p = pairs[i].split(":");
    out.push(p);
  }
  return out;
};

const Proposal = ({ i, proposer, target, yesPower, noPower, voteYes, voteNo }) => {
  console.log(yesPower);
  const total = yesPower + noPower;
  let percent = Math.round((yesPower * 100) / total);

  if (Number.isNaN(percent)) percent = 0;

  return (
    <figure class="bg-gray-100 rounded-xl p-8 md:p-0 mb-10 shadow-lg">
      <div className="text-center pt-4 text-2xl flex justify-center">
        Proposal #{i}: ban {"    "}
        <Blockies className="ml-2" seed={target.toLowerCase()} size={8} scale={4} /> {target}
      </div>
      <div className="text-center pt-4 text-xl">{percent}% yes</div>
      <div class="text-center pt-4">
        <Button className="mx-4" onClick={voteYes}>
          Vote Yes
        </Button>
        <Button className="mx-4" onClick={voteNo}>
          Vote No
        </Button>
      </div>
      <div class="pt-6 md:p-8 text-center md:text-left space-y-4">
        <blockquote>
          <p class="text-lg font-semibold"></p>
        </blockquote>
        <figcaption class="font-medium flex">
          <div class="text-gray-500 self-end mr-4">submitted by</div>
          <div class="rounded-lg">
            <Blockies seed={proposer.toLowerCase()} size={8} scale={4} />
          </div>
          <div class="text-gray-500 self-end ml-2">{proposer.toLowerCase()}</div>
        </figcaption>
      </div>
    </figure>
  );
};

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
  const tx = Transactor(provider, gasPrice);
  const [showContract, setShowContract] = useState(false);
  const [proposals, setProposals] = useState([]);

  const [fNames, setFNames] = useState(new Set());
  const contracts = useContractLoader(provider);
  let contract;
  if (!customContract) {
    contract = contracts ? contracts[name] : "";
  } else {
    contract = customContract;
  }

  const address = contract ? contract.address : "";
  const contractIsDeployed = useContractExistsAtAddress(provider, address);

  let displayedContractFunctions = useMemo(
    () =>
      contract
        ? Object.values(contract.interface.functions).filter(
            fn => fn.type === "function" && !(show && show.indexOf(fn.name) < 0),
          )
        : [],
    [contract, show],
  );

  console.log("display");
  console.log(displayedContractFunctions);

  const visibleFunctionExists = Boolean(contract["visibleFunctions"]);

  let voteYes;
  let voteNo;
  if (contract.connect) {
    voteYes = contract.connect(signer)["voteYes"];
    voteNo = contract.connect(signer)["voteNo"];
  }

  console.log("visibleFunctionExists");
  console.log(visibleFunctionExists);

  useEffect(() => {
    async function getToken() {
      let fN = new Set();
      console.log("exISTS");
      const visibleFunctions = contract["visibleFunctions"];
      for (let i = 0; i < 99; i++) {
        console.log("LOOOOOP");
        try {
          let name = await visibleFunctions(i);
          console.log(name);
          console.log(i);
          if (!name) {
            break;
          }
          fN.add(name);
        } catch (err) {
          console.log(err);
          break;
        }
      }
      console.log("SETTING FNAMES");
      console.log(fN);
      setFNames(fN);
    }
    if (visibleFunctionExists) {
      getToken();
    }
  }, [visibleFunctionExists, contract]);

  useEffect(() => {
    async function getProposals() {
      const proposals = contract["proposals"];
      const proposalDisplay = await contract["proposalDisplay"];
      const npValueNum = await contract["proposalCount"]();
      let proposalObjects = [];
      for (let i = npValueNum - 1; i > -1; i--) {
        const p = await proposals(i);
        const ds = await proposalDisplay(i);
        const vals = parseDisplayString(ds);
        proposalObjects.push({ proposal: p, vals: vals, index: i });
      }
      console.log("proposals", proposalObjects);
      setProposals(proposalObjects);
    }
    if (visibleFunctionExists) {
      getProposals();
    }
  }, [visibleFunctionExists, contract]);

  console.log(fNames);

  if (fNames.size > 0) {
    displayedContractFunctions = displayedContractFunctions.filter(fn => fNames.has(fn.name));
  }

  return (
    <div>
      <div className="flex justify-end">
        <button
          className="rounded-md bg-gray-200 shadow-md p-4 outline-none focus:outline-none"
          onClick={() => setShowContract(!showContract)}
        >
          Show Contract Functions
        </button>
      </div>
      {showContract && (
        <ContractDisplay
          displayedContractFunctions={displayedContractFunctions}
          contract={contract}
          address={address}
          contractIsDeployed={contractIsDeployed}
          customContract={customContract}
          account={account}
          gasPrice={gasPrice}
          signer={signer}
          provider={provider}
          name={name}
          show={show}
          price={price}
          blockExplorer={blockExplorer}
        />
      )}
      <div>
        <div className="mx-4 text-xl">Proposals</div>
        <div>
          {proposals.map(proposal => (
            <Proposal
              proposer={proposal.proposal.proposer}
              target={proposal.proposal.target}
              yesPower={Number(proposal.proposal.yesVotes)}
              noPower={Number(proposal.proposal.noVotes)}
              i={proposal.index}
              voteYes={() => tx(voteYes(proposal.index))}
              voteNo={() => tx(voteNo(proposal.index))}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
