import { BigInt } from "@graphprotocol/graph-ts";
import {
  describe,
  test,
  afterEach,
  clearStore,
  logStore,
  assert,
} from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";
import { TokenTrade } from "../../generated/schema";
import { handleLogTrade, latestTokenStateEntity } from "../../src/mapping";
import { createNewLogTradeEvent, updateLogTradeMetaData } from "./utils";

const LATEST_TOKEN_STATE_ENTITY_TYPE = "LatestTokenState";

describe("handleLogTrade()", () => {
  afterEach(() => {
    clearStore();
  });

  /** test the latest token state entity */
  test("LatestTokenState Entity handled with custom event", () => {
    const newEvent = updateLogTradeMetaData(
      createNewLogTradeEvent("mint", 100, 9),
      "0xfirst0",
      "1",
      "123",
      "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A"
    );

    const anotherEvent = updateLogTradeMetaData(
      createNewLogTradeEvent("burn", 50, 5),
      "0xsecond",
      "2",
      "456",
      "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A"
    );

    // TODO finish testing all the fields
    latestTokenStateEntity(newEvent);
    assert.entityCount(LATEST_TOKEN_STATE_ENTITY_TYPE, 1);
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "price", "10");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "price", "10");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "price", "10");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "price", "10");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "price", "10");

    latestTokenStateEntity(anotherEvent);
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "price", "5");
    logStore();
  });

  /** TODO test handler LogTrade so that new addresses are calculated in latest token state correctly */

  /** TODO test address profile entity all fields */

  /** TODO test token trade entity all fields */
});
/** test the address profile entity */

/** test the latest token state entity */
