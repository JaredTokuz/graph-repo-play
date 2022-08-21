import { BigInt } from "@graphprotocol/graph-ts";
import {
  describe,
  test,
  afterEach,
  clearStore,
  logStore,
} from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";
import { TokenTrade } from "../../generated/schema";
import { handleLogTrade, latestTokenStateEntity } from "../../src/mapping";
import { createNewLogTradeEvent } from "./utils";

describe("handleLogTrade()", () => {
  afterEach(() => {
    clearStore();
  });

  /** test the token trade entity */
  test("TokenTrade Entity handled with custom event", () => {
    const newEvent = createNewLogTradeEvent(
      "mint",
      new BigInt(100),
      new BigInt(9)
    );

    latestTokenStateEntity(newEvent);

    logStore();
  });
});
/** test the address profile entity */

/** test the latest token state entity */
