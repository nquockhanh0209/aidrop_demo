// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// Import this file to use console.log
import "hardhat/console.sol";
import "./IERC20.sol";
import "./SafeERC20.sol";

contract Airdrop {
    using SafeERC20 for IERC20;
    mapping(address => mapping(address => uint256)) approval;
    mapping(address => uint256) private nonces;

    address public tokenAddress;
    address payable private backend;
    string public name;
    string public symbol;
    uint8 public decimal;
    bytes32 public immutable DOMAIN_SEPARATOR;

    modifier OnlyOwner() {
        require(msg.sender == backend);
        _;
    }

    constructor(
        string memory _name,
        string memory _symbol,
        uint8 _decimals,
        address _tokenAddress,
        address _owner
    ) payable {
        name = _name;
        symbol = _symbol;
        decimal = _decimals;
        tokenAddress = _tokenAddress;
        backend = payable(_owner);
        uint256 chainId;
        assembly {
            chainId := chainid()
        }
        DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes(name)),
                keccak256(bytes("1")),
                chainId,
                address(this)
            )
        );
    }

    function permit(
        address owner,
        address spender,
        uint256 value,
        uint256 deadline,
        uint256 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) public returns (bool) {
        bytes32 hashStruct = keccak256(
            abi.encode(
                keccak256(
                    "Permit(address owner,address spender,uint256 value,uint256 deadline,uint256 nonce)"
                ),
                owner,
                spender,
                value,
                deadline,
                nonce
            )
        );

        bytes32 EIP721hash = keccak256(
            abi.encodePacked("\x19\x01", DOMAIN_SEPARATOR, hashStruct)
        );
        require(owner != address(0), "invalid owner");
        require(owner == ecrecover(EIP721hash, v, r, s), "invalid owner");
        require(deadline == 0 || deadline >= block.timestamp, "permit expired");
        require(nonce == nonces[owner]++, "Invalid nonce");

        return true;
    }

    function withdrawWrapper(
        address to,
        uint256 amount,
        uint256 deadline,
        uint256 nonce,
        uint8 v,
        bytes32 r,
        bytes32 s
    ) external {
        //permit(msg.sender, address(this), deadline, isPermitted, v, r, s);
        require(
            permit(to, msg.sender, amount, deadline, nonce, v, r, s),
            "not permitted"
        );

        IERC20(tokenAddress).transferFrom(backend, to, amount);
    }
}
