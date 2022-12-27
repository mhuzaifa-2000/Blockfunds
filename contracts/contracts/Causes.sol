// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Causes {
    // ************************ STRUCTURES ************************ //

    struct Cause {
        // Data about the cause itself
        uint256 cause_id;
        string cause_name;
        bool status;
        // Data about the activist
        address payable activist_address;
        string activist_name;
        // Data about the donations that are collected
        uint256 target_amount;
        uint256 collected_amount;
        uint256 donation_period;
    }

    // ************************ STATE VARIABLES ************************ //

    Cause[] private causes;
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

    function addCause(
        string memory cause_name,
        string memory activist_name,
        uint256 target_amount,
        uint256 time_threshold
    ) public {
        uint256 idx = causes.length;
        causes.push();
        Cause storage new_cause = causes[idx];

        new_cause.cause_id = getCounter();
        new_cause.cause_name = cause_name;
        new_cause.status = true;

        new_cause.activist_address = payable(msg.sender);
        new_cause.activist_name = activist_name;

        new_cause.target_amount = target_amount;

        new_cause.donation_period = block.number + time_threshold;
    }

    function getCauses()
        public
        view
        returns (
            uint256[] memory,
            string[] memory,
            uint256[] memory,
            uint256[] memory
        )
    {
        // Count the number of active causes
        uint256 num_active_causes;
        for (uint256 i = 0; i < causes.length; i++) {
            if (causes[i].status == true) {
                num_active_causes++;
            }
        }

        // Add the data for the causes in the respective arrays
        uint256[] memory cause_ids = new uint256[](num_active_causes);
        string[] memory cause_names = new string[](num_active_causes);
        uint256[] memory cause_collected_amounts = new uint256[](
            num_active_causes
        );
        uint256[] memory cause_target_amounts = new uint256[](
            num_active_causes
        );

        uint256 array_counter;
        for (uint256 i = 0; i < causes.length; i++) {
            if (causes[i].status == true) {
                cause_ids[array_counter] = causes[i].cause_id;
                cause_names[array_counter] = causes[i].cause_name;
                cause_collected_amounts[array_counter] = causes[i]
                    .collected_amount;
                cause_target_amounts[array_counter] = causes[i].target_amount;
            }
        }

        return (
            cause_ids,
            cause_names,
            cause_collected_amounts,
            cause_target_amounts
        );
    }

    function receiveDonation(uint256 cause_id) public payable {
        causes[cause_id].collected_amount += (msg.value / 1 ether);
    }

    function withdrawDonations(uint256 cause_id) public {
        // The cause must currently be active
        require(causes[cause_id].status == true, "This cause is not active.");

        // Check whether more than 2/3 objections have been raised
        (bool success, bytes memory result) = blockfunds_address.call(
            abi.encodeWithSignature("getDonorsAddress()")
        );

        address donors_address = abi.decode(result, (address));

        // Get the number of donors
        (success, result) = donors_address.call(
            abi.encodeWithSignature("getNumberOfDonors(uint256)", cause_id)
        );

        uint256 num_donors = abi.decode(result, (uint256));
        uint256 two_thirds = (num_donors * 2) / 3;

        // Get the number of objections
        (success, result) = donors_address.call(
            abi.encodeWithSignature("getNumberOfObjections(uint256)", cause_id)
        );

        uint256 num_objections = abi.decode(result, (uint256));

        // Refund the donations if more than 2/3 objections have been raised
        if (num_objections > two_thirds) {
            address[] memory donor_addresses;
            uint256[] memory donor_donated_amounts;

            // Get the amount that has to be refunded to each donor
            (success, result) = donors_address.call(
                abi.encodeWithSignature("getDonorAddresses(uint256)", cause_id)
            );
            donor_addresses = abi.decode(result, (address[]));

            (success, result) = donors_address.call(
                abi.encodeWithSignature(
                    "getDonorDonatedAmounts(uint256)",
                    cause_id
                )
            );
            donor_donated_amounts = abi.decode(result, (uint256[]));

            // Transfer the refund
            for (uint256 i = 0; i < num_donors; i++) {
                address payable payable_donor_address = payable(
                    donor_addresses[i]
                );
                payable_donor_address.transfer(
                    donor_donated_amounts[i] * 1 ether
                );
            }

            // Reset the data for the cause
            causes[cause_id].status = false;
            causes[cause_id].collected_amount = 0;
        } else {
            require(
                block.number > causes[cause_id].donation_period,
                "The donations cannot be withdrawn until the donation period ends."
            );

            // Transfer the donations to the activist's address
            causes[cause_id].activist_address.transfer(
                causes[cause_id].collected_amount * 1 ether
            );

            // Reset the data for the cause
            causes[cause_id].status = false;
            causes[cause_id].collected_amount = 0;
        }
    }
}
