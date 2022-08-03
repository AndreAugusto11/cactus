
When running the test file `reproduce-error.test.ts` with the following smart contract, the test passes:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CBDCcontract is ERC20, Ownable {

    constructor() ERC20("CentralBankDigitalCurrency", "CBDC") {
    }

    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
}
```

When I add another function and run the same test file, the test fails:
This is the final smart contract that we want to deploy!!

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CBDCcontract is ERC20, Ownable {

    constructor() ERC20("CentralBankDigitalCurrency", "CBDC") {
    }

    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
    
    function mint(address account, uint256 amount) external onlyOwner {
        _mint(account, amount);
    }
}
```

If I replace the function by another one it also fails:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CBDCcontract is ERC20, Ownable {

    constructor() ERC20("CentralBankDigitalCurrency", "CBDC") {
    }

    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
    
    function hello() external view onlyOwner returns (string memory) {
        return 'hello world';
    }
}
```

I removed the `onlyOwner` modifier but it also fails:

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract CBDCcontract is ERC20, Ownable {

    constructor() ERC20("CentralBankDigitalCurrency", "CBDC") {
    }

    function burn(address account, uint256 amount) external onlyOwner {
        _burn(account, amount);
    }
    
    function hello() public pure returns (string memory) {
        return 'hello world';
    }
}
```

On the other hand, if I completely remove the Ownable import and the `onlyOwner` modifier, it is successful.

```
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract CBDCcontract is ERC20 {

    constructor() ERC20("CentralBankDigitalCurrency", "CBDC") {
    }

    function burn(address account, uint256 amount) external {
        _burn(account, amount);
    }

    function mint(address account, uint256 amount) external {
        _mint(account, amount);
    }
}
```

When failing this is the error message:

```
   Transaction has been reverted by the EVM:
    {
      "blockHash": "0x272822252d4c540935ed8724af0f07e4f69f782a1c926c71539d72922ccd36ed",
      "blockNumber": 4,
      "contractAddress": "0xF12b5dd4EAD5F743C6BaA640B0216200e89B60Da",
      "cumulativeGasUsed": 1000000,
      "from": "0x627306090abab3a6e1400e9345bc60c78a8bef57",
      "gasUsed": 1000000,
      "logs": [],
      "logsBloom": "0x00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000",
      "status": false,
      "to": null,
      "transactionHash": "0xccee13d8aba0e516e283ccdda5a58f2db7bcd55d9f63552d76477000ddd852af",
      "transactionIndex": 0
    }

      at Object.TransactionError (node_modules/web3-core-helpers/lib/errors.js:87:21)
      at Object.TransactionRevertedWithoutReasonError (node_modules/web3-core-helpers/lib/errors.js:98:21)
      at node_modules/web3-core-method/lib/index.js:393:57
```