pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/math/SafeMath.sol";

contract AtomicSwap {

    using SafeMath for uint256;
    uint256 SafeTime = 3 hours; // atomic swap timeOut

    struct Swap {
        bytes32 secret;
        bytes32 secretHash;
        uint256 createdAt;
        uint256 balance;
    }

    // ETH Owner => BTC Owner => Swap
    mapping(address => mapping(address => mapping (bytes32 => Swap))) public swaps;
    /* mapping(address => mapping(address => [bytes32])) public swapHashes; */

    constructor () public {}

    function deposit (address recipient, bytes32 _secretHash) public payable {
        require(swaps[msg.sender][recipient][_secretHash].balance == 0);

        swaps[msg.sender][recipient][_secretHash] = Swap(
            bytes32(0),
            _secretHash,
            now,
            msg.value
        );

        /* swapHashes[msg.sender][recipient].push(_secretHash); */
    }

    function refund(address recipient, bytes32 _secret) public {
        bytes32 hash = sha256(abi.encodePacked(_secret));
        Swap memory swap = swaps[msg.sender][recipient][hash];

        require(swap.balance > 0);
        require(swap.createdAt.add(SafeTime) < now);

        msg.sender.transfer(swap.balance);
    }

    function getBalance (address creator, bytes32 hash) public view returns (uint256) {
        return swaps[creator][msg.sender][hash].balance;
    }

    /* function getHash (address creator) public view returns (bytes32) {
        return swaps[creator][msg.sender].secretHash;
    } */

    function withdraw (address creator, bytes32 _secret) public {
        bytes32 hash = sha256(abi.encodePacked(_secret));
        Swap memory swap = swaps[creator][msg.sender][hash];
        /* require(hash == swap.secretHash); */
        require(swap.balance > 0);
        require(swap.secret == bytes32(0));
        swap.secret = _secret;

        msg.sender.transfer(swap.balance);
    }
}
