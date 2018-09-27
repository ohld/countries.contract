pragma solidity ^0.4.17;

contract SellLand {
  // 2 pi R^2
  // 
  address[16] public owners;

  // Buying a piece of land
  function adopt(uint squareId) public returns (uint) {
    require(squareId >= 0 && squareId <= 15);

    owners[squareId] = msg.sender;

    return squareId;
  }

  // Retrieving the adopters
  // Retrieving the owners
  function getOwners() public view returns (address[16]) {
    return owners;
  }
}
