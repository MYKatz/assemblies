import React, { useMemo, useState, useEffect } from "react";
import ContractDisplay from "./Contract";

import { useContractLoader, useContractExistsAtAddress } from "../../hooks";

const parseDisplayString = displayString => {
  let pairs = displayString.split(";");
  let out = [];
  for (let i = 0; i < pairs.length; i++) {
    const p = pairs[i].split(":");
    out.push(p);
  }
  return out;
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
      const numProposals = await contract["proposalCount"]();
      const npValueNum = Number(numProposals.value);
      let proposalObjects = [];
      for (let i = npValueNum - 1; i > -1; i--) {
        const p = await proposals(i);
        const ds = await proposalDisplay(i);
        const vals = parseDisplayString(ds);
        proposalObjects.push({ proposal: p, vals: vals });
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
      </div>
    </div>
  );
}
