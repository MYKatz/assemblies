Apologies for the messy code, I was on a deadline! :) Improvements coming soon

# Assemblies

Assemblies are decentralized, self-governing communities on Ethereum. One of the key values of this project is
flexibility: community "founders" are free to dictate initial governance structure, with anything from a "dictatorship"
(complete control by one person) to one-person-one-vote democracy to completely random decision-making being possible. Some additional
possibilities include:

-   Voting power allocated based on ETH balance or ownership of some token
-   Proposal adjudication based on a randomly selected subset of users ("jury system")
-   Quadratic voting with auto-generating "vote credits"
-   Liquid democracy: users can delegate voting power to other users

## Smart contracts

All contracts can be found [here](https://github.com/MYKatz/assemblies/tree/master/packages/hardhat/contracts).

The `Social` contract defines a set of standard social features and accepts a governance contract as a constructor argument.

The `GovContract` is an abstract contract that all governance contracts implement. Governance contracts handle both governance proposals and user permissions.

See these contracts for example implementations:

-   `Dictatorship.sol`: only the contract publisher and those he pre-approves may post
-   `Gerontocracy.sol`: any non-banned user may post; voting power for ban proposals is allocated based on account age.
-   `Plutocracy.sol`: voting power can be bought with ETH
-   `Liquid.sol`: liquid democracy; voting power can be delegated to a different user

## Try it out

Plutocracy: https://assembly-plutocracy.netlify.app
Liquid: https://assembly-liquid.netlify.app/gov
Gerontocracy: https://assembly-ger.netlify.app/gov

All of these demos use the Kovan testnet.

Apologies for the somewhat unintuitive UI. Demo video coming soon.

## Future work

-   Deploy on a sidechain for scalability
-   Create a social "factory contract" and intuitive UI for people to launch their own communities
-   Discoverability
-   UX improvements
