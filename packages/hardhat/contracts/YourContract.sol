pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";

//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract YourContract {
    struct Member {
        address wallet;
        uint8 mood;
    }

    Member[] public members;
    uint8 public averageMood;
    uint256 public gracePeriod = now + 20 seconds;

    constructor() public {
        members.push(
            Member({
                wallet: 0x662dbDA1Bed1A861A599085FAE14CaCF03197f4e,
                mood: 128
            })
        );
    }

    function graceLeft() public view returns (uint256) {
        if (now > gracePeriod) return 0;
        return gracePeriod - now;
    }

    function setMood(uint8 newMood) public {
        for (uint256 i = 0; i < members.length; i++) {
            if (members[i].wallet == msg.sender) {
                members[i].mood = newMood;
                return;
            }
        }
        revert("Member not found!");
    }

    function addMember(uint8 initialMood) public {
        members.push(Member({wallet: msg.sender, mood: initialMood}));
    }

    function setAverageMood() public {
        require(now > gracePeriod, "Still in grace period");
        uint256 total;
        for (uint256 i = 0; i < members.length; i++) {
            total += members[i].mood;
        }
        averageMood = uint8(total / members.length);
        gracePeriod = now + 20 seconds;
    }

    //receive() external payable {
    //    deposit();
    //}
}
