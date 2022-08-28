import { Address } from "@graphprotocol/graph-ts";
import { describe, test, afterEach, clearStore, logStore, assert } from "matchstick-as/assembly/index";
import { log } from "matchstick-as/assembly/log";
import { handleLogTrade, latestTokenStateAndAddressProfileEntity } from "../../src/mapping";
import { createNewLogTradeEvent, updateLogTradeMetaData } from "./utils";

const ADDRESS_PROFILE_ENTITY_TYPE = "AddressProfile";

/** TODO run code coverage check */

describe("Address Profile Entity genereates correctly", () => {
  afterEach(() => {
    clearStore();
  });

  test("Address Profiles are calculated correctly with the same address", () => {
    const _address = "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A".toLowerCase();

    const newEvent = updateLogTradeMetaData(createNewLogTradeEvent("mint", 100, 9), "0xfirst0", 1, 123, _address);

    const anotherEvent = updateLogTradeMetaData(createNewLogTradeEvent("burn", 50, 5), "0xsecond", 2, 456, _address);

    const anotherMintEvent = updateLogTradeMetaData(createNewLogTradeEvent("mint", 150, 19), "0xthird0", 3, 789, _address);

    const anotherBurnEvent = updateLogTradeMetaData(createNewLogTradeEvent("burn", 70, 7), "0xsecond", 4, 1012, _address);

    latestTokenStateAndAddressProfileEntity(newEvent);
    assert.entityCount(ADDRESS_PROFILE_ENTITY_TYPE, 1);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "address", _address);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "erc20Purchased", "9");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "erc20Sold", "0");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiSpent", "100");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiReceived", "0");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiNetRealized", "0");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "noTrades", "1");

    latestTokenStateAndAddressProfileEntity(anotherEvent);
    assert.entityCount(ADDRESS_PROFILE_ENTITY_TYPE, 1);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "address", _address);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "erc20Purchased", "9");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "erc20Sold", "5");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiSpent", "100");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiReceived", "50");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiNetRealized", "-5");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "noTrades", "2");

    latestTokenStateAndAddressProfileEntity(anotherMintEvent);
    assert.entityCount(ADDRESS_PROFILE_ENTITY_TYPE, 1);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "address", _address);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "erc20Purchased", "28");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "erc20Sold", "5");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiSpent", "250");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiReceived", "50");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiNetRealized", "-5");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "noTrades", "3");

    latestTokenStateAndAddressProfileEntity(anotherBurnEvent);
    assert.entityCount(ADDRESS_PROFILE_ENTITY_TYPE, 1);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "address", _address);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "erc20Purchased", "28");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "erc20Sold", "12");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiSpent", "250");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiReceived", "120");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiNetRealized", "24");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "noTrades", "4");
  });

  test("Address Profiles different addresses calculated correctly", () => {
    const _address = "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A".toLowerCase();
    const _anotherAddress = "0xA16081F360e3847006dB660bae1c6d1b2e17eC4A".toLowerCase();

    const newEvent = updateLogTradeMetaData(createNewLogTradeEvent("mint", 100, 9), "0xfirst0", 1, 123, _address);

    const anotherEvent = updateLogTradeMetaData(createNewLogTradeEvent("burn", 50, 5), "0xsecond", 2, 456, _address);

    const anotherMintEvent = updateLogTradeMetaData(createNewLogTradeEvent("mint", 150, 19), "0xthird0", 3, 789, _anotherAddress);

    const anotherBurnEvent = updateLogTradeMetaData(createNewLogTradeEvent("burn", 70, 7), "0xsecond", 4, 1012, _anotherAddress);

    latestTokenStateAndAddressProfileEntity(newEvent);
    assert.entityCount(ADDRESS_PROFILE_ENTITY_TYPE, 1);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "address", _address);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "erc20Purchased", "9");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "erc20Sold", "0");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiSpent", "100");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiReceived", "0");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiNetRealized", "0");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "noTrades", "1");

    latestTokenStateAndAddressProfileEntity(anotherEvent);

    assert.entityCount(ADDRESS_PROFILE_ENTITY_TYPE, 1);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "address", _address);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "erc20Purchased", "9");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "erc20Sold", "5");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiSpent", "100");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiReceived", "50");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiNetRealized", "-5");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "noTrades", "2");

    latestTokenStateAndAddressProfileEntity(anotherMintEvent);
    assert.entityCount(ADDRESS_PROFILE_ENTITY_TYPE, 2);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _anotherAddress, "address", _anotherAddress);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _anotherAddress, "erc20Purchased", "19");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _anotherAddress, "erc20Sold", "0");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _anotherAddress, "weiSpent", "150");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _anotherAddress, "weiReceived", "0");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _anotherAddress, "weiNetRealized", "0");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _anotherAddress, "noTrades", "1");

    latestTokenStateAndAddressProfileEntity(anotherBurnEvent);
    assert.entityCount(ADDRESS_PROFILE_ENTITY_TYPE, 2);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _anotherAddress, "address", _anotherAddress);
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _anotherAddress, "erc20Purchased", "19");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _anotherAddress, "erc20Sold", "7");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _anotherAddress, "weiSpent", "150");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _anotherAddress, "weiReceived", "70");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _anotherAddress, "weiNetRealized", "21");
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _anotherAddress, "noTrades", "2");
  });

  test("Address wei net realized can return negative numbers", () => {
    const _address = "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A".toLowerCase();

    const newEvent = updateLogTradeMetaData(createNewLogTradeEvent("mint", 100, 9), "0xfirst0", 1, 123, _address);

    const anotherEvent = updateLogTradeMetaData(createNewLogTradeEvent("burn", 50, 5), "0xsecond", 2, 456, _address);

    latestTokenStateAndAddressProfileEntity(newEvent);
    latestTokenStateAndAddressProfileEntity(anotherEvent);
    assert.entityCount(ADDRESS_PROFILE_ENTITY_TYPE, 1);
    logStore();
    assert.fieldEquals(ADDRESS_PROFILE_ENTITY_TYPE, _address, "weiNetRealized", "-5");
  });
});
