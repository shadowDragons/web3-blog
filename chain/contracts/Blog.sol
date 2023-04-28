// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Blog {
    enum Status { active, del }

    uint256 incrID = 0;

    struct BlogItem {
        address owner;
        string ipfsHash;
        Status status;
    }

    mapping(uint256 => BlogItem) private blogList;
    mapping(address => uint256[]) private blogIDList;

    event Add(address sender, uint256 id);
    event Save(address sender, uint256 id);
    event Del(address sender, uint256 id, Status status);

    function add(string memory _ipfsHash) public {
        incrID ++;
        blogList[incrID] = BlogItem(msg.sender, _ipfsHash, Status.active);
        blogIDList[msg.sender].push(incrID);
        emit Add(msg.sender, incrID);
    }

    function save(uint256 _id, string memory _ipfsHash) public {
        require(blogList[_id].owner == msg.sender, "Data does not exist");
        require(blogList[_id].status == Status.active, "Data does not exist");
        blogList[_id].ipfsHash = _ipfsHash;
        emit Save(msg.sender, _id);
    }

    function del(uint256 _id) public {
        require(blogList[_id].owner == msg.sender, "Data does not exist");
        require(blogList[_id].status == Status.active, "Data does not exist");
        blogList[_id].status = Status.del;
        emit Del(msg.sender, _id, blogList[_id].status);
    }

    function get(uint256 _id) public view returns(string memory ipfsHash) {
        require(blogList[_id].owner == msg.sender, "Data does not exist");
        require(blogList[_id].status == Status.active, "Data does not exist");
        return blogList[_id].ipfsHash;
    }

    function list(uint256 _page, uint256 _pageSize) public view returns(uint256[] memory ids, string[] memory ipfsHashs, Status[] memory status) {
        uint256 count = blogIDList[msg.sender].length;

        ids = new uint[](count);
        ipfsHashs = new string[](count);
        status = new Status[](count);

        uint256 realCount = 0;
        uint256 j = 0;

        uint256 minFilterCount = (_page - 1) * _pageSize;
        uint256 maxFilterCount = _page * _pageSize - 1;

        uint256 filterCount = 0;
        for (uint256 i = 0; i < count; i++) {
            uint256 id = blogIDList[msg.sender][i];

            if (blogList[id].status == Status.del) {
                continue;
            }

            filterCount ++;
            if (filterCount < minFilterCount || filterCount > maxFilterCount) {
                continue;
            }

            ids[j] = id;
            ipfsHashs[j] = blogList[id].ipfsHash;
            status[j] = blogList[id].status;
            realCount ++;
            j ++;
        }

        if (realCount == 0) {
            ids = new uint[](1);
            ipfsHashs = new string[](1);
            status = new Status[](1);
            return (ids, ipfsHashs, status);
        }

        assembly {mstore(ids, realCount)}
        assembly {mstore(ipfsHashs, realCount)}
        assembly {mstore(status, realCount)}
        return (ids, ipfsHashs, status);
    }

    function getCount() public view returns(uint256) {
        return blogIDList[msg.sender].length;   
    }
}