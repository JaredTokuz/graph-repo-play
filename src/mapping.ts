import { LogTrade } from "../generated/SimpleBondingCurve/SimpleBondingCurve";
import { TokenTrade, AddressProfile, LatestTokenState } from "../generated/schema";
import { log, BigInt, ethereum, Bytes } from "@graphprotocol/graph-ts";

export function handleLogTrade(event: LogTrade): void {
  /** latest state handles new addresses since it is dependant */
  latestTokenStateAndAddressProfileEntity(event);
  /** token trade is immutable */
  tokenTradeEntity(event);
}

/**
 * creates the token trades entities for both events
 * @param event
 * @param tradeType
 */
export function tokenTradeEntity(event: LogTrade): void {
  const tokenTrade = new TokenTrade(event.transaction.hash);
  tokenTrade.block = event.block.number;
  tokenTrade.erc20Amount = event.params.erc20Amt;
  tokenTrade.ethAmount = event.params.weiAmt;
  tokenTrade.tradeType = event.params.side;
  tokenTrade.timestamp = event.block.timestamp;
  tokenTrade.address = event.transaction.from.toHexString();
  tokenTrade.save();
}

/**
 * handles the latest token state and address profile entity since they are dependant
 * @param event
 */
export function latestTokenStateAndAddressProfileEntity(event: LogTrade): void {
  function latestTokenStateEntity(event: LogTrade): void {
    const id = "latest";
    let state = LatestTokenState.load(id);
    if (state == null) {
      state = new LatestTokenState(id);
      state.price = BigInt.fromString("1");
      state.weiSpent = BigInt.fromString("0");
      state.weiWithdrawn = BigInt.fromString("0");
      state.noAddress = BigInt.fromString("0");
      state.noTrades = BigInt.fromString("0");
    }

    state.lastTimestamp = event.block.timestamp;
    state.lastBlock = event.block.number;

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
      state.noAddress = state.noAddress.plus(BigInt.fromString("1"));
    }

    state.noTrades = state.noTrades.plus(BigInt.fromString("1"));

    state.save();
  }

  latestTokenStateEntity(event);

  function addressProfileEntity(event: LogTrade): void {
    const id = event.transaction.from;
    let profile = AddressProfile.load(id);
    if (profile == null) {
      profile = new AddressProfile(id);
      profile.address = event.transaction.from.toHexString();
      profile.erc20Purchased = BigInt.fromI32(0);
      profile.erc20Sold = BigInt.fromI32(0);
      profile.weiSpent = BigInt.fromI32(0);
      profile.weiReceived = BigInt.fromI32(0);
      profile.weiNetRealized = BigInt.fromI32(0);
      profile.noTrades = BigInt.fromI32(0);
    }
    if (event.params.side == "mint") {
      profile.erc20Purchased = profile.erc20Purchased.plus(event.params.erc20Amt);
      profile.weiSpent = profile.weiSpent.plus(event.params.weiAmt);
    } else if (event.params.side == "burn") {
      profile.erc20Sold = profile.erc20Sold.plus(event.params.erc20Amt);
      profile.weiReceived = profile.weiReceived.plus(event.params.weiAmt);
      /**
       * avg wei per erc20 purchased = weispent / erc20purchased
       * sold - (avg purchased * sold total)
       * queries by block could be nice to go back in time
       */
      const avgPurch = profile.weiSpent.div(profile.erc20Purchased);
      profile.weiNetRealized = profile.weiReceived.minus(avgPurch.times(profile.erc20Sold));
      // log.info("avg Purch {} {}", [profile.weiReceived.minus(avgPurch.times(profile.erc20Sold)).toString(), profile.weiNetRealized.toString()]);
    }
    profile.noTrades = profile.noTrades.plus(BigInt.fromI32(1));
    profile.save();
  }
  addressProfileEntity(event);
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
