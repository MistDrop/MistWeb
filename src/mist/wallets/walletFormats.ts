// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { sha256 } from "@utils/crypto";

export interface WalletFormat {
  (password: string, username?: string): Promise<string>;
}

export type WalletFormatName = "mistwallet" | "mistwallet_username_appendhashes" | "mistwallet_username" | "jwalelset" | "api";
export const WALLET_FORMATS: Record<WalletFormatName, WalletFormat> = {
  "mistwallet": async password =>
    await sha256("KRISTWALLET" + password) + "-000",

  "mistwallet_username_appendhashes": async (password, username) =>
    await sha256("KRISTWALLETEXTENSION" + await sha256(await sha256(username || "") + "^" + await sha256(password))) + "-000",

  "mistwallet_username": async (password, username) =>
    await sha256(await sha256(username || "") + "^" + await sha256(password)),

  "jwalelset": async password =>
    await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(await sha256(password)))))))))))))))))),

  "api": async password => password
};
export const ADVANCED_FORMATS: WalletFormatName[] = [
  "mistwallet_username_appendhashes", "mistwallet_username", "jwalelset"
];

export const applyWalletFormat =
  (format: WalletFormatName, password: string, username?: string): Promise<string> =>
    WALLET_FORMATS[format](password, username);

export const formatNeedsUsername = (format: WalletFormatName): boolean =>
  WALLET_FORMATS[format].length === 2;
