pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./GovContract.sol";

/**
  (Semi-) liquid democracy (ish)
  - Users can delegate voting power to another
 */
contract Liquid is GovContract {
    using Strings for uint256;

    uint256 public creationTime;
    mapping(address => uint256) public power;
    mapping(address => bool) public banned;

    struct User {
        address addr;
        address delegatee;
        mapping(uint256 => bool) voted;
    }

    mapping(address => User) public users;

    string[] public visibleFunctions = [
        "createBanProposal",
        "banUser",
        "proposals",
        "power",
        "delegate"
    ];

    constructor() public {
        creationTime = now;
    }

    function onPost(
        address sender,
        bytes32 parent,
        uint256 postType,
        bytes calldata data
    ) external override {
        require(banned[sender] == false);
        if (users[sender].addr == address(0)) {
            users[sender] = User(sender, sender);
            power[sender] = 1;
        }
    }

    function onDelete(
        address sender,
        bytes32 id,
        address author,
        uint256 postType,
        bytes calldata data
    ) external override {
        // Can't delete posts
        require(false);
    }

    function onChangeGovContract(address sender, address newGovContract)
        external
        override
    {
        // Can't change gov contract
        require(false);
    }

    function bytesToBytes32(bytes memory b, uint256 offset)
        private
        pure
        returns (bytes32)
    {
        bytes32 out;

        for (uint256 i = 0; i < 32; i++) {
            out |= bytes32(b[offset + i] & 0xFF) >> (i * 8);
        }
        return out;
    }

    function createBanProposal(address user) external {
        Proposal memory proposal = Proposal(
            msg.sender,
            user,
            0, // type == 0
            0,
            0,
            now + 1 minutes,
            false,
            ""
        );

        proposals.push(proposal);
    }

    function delegate(address representative) external {
        power[users[msg.sender].delegatee] -= 1;
        power[representative] += 1;
        users[msg.sender].delegatee = representative;
    }

    function voteYes(uint256 proposal) external override {
        require(users[msg.sender].voted[proposal] == false);
        require(proposals[proposal].expiry >= now);
        proposals[proposal].yesVotes += power[msg.sender];
        users[msg.sender].voted[proposal] = true;
    }

    function voteNo(uint256 proposal) external override {
        require(users[msg.sender].voted[proposal] == false);
        require(proposals[proposal].expiry >= now);
        proposals[proposal].noVotes += power[msg.sender];
        users[msg.sender].voted[proposal] = true;
    }

    function banUser(uint256 proposal) external {
        require(
            proposals[proposal].expiry != 0 && proposals[proposal].expiry < now
        );
        banned[proposals[proposal].target] = true;
    }
}
