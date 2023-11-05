// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { Wallet } from "@wallets";
import { Contact } from "@contacts";

// The values here are the translation keys for the formats.
export enum BackupFormatType {
  KRISTWEB_V1 = "import.detectedFormatMistWebV1",
  KRISTWEB_V2 = "import.detectedFormatMistWebV2"
}

export interface Backup {
  // This value is inserted by `detectBackupFormat`.
  type: BackupFormatType;

  salt: string;
  tester: string;
}

// =============================================================================
// MistWeb v1
// =============================================================================

// https://github.com/MistDrop/MistWeb/blob/696a402/src/js/wallet/model.js
export interface MistWebV1Wallet {
  address?: string;
  label?: string;
  icon?: string;
  username?: string;
  password?: string;
  masterkey?: string;
  format?: string;
  syncNode?: string;
  balance?: number;
  position?: number;
}

// https://github.com/MistDrop/MistWeb/blob/696a402/src/js/friends/model.js
export interface MistWebV1Contact {
  address?: string;
  label?: string;
  icon?: string;
  isName?: boolean;
  syncNode?: string;
}

export interface BackupMistWebV1 extends Backup {
  type: BackupFormatType.KRISTWEB_V1;

  // MistWeb v1 backups contain a map of wallets, where the values are
  // encrypted JSON.
  wallets: Record<string, string>;
  friends: Record<string, string>;
}
export const isBackupMistWebV1 = (backup: Backup): backup is BackupMistWebV1 =>
  backup.type === BackupFormatType.KRISTWEB_V1;

// =============================================================================
// MistWeb v2
// =============================================================================

export type MistWebV2Wallet = Wallet;
export type MistWebV2Contact = Contact;

export interface BackupMistWebV2 extends Backup {
  type: BackupFormatType.KRISTWEB_V2;
  version: 2;

  wallets: Record<string, MistWebV2Wallet>;
  contacts: Record<string, MistWebV2Contact>;
}
export const isBackupMistWebV2 = (backup: Backup): backup is BackupMistWebV2 =>
  backup.type === BackupFormatType.KRISTWEB_V2;
