pragma solidity >=0.6.0 <0.7.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./GovContract.sol";

/**
  Dictatorship contract
  - No users (except the 'dictator') are allowed to post unless allowed to
 */
contract Dictatorship is GovContract {
    address public dictator;

    mapping(address => bool) public allowed; // allowed posters

    string[] public visibleFunctions = ["allowed", "setAllowed"];

    constructor(string memory aCID, address owner) public {
        abiCID = aCID;
        dictator = owner;
        allowed[owner] = true;
    }

    function onPost(
        address sender,
        bytes32 parent,
        uint256 postType,
        bytes calldata data
    ) external override {
        require(allowed[sender] == true);
    }

    function onDelete(
        address sender,
        bytes32 id,
        address author,
        uint256 postType,
        bytes calldata data
    ) external override {
        require(sender == dictator);
    }

    function onChangeGovContract(address sender, address newGovContract)
        external
        override
    {
        require(sender == dictator);
    }

    function setAllowed(address user, bool canPost) external {
        require(msg.sender == dictator);
        allowed[user] = canPost;
    }
}
