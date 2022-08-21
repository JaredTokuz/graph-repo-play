import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { LogTrade } from "../../generated/SimpleBondingCurve/SimpleBondingCurve";
import { newMockEvent } from "matchstick-as/assembly/index";

const validateSide = (side: string): string => {
  if (!["burn", "mint"].includes(side)) {
    throw "bad";
  }
  return side;
};

export function createNewLogTradeEvent(
  side: string,
  weiAmt: BigInt,
  erc20Amount: BigInt
): LogTrade {
  let newLogTradeEvent = changetype<LogTrade>(newMockEvent());
  newLogTradeEvent.parameters = new Array();

  let sideParam = new ethereum.EventParam(
    "side",
    ethereum.Value.fromString(validateSide(side))
  );
  let weiAmtParam = new ethereum.EventParam(
    "weiAmt",
    ethereum.Value.fromUnsignedBigInt(weiAmt)
  );
  let erc20AmountParam = new ethereum.EventParam(
    "erc20Amount",
    ethereum.Value.fromUnsignedBigInt(erc20Amount)
  );

  newLogTradeEvent.parameters.push(sideParam);
  newLogTradeEvent.parameters.push(weiAmtParam);
  newLogTradeEvent.parameters.push(erc20AmountParam);

  return newLogTradeEvent;
}
