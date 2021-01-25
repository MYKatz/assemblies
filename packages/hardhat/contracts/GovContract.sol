pragma solidity >=0.6.0 <0.7.0;

/**
    Abstract Governance Contract
    Govs implement this
 */
abstract contract GovContract {
    string public abiCID; // IPFS CID to contract ABI

    Proposal[] public proposals;

    struct Proposal {
        address proposer;
        bytes32 target; // address OR post (or something else?)
        uint256 proposalType; // implementation dependent
        uint256 yesVotes;
        uint256 noVotes;
        bool didPass;
        bytes data; // arbitrary data
    }

    function proposalCount() external returns (uint256) {
        return proposals.length;
    }

    // These functions should be implemented in subcontract

    function onPost(
        address sender,
        bytes32 parent,
        uint256 postType,
        bytes calldata data
    ) external virtual;

    function onDelete(
        address sender,
        bytes32 id,
        address author,
        uint256 postType,
        bytes calldata data
    ) external virtual;

    function onChangeGovContract(address sender, address newGovContract)
        external
        virtual;

    // Functions below here will likely be overridden
    // No check for voter fraud in these implementations!
    function voteYes(uint256 proposal) external {
        proposals[proposal].yesVotes++;
    }

    function voteNo(uint256 proposal) external {
        proposals[proposal].noVotes++;
    }

    // Display arbitrary values in proposal body
    // Format: [key1]:[val1];[key2]:[val2]; ...
    function proposalDisplay() external view returns (string memory) {
        return "";
    }
}