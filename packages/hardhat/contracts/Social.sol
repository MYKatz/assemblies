pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";

//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

contract Social {
    event AddPost(bytes32 head, uint256 num, string body);

    uint256 public numPosts = 0;
    uint256 public feedLength = 32;

    // Linked list nodes with string content
    struct Post {
        bytes32 next;
        string body;
    }

    bytes32 public head;
    mapping(bytes32 => Post) public posts;
    bytes32[] public feed;

    function addPost(string calldata body) external {
        Post memory post = Post(head, body);
        bytes32 id = keccak256(abi.encodePacked(post.body, numPosts));
        posts[id] = post;
        head = id;
        emit AddPost(head, numPosts, post.body);
        numPosts++;
        feed.push(id);
    }
}
