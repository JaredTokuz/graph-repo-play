import { Address, BigInt, Bytes, ethereum } from "@graphprotocol/graph-ts";
import { LogTrade } from "../../generated/SimpleBondingCurve/SimpleBondingCurve";
import { newMockEvent, log, assert } from "matchstick-as/assembly/index";

const validateSide = (side: string): string => {
  if (!["burn", "mint"].includes(side)) {
    throw "bad";
  }
  return side;
};

export const updateLogTradeMetaData = (event: LogTrade, hash: string, nonce: i32, timestamp: i32, address: string): LogTrade => {
  event.transaction.hash = Bytes.fromUTF8(hash);
  event.transaction.nonce = BigInt.fromI32(nonce);
  event.block.timestamp = BigInt.fromI32(timestamp);
  event.transaction.from = Address.fromString(address);
  return event;
};

export function createNewLogTradeEvent(side: string, weiAmt: i32, erc20Amount: i32): LogTrade {
  const newLogTradeEvent: LogTrade = changetype<LogTrade>(newMockEvent());
  newLogTradeEvent.parameters = new Array();

  let sideParam = new ethereum.EventParam("side", ethereum.Value.fromString(validateSide(side)));
  let weiAmtParam = new ethereum.EventParam("weiAmt", ethereum.Value.fromI32(weiAmt));
  let erc20AmountParam = new ethereum.EventParam("erc20Amount", ethereum.Value.fromI32(erc20Amount));

  newLogTradeEvent.parameters.push(sideParam);
  newLogTradeEvent.parameters.push(weiAmtParam);
  newLogTradeEvent.parameters.push(erc20AmountParam);

  return newLogTradeEvent;
}
