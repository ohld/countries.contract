pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";

contract CountryToken is ERC721Token {

  struct Country {
    uint256 countryId;
    uint256 createdAt;
    uint256 lastPrice;
  }

  mapping (uint256 => Country) map;

  constructor (string _name, string _symbol) public
    ERC721Token(_name, _symbol) {
  }

  function createCountry(uint256 _id) external {
    //require(dont exist);
    // better mint to nobody owning

    _mint(msg.sender, _id);

    map[_id] = Country(
      _id,
      now,
      uint256(0)
    );
  }

  function getCountryLastPrice(uint256 countryId) public view returns (uint256 price) {
    // require(exists);
    return map[countryId].lastPrice;
  }



}
