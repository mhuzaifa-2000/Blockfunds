// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Donors {
    // ************************ STRUCTURES ************************ //

    struct Donor {
        uint256 donor_id;
        address payable donor_address;
        string donor_name;
        uint256[] donated_to;
        mapping(uint256 => uint256) amount_donated; // Stores the amount of money that has been donated to each cause
        mapping(uint256 => bool) objections; // Stores whether an objection has been raised for each cause
    }

    // ************************ STATE VARIABLES ************************ //

    Donor[] private donors;
    uint256 private counter;

    address private owner;
    address private blockfunds_address;

    // ************************ UTILITIES ************************ //

    function getCounter() private returns (uint256) {
        counter++;
        return counter - 1;
    }

    function setBlockfundsAddress(address addr) public {
        require(msg.sender == owner);
        blockfunds_address = addr;
    }

    // ************************ FUNCTIONS ************************ //

    // Constructor
    constructor() {
        owner = msg.sender;
    }

    // Adds a new donor
    function addDonor(string memory donor_name) public {
        uint256 idx = donors.length;
        donors.push();
        Donor storage new_donor = donors[idx];

        new_donor.donor_id = getCounter();
        new_donor.donor_address = payable(msg.sender);
        new_donor.donor_name = donor_name;
    }

    // Returns a donor's ID
    function getDonorId() public view returns (int256) {
        for (uint256 i = 0; i < donors.length; i++) {
            if (donors[i].donor_address == msg.sender) {
                return int256(donors[i].donor_id);
            }
        }
        return -1;
    }

    // Returns a donor's name and donation data
    function getDonorData(uint256 donor_id)
        public
        view
        returns (
            string memory,
            uint256[] memory,
            uint256[] memory
        )
    {
        uint256[] memory amount_donated = new uint256[](
            donors[donor_id].donated_to.length
        );
        for (uint256 i = 0; i < donors[donor_id].donated_to.length; i++) {
            amount_donated[i] = donors[donor_id].amount_donated[
                donors[donor_id].donated_to[i]
            ];
        }

        return (
            donors[donor_id].donor_name,
            donors[donor_id].donated_to,
            amount_donated
        );
    }

    // Allows a donor to donate to the given cause
    function donate(uint256 donor_id, uint256 cause_id) public payable {
        // Ensure that the donation amount is positive
        require(msg.value > 0, "The donation amount is invalid.");
        require(
            donors[donor_id].amount_donated[cause_id] == 0,
            "You cannot donate more than once."
        );

        bool flag = false;

        // Check whether the donor has already donated to the cause before
        for (uint256 i = 0; i < donors[donor_id].donated_to.length; i++) {
            if (donors[donor_id].donated_to[i] == cause_id) {
                flag = true;
            }
        }

        if (!flag) {
            donors[donor_id].donated_to.push(cause_id);
        }

        // Add the amount
        donors[donor_id].amount_donated[cause_id] = (msg.value / 1 ether);

        // Send the amount to the 'causes' contract
        (bool success, bytes memory result) = blockfunds_address.call(
            abi.encodeWithSignature("getCausesAddress()")
        );
        require(success, "Blockfunds could not be invoked.");

        address causes_address = abi.decode(result, (address));

        (success, result) = causes_address.call{value: msg.value}(
            abi.encodeWithSignature("receiveDonation(uint256)", cause_id)
        );
        require(success, "The donation could not be sent.");
    }

    // Allows a donor to raise an objection for the given cause
    function raiseObbjection(uint256 donor_id, uint256 cause_id) public {
        require(
            donors[donor_id].amount_donated[cause_id] > 0,
            "You cannot raise an objection for a cause that you have not donated to."
        );

        require(
            !donors[donor_id].objections[cause_id],
            "You have already raised any objection for this cause."
        );

        donors[donor_id].objections[cause_id] = true;
    }

    // Returns the addresses of the donors for the given cause
    function getDonorAddresses(uint256 cause_id)
        public
        view
        returns (address[] memory)
    {
        // Create an array of appropriate size
        uint256 num_donors = getNumberOfDonors(cause_id);
        address[] memory donor_addresses = new address[](num_donors);

        // Copy the data of the donors into the array
        for (uint256 i = 0; i < donors.length; i++) {
            if (donors[i].amount_donated[cause_id] > 0) {
                donor_addresses[i] = donors[i].donor_address;
            }
        }

        return (donor_addresses);
    }

    function getDonorDonatedAmounts(uint256 cause_id)
        public
        view
        returns (uint256[] memory)
    {
        // Create an array of appropriate size
        uint256 num_donors = getNumberOfDonors(cause_id);
        uint256[] memory donor_donated_amounts = new uint256[](num_donors);

        // Copy the data of the donors into the array
        for (uint256 i = 0; i < donors.length; i++) {
            if (donors[i].amount_donated[cause_id] > 0) {
                donor_donated_amounts[i] = donors[i].amount_donated[cause_id];
            }
        }

        return (donor_donated_amounts);
    }

    // Returns the number of donors for the given cause
    function getNumberOfDonors(uint256 cause_id) public view returns (uint256) {
        uint256 num_donors;
        for (uint256 i = 0; i < donors.length; i++) {
            if (donors[i].amount_donated[cause_id] > 0) {
                num_donors++;
            }
        }

        return num_donors;
    }

    // Returns the number of objections for the given cause
    function getNumberOfObjections(uint256 cause_id)
        public
        view
        returns (uint256)
    {
        uint256 num_objections;
        for (uint256 i = 0; i < donors.length; i++) {
            if (donors[i].objections[cause_id] == true) {
                num_objections++;
            }
        }

        return num_objections;
    }

    // Forces the causes contract to refund the donors for the given cause
    function forceRefund(uint256 cause_id) public {
        (bool success, bytes memory result) = blockfunds_address.call(
            abi.encodeWithSignature("getCausesAddress()")
        );
        require(success, "Blockfunds could not be invoked.");
        address causes_address = abi.decode(result, (address));

        (success, result) = causes_address.call(
            abi.encodeWithSignature("withdrawDonations(uint256)", cause_id)
        );
        require(success, "The refund could not be processed.");
    }
}
