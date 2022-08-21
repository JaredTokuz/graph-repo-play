import { LogTrade } from "../generated/SimpleBondingCurve/SimpleBondingCurve";
import {
  TokenTrade,
  AddressProfile,
  LatestTokenState,
} from "../generated/schema";
import { log, BigInt, ethereum, Bytes } from "@graphprotocol/graph-ts";

export function handleLogTrade(event: LogTrade): void {
  /** latest state needs go first to check for new addresses */
  latestTokenStateEntity(event);
  /** token trade is immutable */
  tokenTradeEntity(event);
  /** */
  addressProfileEntity(event);
}

/**
 * creates the token trades entities for both events
 * @param event
 * @param tradeType
 */
function tokenTradeEntity(event: LogTrade): void {
  const tokenTrade = new TokenTrade(event.transaction.hash);
  tokenTrade.nonce = event.transaction.nonce;
  tokenTrade.erc20Amount = event.params.erc20Amt;
  tokenTrade.ethAmount = event.params.weiAmt;
  tokenTrade.tradeType = event.params.side;
  tokenTrade.timestamp = event.block.timestamp;
  tokenTrade.address = event.transaction.from.toHexString();
  tokenTrade.save();
}

function addressProfileEntity(event: LogTrade): void {
  const id = event.transaction.from;
  let profile = AddressProfile.load(id);
  if (profile == null) {
    profile = new AddressProfile(id);
  }
  if (event.params.side == "mint") {
    profile.erc20Purchased = profile.erc20Purchased.plus(event.params.erc20Amt);
    profile.weiSpent = profile.weiSpent.plus(event.params.weiAmt);
  } else if (event.params.side == "burn") {
    profile.erc20Sold = profile.erc20Sold.plus(event.params.erc20Amt);
    profile.weiSold = profile.weiSold.plus(event.params.weiAmt);
    profile.weiNetRealized = profile.weiSold.minus(profile.weiSpent);
  }
  profile.noTrades = profile.noTrades.plus(new BigInt(1));
  profile.save();
}

export function latestTokenStateEntity(event: LogTrade): void {
  const id = "latest";
  let state = LatestTokenState.load(id);
  log.info("hello? = {}", [state == null ? "asdf" : "b", "asdfasd"]);
  if (state == null) {
    log.info("hello null = {}", [state == null ? "asdf" : "b"]);
    state = new LatestTokenState(id);
    state.price = new BigInt(1);
    log.info("hello null = {}", [state == null ? "asdf" : "b"]);
  }
  log.info("hello ok = {}", [state.id]);

  state.last_timestamp = event.block.timestamp;
  state.last_nonce = event.transaction.nonce;

  if (event.params.side == "mint") {
    state.price = state.price.plus(event.params.erc20Amt);
    state.weiSpent = state.weiSpent.plus(event.params.weiAmt);
  } else if (event.params.side == "burn") {
    state.price = state.price.minus(event.params.erc20Amt);
    state.weiWithdrawn = state.weiWithdrawn.plus(event.params.weiAmt);
  }

  /** check this before the address profile entity is created */
  const profile = AddressProfile.load(event.transaction.from);
  if (profile == null) {
    state.noAddress = state.noAddress.plus(new BigInt(1));
  }

  state.noTrades = state.noTrades.plus(new BigInt(1));

  state.save();
}

const logThings = (event: ethereum.Event): void => {
  log.info("mint dude = {} hexstring = {} string = {} from = {} hash = {}", [
    event.transaction.nonce.toHex(),
    event.transaction.nonce.toHexString(),
    event.transaction.nonce.toString(),
    event.transaction.from.toHex(),
    event.transaction.hash.toHex(),
  ]);
};
