# abimate

ABIs and Typescript types of your favorite smartcontracts.

## Description

I was a quite frustrated to always include a abi and type generation in each of my projects. Even for the most fundamental contracts like ERC721 and ERC20. It's just such bloat to setup even for a quick proof of concept project. Therefore I created this package to provide easy access to ABIs and types to popular smartcontract libraries.

The first contracts to include are from [solmate](https://github.com/Rari-Capital/solmate), which obviously also inspired the projects name.

This repository is setup as a monorepo using [nx](https://nx.dev/) and will probably contain more ABIs and types in the future. Feel free to open a pull request with your favorite smartcontract libraries.

Currently included is:

- [solmate](https://github.com/Rari-Capital/solmate) as [@abimate/solmate](https://www.npmjs.com/package/@abimate/solmate)

## Install

`npm install @abimate/solmate`

## Usage

Here is an example usage in a nextjs API handler.

```typescript
import { ERC721, ERC721ABI } from '@abimate/solmate';
import { ethers } from 'ethers';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  const provider = new ethers.providers.JsonRpcProvider(
    'https://eth-mainnet.alchemyapi.io/v2/MN7lukHGqJaLMNZWeQfhkexSKwssvNZq'
  );

  const collection = new ethers.Contract(
    '0x23581767a106ae21c074b2276d25e5c3e136a68b',
    ERC721ABI,
    provider
  ) as ERC721;
  console.log('hello');

  const name = await collection.callStatic.name();

  console.log({ name });
  res.status(200).json({ name });
};

export default handler;
```

## Building

Requirements:

+ `nx` - https://nx.dev/
+ `foundry` - https://getfoundry.sh/


Commands to run a build:

`npm install`

`nx build solmate`