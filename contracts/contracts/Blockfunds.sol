// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Blockfunds {
    // ************************ STATE VARIABLES ************************ //

    address private owner;

    address private donors_address;
    address private causes_address;

    // ************************ FUNCTIONS ************************ //

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    function setDonorsAddress(address donors_addr) public {
        require(msg.sender == owner);
        donors_address = donors_addr;
    }

    function setCausesAddress(address causes_addr) public {
        require(msg.sender == owner);
        causes_address = causes_addr;
    }

    function getDonorsAddress() public view returns (address) {
        return donors_address;
    }

    function getCausesAddress() public view returns (address) {
        return causes_address;
    }
}
