/* eslint-disable jsx-a11y/accessible-emoji */
/* eslint-disable jsx-a11y/anchor-is-valid */
import React, { useState, useEffect, useCallback } from "react";
import Blockies from "react-blockies";
import { Row, Col, Divider, Card, Button } from "antd";
import tryToDisplay from "./utils";

const Proposal = ({
  proposal,
  voteToBan,
  ban,
  userState,
  userAddress,
  hasUserVoted,
  triggerRefresh,
  refreshRequired,
}) => {
  const [banned, setBanned] = useState(false);
  const [voted, setVoted] = useState(true);

  const r = useCallback(async () => {
    console.log(userState);
    try {
      let us = Number(await userState(proposal.addr));
      console.log("HELLO US");
      console.log(us);
      if (us == 2) setBanned(true);

      let v = await hasUserVoted(userAddress, proposal.addr);
      console.log(v);
      setVoted(v);
    } catch (e) {
      console.log(e);
    }
  }, [userState, proposal]);

  useEffect(() => {
    r();
  }, [r, refreshRequired]);

  const vtb = () => {
    voteToBan(proposal.addr);
    triggerRefresh(false);
    triggerRefresh(true);
  };

  const b = () => {
    ban(proposal.addr);
    triggerRefresh(false);
    triggerRefresh(true);
  };

  if (!proposal) return null;

  const yes = Number(proposal.yesVotes);
  const total = Number(proposal.threshold);
  console.log(proposal.addr);

  const title = (
    <>
      <Blockies seed={proposal.addr.toLowerCase()} size={8} scale={4} />
      {proposal.addr.slice(0, 8)}
    </>
  );

  return (
    <Card title={title} style={{ width: 300, marginBottom: "30px" }}>
      <p>
        <span style={{ color: "green" }}>{yes}</span>/{total}
      </p>
      <p>
        {banned && (
          <Button type="primary" danger disabled>
            🔨Banned!
          </Button>
        )}
        {!banned && !voted && yes < total && (
          <Button type="primary" danger onClick={vtb}>
            🗳️Vote to Ban
          </Button>
        )}
        {!banned && voted && yes < total && (
          <Button type="primary" danger disabled>
            Already voted
          </Button>
        )}
        {!banned && yes >= total && (
          <Button type="primary" danger onClick={b}>
            🔨BAN🔨
          </Button>
        )}
      </p>
    </Card>
  );
};

const Proposals = ({
  numBanProposals,
  banProposalAddresses,
  banProposals,
  userState,
  hasUserVoted,
  userAddress,
  voteToBan,
  ban,
  triggerRefresh,
  refreshRequired,
}) => {
  const [proposals, setProposals] = useState([]);

  const refresh = useCallback(async () => {
    try {
      let num = Number(await numBanProposals());
      let p = [];
      for (var i = 0; i < num; i++) {
        let a = await banProposalAddresses(i);
        let bp = await banProposals(a);
        p.push({ bp });
      }
      console.log(p);
      setProposals(p);
    } catch (e) {
      console.log(e);
    }
  }, [triggerRefresh]);

  useEffect(() => {
    refresh();
  }, [refresh, refreshRequired]);

  return (
    <div style={{ display: "flex", flexFlow: "wrap", justifyContent: "space-around" }}>
      {proposals.map(p => (
        <Proposal
          proposal={p.bp}
          userState={userState}
          hasUserVoted={hasUserVoted}
          userAddress={userAddress}
          voteToBan={voteToBan}
          triggerRefresh={triggerRefresh}
          refreshRequired={refreshRequired}
          ban={ban}
        />
      ))}
    </div>
  );
};

export default Proposals;
