pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./GovContract.sol";

/**
  "Plutocracy" contract
  - "Voting power" equal to how many units of 0.00001 ethereum a user has sent
 */
contract Plutocracy is GovContract {
    using Strings for uint256;

    uint256 public creationTime;
    mapping(address => uint256) public power;
    mapping(address => bool) public banned;

    struct User {
        address addr;
        mapping(uint256 => bool) voted;
    }

    mapping(address => User) public users;

    string[] public visibleFunctions = [
        "createBanProposal",
        "banUser",
        "proposals",
        "buyPower"
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
        users[sender] = User(sender);
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

    function buyPower() external payable {
        power[msg.sender] += msg.value / 10000000000000;
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
