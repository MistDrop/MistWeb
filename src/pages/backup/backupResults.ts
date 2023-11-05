// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt

import { TranslatedError } from "@utils/i18n";

import { Wallet } from "@wallets";
import { Contact } from "@contacts";

import { IncrProgressFn, InitProgressFn } from "./ImportProgress";

import Debug from "debug";
const debug = Debug("mistweb:backup-results");

export interface TranslatedMessage {
  key: string;
  args?: Record<string, string>;
}

export type MessageSource = "wallets" | "contacts";
export type MessageType = React.ReactNode | TranslatedMessage | string;
export type ResultType = "success" | "warning" | "error";

export interface ResultSet {
  label?: string;
  messages: BackupMessage[];
}

export class BackupResults {
  /** Number of new wallets that were added as a result of this import. */
  public newWallets = 0;
  public newContacts = 0;

  /** Number of wallets from the backup that were skipped (not imported). */
  public skippedWallets = 0;
  public skippedContacts = 0;

  /** Array of wallets that were successfully imported, used to handle
   * duplication checking (since the Redux state isn't guaranteed to be up to
   * date). */
  public importedWallets: Wallet[] = [];
  public importedContacts: Contact[] = [];

  /** For both wallets and contacts, a map of wallet/contact UUIDs containing
   * all the messages (success, warning, error). */
  public messages: {
    wallets: Record<string, ResultSet>;
    contacts: Record<string, ResultSet>;
  } = {
    wallets: {},
    contacts: {}
  };

  constructor(
    public onProgress: IncrProgressFn,
    public initProgress: InitProgressFn
  ) {}

  /** Adds a message to the appropriate message map. */
  private addMessage(src: MessageSource, uuid: string, message: BackupMessage): void {
    debug("backup result msg [%s] for %s: %o", src, uuid, message);

    const msgMap = this.messages[src];
    if (!msgMap[uuid]) msgMap[uuid] = { messages: [message] };
    else msgMap[uuid].messages.push(message);
  }

  /** Logs a success message for the given wallet/contact UUID to the
   * appropriate message map. */
  public addSuccessMessage(src: MessageSource, uuid: string, message: MessageType): void {
    this.addMessage(src, uuid, { type: "success", message });
  }

  /** Logs a warning message for the given wallet/contact UUID to the
   * appropriate message map. */
  public addWarningMessage(src: MessageSource, uuid: string, message: MessageType): void {
    this.addMessage(src, uuid, { type: "warning", message });
  }

  /** Logs an error message for the given wallet/contact UUID to the appropriate
   * message map. */
  public addErrorMessage(src: MessageSource, uuid: string, message?: MessageType, error?: Error): void {
    this.addMessage(src, uuid, { type: "error", message, error });
  }

  /** Sets the label of a result set for the given wallet/contact UUID. */
  public setResultLabel(src: MessageSource, uuid: string, label: string): void {
    const msgMap = this.messages[src];
    if (!msgMap[uuid]) msgMap[uuid] = { label, messages: [] };
    else msgMap[uuid].label = label;
  }
}

export interface BackupMessage {
  type: ResultType;
  error?: Error;
  message?: MessageType;
}

export class BackupError extends TranslatedError {
  constructor(message: string) { super(message); }
}

export class BackupWalletError extends BackupError {
  constructor(message: string) { super("import.walletMessages." + message); }
}

export class BackupContactError extends BackupError {
  constructor(message: string) { super("import.contactMessages." + message); }
}
