# `@abimate`

ABIs and Typescript types of your favorite smartcontracts.

## Description

I was a quite frustrated to always include a abi and type generation in each of my projects. Even for the most fundamental contracts like ERC721 and ERC20. It's just such bloat to setup even for a quick proof of concept project. Therefore I created this package to provide easy access to ABIs and types to popular smartcontract libraries.

The first contracts to include are from [solmate](https://github.com/Rari-Capital/solmate), which obviously also inspired the projects name.

This repository is setup as a monorepo using [nx](https://nx.dev/) and will probably contain more ABIs and types in the future. Feel free to open a pull request with your favorite smartcontract libraries.

Currently included is:

- [solmate](https://github.com/Rari-Capital/solmate) as [@abimate/solmate](https://www.npmjs.com/package/@abimate/solmate)
- [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts) as [@abimate/openzeppelin](https://www.npmjs.com/package/@abimate/openzeppelin)

## Install

`npm install @abimate/solmate`

`npm install @abimate/openzeppelin`

## Usage

Here is an example usage of the ABI and ERC721 contract type.

```typescript
import { ERC721, ERC721ABI } from '@abimate/solmate';
import { ethers } from 'ethers';

const collection = new ethers.Contract(
    '0x23581767a106ae21c074b2276d25e5c3e136a68b',
    ERC721ABI,
    provider
  ) as ERC721;
const name = await collection.callStatic.name();
```

## Building

Requirements:

+ `nx` - https://nx.dev/
+ `foundry` - https://getfoundry.sh/


Commands to run a build:

`git clone git@github.com:peetzweg/abimate.git`

`cd abimate`

`git submodule update --init --recursive`

`npm install`

`nx build solmate`

## Acknowledgements

Code in this repository is directly referencing:

- [TypeChain](https://github.com/dethcrypto/TypeChain)
- [solmate](https://github.com/Rari-Capital/solmate)
- [OpenZeppelin](https://github.com/OpenZeppelin/openzeppelin-contracts)

## Licensing

Licensing of the original source code applies. See individual licenses in `/packages/{PACKAGE_NAME}/LICENSE`.