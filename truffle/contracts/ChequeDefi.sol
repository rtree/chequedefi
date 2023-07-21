/* SPDX-License-Identifier: MIT */
pragma solidity >=0.4.22 <0.9.0;

contract ChequeDefi {
    mapping(bytes32 => uint256) public balances;

    function deposit(bytes32 hash) public payable {
        balances[hash] += msg.value;
    }

    function redeem(bytes32 hash, string memory secret) public {
        require(requestIsValid(hash, secret), "Invalid request");

        uint256 amount = balances[hash];
        require(amount > 0, "No funds associated with this hash");
        
        balances[hash] = 0;
        payable(msg.sender).transfer(amount);
    }

    function requestIsValid(bytes32 hash, string memory secret) internal pure returns(bool) {
        return keccak256(abi.encodePacked(secret)) == hash;
    }
}