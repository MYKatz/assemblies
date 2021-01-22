pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

contract Gov {
    using SafeMath for uint256;

    uint256 public numUsers = 0;
    uint256 public thresholdPct = 50;
    uint256 public numBanProposals = 0;

    mapping(address => uint8) public userState; // 0 = not registered, 1 = registered, 2 = banned
    mapping(address => BanProposal) public banProposals;
    address[] public banProposalAddresses;

    struct BanProposal {
        address addr;
        uint256 threshold;
        uint256 yesVotes;
        uint256 expires;
        mapping(address => bool) voted;
    }

    struct RemoveProposal {
        bytes32 post;
        uint256 threshold;
        uint256 numvotes;
    }

    struct WarningProposal {
        bytes32 post;
        uint256 threshold;
        uint256 numvotes;
    }

    modifier noBannedUsers(address user) {
        require(userState[user] != 2);
        _;
    }

    function register(address user) internal {
        if (userState[user] == 0) {
            numUsers = numUsers.add(1);
            userState[user] = 1; // registered
        }
    }

    function createBanProposal(address user) public {
        require(banProposals[user].addr == address(0));
        uint256 voteThreshold = thresholdPct.mul(numUsers).div(100); // number of users required
        BanProposal memory proposal = BanProposal(
            user,
            voteThreshold,
            0,
            now + 1 hours
        );
        banProposals[user] = proposal;
        numBanProposals++;
        banProposalAddresses.push(user);
    }

    function ban(address user) public {
        BanProposal memory proposal = banProposals[user];
        require(proposal.addr != address(0));
        require(now < proposal.expires);
        require(proposal.yesVotes >= proposal.threshold);
        userState[user] = 2; // banned
    }

    function voteToBan(address defendant) public {
        BanProposal storage proposal = banProposals[defendant];
        require(proposal.addr != address(0));
        require(proposal.voted[msg.sender] == false);
        proposal.voted[msg.sender] = true;
        proposal.yesVotes++;
    }

    function hasUserVoted(address user, address defendant)
        external
        view
        returns (bool)
    {
        return (banProposals[defendant].voted[user]);
    }
}
