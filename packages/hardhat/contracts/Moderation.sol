pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Moderation {
    mapping(address => bool) public banned_users;

    modifier noBannedUsers(address user) {
        require(!banned_users[user]);
        _;
    }

    function ban(address user) private {
        banned_users[user] = true;
    }
}
