import {
  HttpClient,
  SimpleHttpClient,
  ThorClient,
  VeChainPrivateKeySigner,
  VeChainProvider,
} from "@vechain/sdk-network";
import { config } from "process";
import { cycle2earnAbi } from "./abis/cycle2earn";
import { Address, HDKey, Hex, Mnemonic } from "@vechain/sdk-core";
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
const privateKey = Mnemonic.toPrivateKey(
  mnemonic.split(" "),
  HDKey.VET_DERIVATION_PATH
);

console.log("mnemonic", mnemonic);

// Convert private key to hex (32 bytes = 64 hex characters)
const privateKeyHex = Buffer.from(privateKey)
  .toString("hex")
  .replace(/^0x/, "");
console.log("privateKey", privateKeyHex, "length:", privateKeyHex.length);

export const cycle2earnContract = thor.contracts.load(
  "0x90ae6877c3fd0124f10a4e41042a97a61e25b765",
  cycle2earnAbi,
  new VeChainPrivateKeySigner(
    Buffer.from(privateKey),
    new VeChainProvider(thor)
  )
);
