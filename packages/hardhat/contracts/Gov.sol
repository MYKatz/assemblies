pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";

contract Gov {
    mapping(address => bool) public banned_users;

    modifier noBannedUsers(address user) {
        require(!banned_users[user]);
        _;
    }

    function ban(address user) internal {
        banned_users[user] = true;
    }
}
