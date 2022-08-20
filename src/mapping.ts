import {
  LogMint,
  LogWithdraw,
} from "../generated/SimpleBondingCurve/SimpleBondingCurve";
import {
  TokenTrade,
  AddressProfile,
  LatestTokenState,
} from "../generated/schema";
import { log, BigInt } from "@graphprotocol/graph-ts";

export function handleMintEvent(event: LogMint): void {
  // log.info("mint dude = {} hexstring = {} string = {} from = {} hash = {}", [
  //   event.transaction.nonce.toHex(),
  //   event.transaction.nonce.toHexString(),
  //   event.transaction.nonce.toString(),
  //   event.transaction.from.toHex(),
  //   event.transaction.hash.toHex(),
  // ]);
  handleEntities(event);
}

export function handleWithdrawEvent(event: LogWithdraw): void {
  // log.info("withdraw dude", []);
  handleEntities(event);
}

const handleEntities = (event: LogMint | LogWithdraw) => {
  /** latest state needs go first to check for new addresses */
  latestTokenStateEntity(event);
  tokenTradeEntity(event);
  addressProfileEntity(event);
};

/**
 * creates the token trades entities for both events
 * @param event
 * @param tradeType
 */
function tokenTradeEntity(event: LogMint | LogWithdraw) {
  const tokenTrade = new TokenTrade(event.transaction.hash);
  tokenTrade.nonce = event.transaction.nonce;
  if (event instanceof LogMint) {
    tokenTrade.er20Amount = event.params.amountMinted;
    tokenTrade.ethAmount = event.params.totalCost;
    tokenTrade.tradeType = "Mint";
  } else {
    tokenTrade.er20Amount = event.params.amountWithdrawn;
    tokenTrade.ethAmount = event.params.reward;
    tokenTrade.tradeType = "Burn";
  }
  tokenTrade.timestamp = event.block.timestamp;
  tokenTrade.address = event.transaction.from.toHexString();
  tokenTrade.save();
}

function addressProfileEntity(event: LogMint | LogWithdraw) {
  const id = event.transaction.from;
  let profile = AddressProfile.load(id);
  if (profile == null) {
    profile = new AddressProfile(id);
  }
  if (event instanceof LogMint) {
    profile.erc20Purchased = profile.erc20Purchased.plus(
      event.params.amountMinted
    );
    profile.weiSpent = profile.weiSpent.plus(event.params.totalCost);
  } else {
    profile.erc20Sold = profile.erc20Sold.plus(event.params.amountWithdrawn);
    profile.weiSold = profile.weiSold.plus(event.params.reward);
    profile.weiNetRealized = profile.weiSold.minus(profile.weiSpent);
  }
  profile.noTrades = profile.noTrades.plus(new BigInt(1));
  profile.save();
}

function latestTokenStateEntity(event: LogMint | LogWithdraw) {
  const id = "latest";
  let state = LatestTokenState.load(id);
  if (state == null) {
    state = new LatestTokenState(id);
    state.price = new BigInt(1);
  }

  state.last_timestamp = event.block.timestamp;
  state.last_nonce = event.transaction.nonce;

  if (event instanceof LogMint) {
    state.price = state.price.plus(event.params.amountMinted);
    state.weiSpent = state.weiSpent.plus(event.params.totalCost);
  } else {
    state.price = state.price.minus(event.params.amountWithdrawn);
    state.weiWithdrawn = state.weiWithdrawn.plus(event.params.reward);
  }

  /** check this before the address profile entity is created */
  const profile = AddressProfile.load(event.transaction.from);
  if (profile == null) {
    state.noAddress = state.noAddress.plus(new BigInt(1));
  }

  state.noTrades = state.noTrades.plus(new BigInt(1));

  state.save();
}
