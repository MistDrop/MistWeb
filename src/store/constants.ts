// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt

// Wallet Manager
// ---
export const AUTH_MASTER_PASSWORD = "AUTH_MASTER_PASSWORD";
export const SET_MASTER_PASSWORD = "SET_MASTER_PASSWORD";

// Wallets
// ---
export const LOAD_WALLETS = "LOAD_WALLETS";
export const ADD_WALLET = "ADD_WALLET";
export const REMOVE_WALLET = "REMOVE_WALLET";
export const UPDATE_WALLET = "UPDATE_WALLET";
export const SYNC_WALLET = "SYNC_WALLET";
export const SYNC_WALLETS = "SYNC_WALLETS";
export const UNSYNC_WALLET = "UNSYNC_WALLET";
export const RECALCULATE_WALLETS = "RECALCULATE_WALLETS";
export const SET_LAST_TX_FROM = "SET_LAST_TX_FROM";

// Contacts
// ---
export const LOAD_CONTACTS = "LOAD_CONTACTS";
export const ADD_CONTACT = "ADD_CONTACT";
export const REMOVE_CONTACT = "REMOVE_CONTACT";
export const UPDATE_CONTACT = "UPDATE_CONTACT";

// Settings
// ---
export const SET_BOOLEAN_SETTING = "SET_BOOLEAN_SETTING";
export const SET_INTEGER_SETTING = "SET_INTEGER_SETTING";
export const SET_IMPORTED_LANG = "SET_IMPORTED_LANG";

// Websockets
// ---
export const CONNECTION_STATE = "CONNECTION_STATE";
export const INIT_SUBSCRIPTION = "INIT_SUBSCRIPTION";
export const UPDATE_SUBSCRIPTION = "UPDATE_SUBSCRIPTION";
export const REMOVE_SUBSCRIPTION = "REMOVE_SUBSCRIPTION";

// Node state (auto-refreshing)
// ---
export const LAST_BLOCK_ID = "LAST_BLOCK_ID";
export const LAST_NON_MINED_TRANSACTION_ID = "LAST_NON_MINED_TRANSACTION_ID";
export const LAST_TRANSACTION_ID = "LAST_TRANSACTION_ID";
export const LAST_OWN_TRANSACTION_ID = "LAST_OWN_TRANSACTION_ID";
export const LAST_NAME_TRANSACTION_ID = "LAST_NAME_TRANSACTION_ID";
export const LAST_OWN_NAME_TRANSACTION_ID = "LAST_OWN_NAME_TRANSACTION_ID";

// Node state (MOTD)
// ---
export const SYNC_NODE = "SYNC_NODE";
export const DETAILED_WORK = "DETAILED_WORK";
export const PACKAGE = "PACKAGE";
export const CURRENCY = "CURRENCY";
export const CONSTANTS = "CONSTANTS";
export const MOTD = "MOTD";

// Miscellaneous
// ---
export const INCR_NAME_TABLE_LOCK = "INCR_NAME_TABLE_LOCK";
export const DECR_NAME_TABLE_LOCK = "DECR_NAME_TABLE_LOCK";
export const SET_TIP = "SET_TIP";
