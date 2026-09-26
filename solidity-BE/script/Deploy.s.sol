// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import {Script} from "forge-std/Script.sol";
import {Election} from "../src/Election.sol";

contract Deploy is Script {
    Election public election;

    function setUp() public {}

    function run() public {
        vm.startBroadcast();

        election = new Election();

        vm.stopBroadcast();
    }
}
