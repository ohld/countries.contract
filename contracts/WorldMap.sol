pragma solidity ^0.4.24;

import "openzeppelin-zos/contracts/ownership/Ownable.sol";
import "openzeppelin-zos/contracts/math/SafeMath.sol";

import ".CountryToken.sol"

// inspired with: https://github.com/zeppelinos/basil/blob/master/contracts/BasilERC721.sol

contract WorldMap is Ownable {
    using SafeMath for uint256;

    uint8 DEFAULT_COLOR = 0; // ????????
    string DEFAULT_TEXT = ""; // ?????????

    // ERC721 non-fungible tokens to be emitted on donations.
    ERC721Token public token; // countries
    uint256 public numEmittedTokens; // will also use as next id for new country

    function setToken(ERC721Token _token) external onlyOwner {
        // initial thing to set token (see link above)
        // I don't know the best practices now, this function may be changed
        require(_token != address(0));
        require(token == address(0));
        token = _token;
    }

    function buy(uint256 countryId) public payable {
        // check msg.value > countryId.price
        _transferCountry(countryId, msg.sender);
    }

    function _transferCountry(uint256 countryId, address _newOwner) internal {
        // token.transfer(countryId, _newOwner);
    }

    function createCountry(string name) external onlyOwner { // external or public?
        // token.mint(address(0), numEmittedTokens); // or which address use?
        // token._setCountryName(numEmittedTokens, name);
        // token._setCountryColor(DEFAULT_COLOR);
        // token._setCountryText(DEFAULT_TEXT);
        // numEmittedTokens = numEmittedTokens.add(1);
    }
}