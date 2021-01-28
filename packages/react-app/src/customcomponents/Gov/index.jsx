import React, { useMemo, useState, useEffect } from "react";
import ContractDisplay from "./Contract";

import { useContractLoader, useContractExistsAtAddress } from "../../hooks";

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

  console.log(fNames);

  if (fNames.size > 0) {
    displayedContractFunctions = displayedContractFunctions.filter(fn => fNames.has(fn.name));
  }

  return (
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
  );
}
