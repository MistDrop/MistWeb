// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { store } from "@app";
import * as actions from "@actions/ContactsActions";

import { TranslatedError } from "@utils/i18n";

import { Contact, ContactMap } from ".";
import { broadcastDeleteContact } from "@global/StorageBroadcast";

import * as Sentry from "@sentry/react";
import Debug from "debug";
const debug = Debug("mistweb:contact-storage");

/** Get the local storage key for a given contact. */
export function getContactKey(contact: Contact | string): string {
  const id = typeof contact === "string" ? contact : contact.id;
  return `contact2-${id}`;
}

/** Extract a contact ID from a local storage key. */
const contactKeyRegex = /^contact2-([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})$/;
export function extractContactKey(key: string): [string, string] | undefined {
  const [, id] = contactKeyRegex.exec(key) || [];
  return id ? [key, id] : undefined;
}

export function parseContact(id: string, data: string | null): Contact {
  if (data === null) // localStorage key was missing
    throw new TranslatedError("masterPassword.walletStorageCorrupt");

  try {
    const contact: Contact = JSON.parse(data);

    // Validate the contact data actually makes sense
    if (!contact || !contact.id || contact.id !== id)
      throw new TranslatedError("masterPassword.walletStorageCorrupt");

    return contact;
  } catch (e) {
    Sentry.withScope(scope => {
      scope.setTag("contact-id", id);
      scope.setTag("contact-data", data);

      Sentry.captureException(e);
      console.error(e);
    });

    if (e.name === "SyntaxError") // Invalid JSON
      throw new TranslatedError("masterPassword.errorStorageCorrupt");
    else throw e; // Unknown error
  }
}

/** Loads all available contacts from local storage. */
export function loadContacts(): ContactMap {
  const contactMap: ContactMap = {};

  const lsKeys = Object.keys(localStorage);
  for (const lsKey of lsKeys) {
    // Find all 'contact2' keys from local storage
    const extracted = extractContactKey(lsKey);
    if (!extracted) continue;

    // Parse the contact from the stored string
    const [key, id] = extracted;
    const contact = parseContact(id, localStorage.getItem(key));

    contactMap[contact.id] = contact;
  }

  return contactMap;
}

/** Saves a contact to local storage. */
export function saveContact(contact: Contact): void {
  const key = getContactKey(contact);
  debug("saving contact key %s", key);

  const serialised = JSON.stringify(contact);
  localStorage.setItem(key, serialised);
}

/** Deletes a contact, removing it from local storage and dispatching the change
 * to the Redux store. */
export function deleteContact(contact: Contact): void {
  const key = getContactKey(contact);
  localStorage.removeItem(key);

  broadcastDeleteContact(contact.id); // Broadcast changes to other tabs

  store.dispatch(actions.removeContact(contact.id));
}
