import {
  HttpClient,
  SimpleHttpClient,
  ThorClient,
  VeChainPrivateKeySigner,
  VeChainProvider,
} from "@vechain/sdk-network";
import { config } from "process";
import { cycle2earnAbi } from "./abis/cycle2earn";
import { HDKey } from "@vechain/sdk-core";
// import { EcoEarnABI } from '@utils/const';
// import { ECO_SOL_ABI, config } from '@repo/config-contract';

export const thor = new ThorClient(
  new SimpleHttpClient("https://testnet.vechain.org/"),
  {
    isPollingEnabled: false,
  }
);

// get private key from mnemonic
const mnemonic = process.env.MNEMONIC!;
const privateKey = HDKey.fromMnemonic(mnemonic.split(" "), "m/44'/818'/0'/0/0");

export const cycle2earnContract = thor.contracts.load(
  "0x90ae6877c3fd0124f10a4e41042a97a61e25b765",
  cycle2earnAbi,
  new VeChainPrivateKeySigner(
    Buffer.from(privateKey.privateKey!),
    new VeChainProvider(thor)
  )
);
