import { describe, test, afterEach, clearStore, logStore, assert } from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";
import { handleLogTrade, latestTokenStateAndAddressProfileEntity } from "../../src/mapping";
import { createNewLogTradeEvent, updateLogTradeMetaData } from "./utils";

const LATEST_TOKEN_STATE_ENTITY_TYPE = "LatestTokenState";
const ADDRESS_PROFILE_ENTITY_TYPE = "AddressProfile";

/** TODO run code coverage check */

describe("Lates Token State Entity", () => {
  afterEach(() => {
    clearStore();
  });

  /** test the latest token state entity */
  test("LatestTokenState Entity handled with custom event", () => {
    const newEvent = updateLogTradeMetaData(createNewLogTradeEvent("mint", 100, 9), "0xfirst0", 1, 123, "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A");

    const anotherEvent = updateLogTradeMetaData(createNewLogTradeEvent("burn", 50, 5), "0xsecond", 2, 456, "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A");

    // handle first event
    latestTokenStateAndAddressProfileEntity(newEvent);
    assert.entityCount(LATEST_TOKEN_STATE_ENTITY_TYPE, 1);
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "lastTimestamp", "123");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "lastBlock", "1");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "price", "10");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "weiSpent", "100");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "weiWithdrawn", "0");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "noAddress", "1");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "noTrades", "1");

    /** handle next event */
    latestTokenStateAndAddressProfileEntity(anotherEvent);
    assert.entityCount(LATEST_TOKEN_STATE_ENTITY_TYPE, 1);
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "lastTimestamp", "456");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "lastBlock", "2");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "price", "5");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "weiSpent", "100");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "weiWithdrawn", "50");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "noAddress", "1");
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "noTrades", "2");
  });

  test("Latest Token State calculates total addresses with the same address correctly", () => {
    const newEvent = updateLogTradeMetaData(createNewLogTradeEvent("mint", 100, 9), "0xfirst0", 1, 123, "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A");

    const anotherEvent = updateLogTradeMetaData(createNewLogTradeEvent("burn", 50, 5), "0xsecond", 2, 456, "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A");

    latestTokenStateAndAddressProfileEntity(newEvent);
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "noAddress", "1");
    latestTokenStateAndAddressProfileEntity(anotherEvent);
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "noAddress", "1");
  });

  test("Latest Token State calculates total addresses with different addresses correctly", () => {
    const newEvent = updateLogTradeMetaData(createNewLogTradeEvent("mint", 100, 9), "0xfirst0", 1, 123, "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A");

    const anotherEvent = updateLogTradeMetaData(createNewLogTradeEvent("mint", 50, 5), "0xsecond", 2, 456, "0xA16081F360e3847006dB660bae1c6d1b2e17eB3A");

    latestTokenStateAndAddressProfileEntity(newEvent);
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "noAddress", "1");
    latestTokenStateAndAddressProfileEntity(anotherEvent);
    assert.fieldEquals(LATEST_TOKEN_STATE_ENTITY_TYPE, "latest", "noAddress", "2");
  });
});
