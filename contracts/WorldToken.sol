pragma solidity ^0.4.24;

import "openzeppelin-solidity/contracts/token/ERC721/ERC721Token.sol";
import "openzeppelin-solidity/contracts/ownership/Ownable.sol";

contract WorldToken is ERC721Token, Ownable {

    bytes3 DEFAULT_COLOR = 0xffffff; // ????????
    string DEFAULT_TEXT = ""; // ?????????

    struct Country {
        string _name;
        uint256 _createdAt;

        uint256 lastPrice;

        bytes3 color;
        string text;
    }

    mapping (uint256 => Country) map;

    constructor () public ERC721Token("WorldToken", "WORLD") {}

    function mintTo(address _to, string _tokenURI, string _countryName) public onlyOwner {
        uint256 newTokenId = _getNextTokenId();
        _mint(_to, newTokenId);
        _setTokenURI(newTokenId, _tokenURI);

        map[newTokenId] = Country(
            _countryName, // ?
            now,
            uint256(0),
            DEFAULT_COLOR,
            DEFAULT_TEXT
        );
    }

    function withdraw() public onlyOwner {
        msg.sender.transfer(address(this).balance);
    }

    /**
    * @dev calculates the next token ID based on totalSupply
    * @return uint256 for the next token ID
    */
    function _getNextTokenId() private view returns (uint256) {
        return totalSupply().add(1);
    }

    /**
    * @dev Sets token metadata URI.
    * @param _tokenId token ID
    * @param _tokenURI token URI for the token
    */
    function setTokenURI(
        uint256 _tokenId, string _tokenURI
    ) public onlyOwner {
        _setTokenURI(_tokenId, _tokenURI);
    }

    function getCountryLastPrice(uint256 _countryId) public view
      returns (uint256 price) {
        require(exists(_countryId));
        return map[_countryId].lastPrice;
    }

    function getCountry(uint256 _countryId) public view
      returns (string name, bytes3 color, string text) {
        require(exists(_countryId));
        return (
          map[_countryId]._name,
          map[_countryId].color,
          map[_countryId].text
        );
    }


    function buy(uint256 _countryId) public payable {
        require(msg.value > getCountryLastPrice(_countryId));

        /* require(exists(_countryId)); */
        /* ownerOf already checks existense */

        address _from = ownerOf(_countryId);
        address _to = msg.sender;

        // hack
        operatorApprovals[_from][_to] = true;

        safeTransferFrom(_from, _to, _countryId);

        map[_countryId].lastPrice = msg.value;
    }

    function customize(uint256 _countryId, bytes3 color, string text) public onlyOwnerOf(_countryId) {
        map[_countryId].color = color;
        map[_countryId].text = text;
    }


}
