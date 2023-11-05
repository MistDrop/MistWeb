// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { useCallback, useMemo } from "react";
import { Modal, Dropdown, Menu } from "antd";
import {
  EditOutlined, DeleteOutlined, ExclamationCircleOutlined, SendOutlined
} from "@ant-design/icons";

import { TFunction } from "react-i18next";
import { useTFns, TStrFn } from "@utils/i18n";

import { useAuth } from "@comp/auth";
import { OpenEditContactFn } from "./ContactEditButton";
import { OpenSendTxFn } from "@comp/transactions/SendTransactionModalLink";

import { Contact, deleteContact } from "@contacts";

interface Props {
  contact: Contact;
  openEditContact: OpenEditContactFn;
  openSendTx: OpenSendTxFn;
}

export function ContactActions({
  contact,
  openEditContact,
  openSendTx,
}: Props): JSX.Element {
  const { t, tStr } = useTFns("addressBook.");
  const promptAuth = useAuth();

  const showContactDeleteConfirm = useCallback(
    () => showContactDeleteConfirmModal(t, tStr, contact),
    [t, tStr, contact]
  );

  const memoDropdown = useMemo(() => <Dropdown.Button
    className="table-actions contact-actions"

    onClick={() => openEditContact(undefined, contact)}
    trigger={["click"]}
    overlay={() => (
      <Menu>
        {/* Send tx button */}
        <Menu.Item key="1" icon={<SendOutlined />}
          onClick={() => promptAuth(false, () =>
            openSendTx(undefined, contact.address))}>
          {tStr("actionsSendTransaction")}
        </Menu.Item>

        <Menu.Divider />

        {/* Delete button */}
        <Menu.Item key="3" danger onClick={() => showContactDeleteConfirm()}>
          <DeleteOutlined /> {tStr("actionsDelete")}
        </Menu.Item>
      </Menu>
    )}
  >
    {/* Edit button */}
    <EditOutlined />
  </Dropdown.Button>, [
    tStr, contact, promptAuth, openSendTx, openEditContact,
    showContactDeleteConfirm
  ]);

  return memoDropdown;
}

export function showContactDeleteConfirmModal(
  t: TFunction,
  tStr: TStrFn,
  contact: Contact
): void {
  Modal.confirm({
    icon: <ExclamationCircleOutlined />,

    title: tStr("actionsDeleteConfirm"),

    onOk: () => deleteContact(contact),
    okText: t("dialog.yes"),
    okType: "danger",
    cancelText: t("dialog.no")
  });
}
