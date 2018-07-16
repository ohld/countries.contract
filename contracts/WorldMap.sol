pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/ownership/Ownable.sol";
import "openzeppelin-solidity/contracts/math/SafeMath.sol";

import "./CountryToken.sol";

// inspired with: https://github.com/zeppelinos/basil/blob/master/contracts/BasilERC721.sol

contract WorldMap is Ownable {
    using SafeMath for uint256;

    bytes12 DEFAULT_COLOR = 0xffffff; // ????????
    string DEFAULT_TEXT = ""; // ?????????

    address TOKEN_ADDRESS = 0x17dA6A8B86578CEC4525945A355E8384025fa5Af;

    // ERC721 non-fungible tokens to be emitted on donations.
    CountryToken public map; // countries
    /* uint256 public numEmittedTokens; // will also use as next id for new country */

    constructor() public {
        map = CountryToken(TOKEN_ADDRESS);
    }

    function setToken(uint256 _id) external onlyOwner {
        map.createCountry(_id);
    }

    function buy(uint256 countryId) public payable {
        require(msg.value > map.getCountryLastPrice(countryId));

        _transferCountry(countryId, msg.sender);
    }

    function _transferCountry(uint256 countryId, address _newOwner) internal {
        /* address currOwner = map.ownerOf(countryId); */
        map.safeTransferFrom(_newOwner, map.ownerOf(countryId), countryId);
    }

    /* function createCountry(string name) external onlyOwner {
        // external or public?
        // token.mint(address(0), numEmittedTokens); // or which address use?
        // token._setCountryName(numEmittedTokens, name);
        // token._setCountryColor(DEFAULT_COLOR);
        // token._setCountryText(DEFAULT_TEXT);
        // numEmittedTokens = numEmittedTokens.add(1);
    } */
}
