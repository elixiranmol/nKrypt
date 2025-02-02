// SPDX-License-Identifier: MIT
pragma solidity 0.8.19;

contract SimpleStorage {
    struct Access {
        address user;
        bool access;
    }

    mapping(address => string[]) private files;
    mapping(address => mapping(address => bool)) private ownership;
    mapping(address => Access[]) private accessList;
    mapping(address => mapping(address => bool)) private previousAccess;
    mapping(string => address) private fileOwners; 

    function add(address _user , string memory url) external {
        files[msg.sender].push(url);
        fileOwners[url] = msg.sender; 
    }

    function allow(address user) external {
        ownership[msg.sender][user] = true;
        if (previousAccess[msg.sender][user]) {
            for (uint i = 0; i < accessList[msg.sender].length; i++) {
                if (accessList[msg.sender][i].user == user) {
                    accessList[msg.sender][i].access = true;
                }
            }
        } else {
            accessList[msg.sender].push(Access(user, true));
            previousAccess[msg.sender][user] = true;
        }
    }

    function disallow(address user) external {
        ownership[msg.sender][user] = false;
        for (uint i = 0; i < accessList[msg.sender].length; i++) {
            if (accessList[msg.sender][i].user == user) {
                accessList[msg.sender][i].access = false;
            }
        }
    }

    function display(address _user) external view returns (string[] memory) {
        require(_user == msg.sender || ownership[_user][msg.sender], "No access");
        return files[_user];
    }

    function shareAccess() public view returns (Access[] memory) {
        return accessList[msg.sender];
    }

    function transferOwnership(string memory url, address newOwner) external {
        require(fileOwners[url] == msg.sender, "Not the owner"); 
        fileOwners[url] = newOwner;
        
        
        string[] storage ownerFiles = files[msg.sender];
        for (uint i = 0; i < ownerFiles.length; i++) {
            if (keccak256(bytes(ownerFiles[i])) == keccak256(bytes(url))) {
                ownerFiles[i] = ownerFiles[ownerFiles.length - 1];
                ownerFiles.pop();
                break;
            }
        }
        
        
        files[newOwner].push(url);
    }
}
