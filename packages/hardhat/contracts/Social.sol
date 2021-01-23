pragma solidity >=0.6.0 <0.7.0;

import "hardhat/console.sol";

//import "@openzeppelin/contracts/access/Ownable.sol"; //https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol

interface GovContract {
    function onPost(
        address sender,
        bytes32 parent,
        uint256 postType,
        bytes calldata data
    ) external;

    function onDelete(
        address sender,
        bytes32 id,
        address author,
        uint256 postType,
        bytes calldata data
    ) external;

    function onChangeGovContract(address sender, address newGovContract)
        external;
}

contract Social {
    uint256 public numPosts = 0; // used as nonce - tracks number of posts (incl. comments)
    GovContract public govContract; // governance logic

    bytes32 public head; // latest post
    mapping(bytes32 => Post) public posts;
    mapping(address => bytes32[]) public userPosts;

    constructor(address gov) public {
        govContract = GovContract(gov);
    }

    enum PostType {RawBytes, String, IPFS, DELETED}

    struct Post {
        address author;
        bytes32 next;
        bytes32 prev;
        bytes32 parent;
        bytes32 children;
        PostType postType;
        bytes data;
    }

    modifier postExists(bytes32 postId) {
        require(posts[postId].author != address(0));
        _;
    }

    function addPost(
        bytes32 parent,
        uint256 postType,
        bytes calldata body
    ) external {
        govContract.onPost(msg.sender, parent, uint256(postType), body);
        bytes32 id = keccak256(abi.encodePacked(body, numPosts));
        require(posts[id].author == address(0), "Hash collision");
        Post memory post;
        if (parent == "") {
            // top-level post
            post = Post(
                msg.sender,
                head,
                "",
                parent,
                "",
                PostType(postType),
                body
            );
            posts[head].prev = id;
            head = id;
        } else {
            // child post
            Post memory parentPost = posts[parent];
            post = Post(
                msg.sender,
                parentPost.children,
                "",
                parent,
                "",
                PostType(postType),
                body
            );
            posts[parentPost.children].prev = id;
            parentPost.children = id;
        }
        posts[id] = post;
        userPosts[msg.sender].push(id);
        numPosts++;
    }

    function deletePost(bytes32 postId) external postExists(postId) {
        Post memory p = posts[postId];
        govContract.onDelete(
            msg.sender,
            postId,
            p.author,
            uint256(p.postType),
            p.data
        );
        // Don't actually delete node, just mark as deleted and remove data
        posts[postId].data = "";
        posts[postId].postType = PostType.DELETED;
    }

    function changeGovContract(address newGov) external {
        govContract.onChangeGovContract(msg.sender, newGov);
        govContract = GovContract(newGov);
    }
}
