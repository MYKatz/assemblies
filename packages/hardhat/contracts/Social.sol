pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";
import "./Gov.sol";

//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Social is Gov {
    event AddPost(bytes32 head, uint256 num, string body);

    uint256 public numPosts = 0;

    // Linked list nodes with string content
    struct Post {
        address sender;
        bytes32 next;
        bytes32 prev;
        string body;
        bool disputed;
    }

    bytes32 public head;
    mapping(bytes32 => Post) public posts;
    bytes32[] public feed;

    function addPost(string calldata body) external noBannedUsers(msg.sender) {
        register(msg.sender);
        Post memory post = Post(msg.sender, head, "", body, false);
        bytes32 id = keccak256(abi.encodePacked(post.body, numPosts));
        posts[head].prev = id;
        posts[id] = post;
        head = id;
        emit AddPost(head, numPosts, post.body);
        numPosts++;
        feed.push(id);
    }
}
