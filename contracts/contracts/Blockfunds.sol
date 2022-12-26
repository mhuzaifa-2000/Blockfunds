// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Blockfunds {
    // ************************ STATE VARIABLES ************************ //

    address owner;

    address contract_donors_address;
    address contract_causes_address;

    // ************************ FUNCTIONS ************************ //

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    function setContractDonors(address donors_addr) public {
        require(msg.sender == owner);
        contract_donors_address = donors_addr;
    }

    function setContractCauses(address causes_addr) public {
        require(msg.sender == owner);
        contract_causes_address = causes_addr;
    }

    function getContractDonors() public view returns (address) {
        return contract_donors_address;
    }

    function getContractCauses() public view returns (address) {
        return contract_causes_address;
    }
}
