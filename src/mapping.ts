import {
  LogMint,
  LogWithdraw,
} from "../generated/SimpleBondingCurve/SimpleBondingCurve";
import { TokenTrade } from "../generated/schema";
import { log } from "@graphprotocol/graph-ts";

export function handleMintEvent(event: LogMint): void {
  // log.info("mint dude = {} hexstring = {} string = {} from = {} hash = {}", [
  //   event.transaction.nonce.toHex(),
  //   event.transaction.nonce.toHexString(),
  //   event.transaction.nonce.toString(),
  //   event.transaction.from.toHex(),
  //   event.transaction.hash.toHex(),
  // ]);
  const tokenTrade = new TokenTrade(event.transaction.hash);
  tokenTrade.nonce = event.transaction.nonce;
  tokenTrade.er20Amount = event.params.amountMinted;
  tokenTrade.ethAmount = event.params.totalCost;
  tokenTrade.timestamp = event.block.timestamp;
  tokenTrade.tradeType = "Mint";
  tokenTrade.address = event.transaction.from.toHexString();
  tokenTrade.save();
}

export function handleWithdrawEvent(event: LogWithdraw): void {
  // log.info("withdraw dude", []);
  const tokenTrade = new TokenTrade(event.transaction.hash);
  tokenTrade.nonce = event.transaction.nonce;
  tokenTrade.er20Amount = event.params.amountWithdrawn;
  tokenTrade.ethAmount = event.params.reward;
  tokenTrade.timestamp = event.block.timestamp;
  tokenTrade.tradeType = "Burn";
  tokenTrade.address = event.transaction.from.toHexString();
  tokenTrade.save();
}
