// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { useSelector, shallowEqual } from "react-redux";
import { RootState } from "@store";

import { Contact, ContactMap } from ".";

export type ContactAddressMap = Record<string, Contact>;

export interface ContactsHookResponse {
  contacts: ContactMap;
  contactAddressMap: ContactAddressMap;

  contactAddressList: string[];
  joinedContactAddressList: string;
}

/** Hook that fetches the contacts from the Redux store. */
export function useContacts(): ContactsHookResponse {
  const contacts = useSelector((s: RootState) => s.contacts.contacts, shallowEqual);

  const contactAddressMap: ContactAddressMap = {};
  const contactAddressList: string[] = [];

  for (const id in contacts) {
    const contact = contacts[id];
    const address = contact.address;

    contactAddressMap[address] = contact;
    contactAddressList.push(address);
  }

  const joinedContactAddressList = contactAddressList.join(",");

  return {
    contacts, contactAddressMap,
    contactAddressList, joinedContactAddressList
  };
}
