pragma solidity >=0.6.0 <0.7.0;

contract Social is SimpleMajority {
    // blah blah blah
}

contract social {
    constructor(address gov) public {
        govContract = GovContract(gov); // simple majority contract
    }
}
