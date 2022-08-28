import { describe, test, afterEach, clearStore, logStore, assert } from "matchstick-as/assembly/index";
import { handleLogTrade, tokenTradeEntity } from "../../src/mapping";
import { createNewLogTradeEvent, updateLogTradeMetaData } from "./utils";

const TOKEN_TRADE_ENTITY_TYPE = "TokenTrade";

/** TODO run code coverage check */

describe("Token Trade Entity generates correctly", () => {
  afterEach(() => {
    clearStore();
  });

  /** TODO test token trade entity all fields */
  test("Mints trades are correct", () => {
    const _address = "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A".toLowerCase();
    const transactionString = "0xfirst0";
    const transactionHash = "0x3078666972737430";

    const newEvent = updateLogTradeMetaData(createNewLogTradeEvent("mint", 100, 9), transactionString, 1, 123, _address);

    handleLogTrade(newEvent);
    assert.entityCount(TOKEN_TRADE_ENTITY_TYPE, 1);
    assert.fieldEquals(TOKEN_TRADE_ENTITY_TYPE, transactionHash, "block", "1");
    assert.fieldEquals(TOKEN_TRADE_ENTITY_TYPE, transactionHash, "erc20Amount", "9");
    assert.fieldEquals(TOKEN_TRADE_ENTITY_TYPE, transactionHash, "ethAmount", "100");
    assert.fieldEquals(TOKEN_TRADE_ENTITY_TYPE, transactionHash, "tradeType", "mint");
    assert.fieldEquals(TOKEN_TRADE_ENTITY_TYPE, transactionHash, "timestamp", "123");
    assert.fieldEquals(TOKEN_TRADE_ENTITY_TYPE, transactionHash, "address", _address);
  });

  test("Burn trades are correct", () => {
    const _address = "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A".toLowerCase();
    const transactionString = "0xfirst0";
    const transactionHash = "0x3078666972737430";
    const newEvent = updateLogTradeMetaData(createNewLogTradeEvent("burn", 100, 9), transactionString, 1, 123, _address);

    tokenTradeEntity(newEvent);
    assert.entityCount(TOKEN_TRADE_ENTITY_TYPE, 1);
    assert.fieldEquals(TOKEN_TRADE_ENTITY_TYPE, transactionHash, "block", "1");
    assert.fieldEquals(TOKEN_TRADE_ENTITY_TYPE, transactionHash, "erc20Amount", "9");
    assert.fieldEquals(TOKEN_TRADE_ENTITY_TYPE, transactionHash, "ethAmount", "100");
    assert.fieldEquals(TOKEN_TRADE_ENTITY_TYPE, transactionHash, "tradeType", "burn");
    assert.fieldEquals(TOKEN_TRADE_ENTITY_TYPE, transactionHash, "timestamp", "123");
    assert.fieldEquals(TOKEN_TRADE_ENTITY_TYPE, transactionHash, "address", _address);
  });

  test("Token Trade events always make a new entity", () => {
    const _address = "0xA16081F360e3847006dB660bae1c6d1b2e17eC2A".toLowerCase();
    const transactionHash = "0xfirst0";
    const newEvent = updateLogTradeMetaData(createNewLogTradeEvent("mint", 100, 9), transactionHash, 1, 123, _address);

    handleLogTrade(newEvent);
    assert.entityCount(TOKEN_TRADE_ENTITY_TYPE, 1);

    const anotherTransactionHash = "0xsecond0";
    const anotherNewEvent = updateLogTradeMetaData(createNewLogTradeEvent("burn", 100, 9), anotherTransactionHash, 1, 123, _address);

    handleLogTrade(anotherNewEvent);
    assert.entityCount(TOKEN_TRADE_ENTITY_TYPE, 2);
  });
});
/** test the address profile entity */

/** test the latest token state entity */
