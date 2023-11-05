// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { useState, useEffect } from "react";
import { Row, Col, Skeleton, Tag, Typography } from "antd";

import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

import { PageLayout } from "@layout/PageLayout";
import { APIErrorResult } from "@comp/results/APIErrorResult";

import { Statistic } from "@comp/Statistic";
import { MistValue } from "@comp/mist/MistValue";
import { DateTime } from "@comp/DateTime";

import * as api from "@api";
import { lookupAddress, MistAddressWithNames } from "@api/lookup";
import { useWallets } from "@wallets";
import { useContacts } from "@contacts";
import { useSubscription } from "@global/ws/WebsocketSubscription";
import { useBooleanSetting } from "@utils/settings";

import { AddressButtonRow } from "./AddressButtonRow";
import { AddressTransactionsCard } from "./AddressTransactionsCard";
import { AddressNamesCard } from "./AddressNamesCard";

import { getVerified, VerifiedDescription } from "@comp/addresses/VerifiedAddress";

import { useEditWalletModal } from "@pages/wallets/WalletEditButton";
import { useEditContactModal } from "@pages/contacts/ContactEditButton";
import { useSendTransactionModal } from "@comp/transactions/SendTransactionModalLink";

import "./AddressPage.less";

const { Text } = Typography;

interface ParamTypes {
  address: string;
}

interface PageContentsProps {
  address: MistAddressWithNames;
  lastTransactionID: number;
}

function PageContents({ address, lastTransactionID }: PageContentsProps): JSX.Element {
  const { t } = useTranslation();
  const { walletAddressMap } = useWallets();
  const { contactAddressMap } = useContacts();

  const myWallet = walletAddressMap[address.address];
  const myContact = contactAddressMap[address.address];
  const showWalletTags = myWallet && (myWallet.label || myWallet.category);
  const showContactTags = myContact && myContact.label;

  const verified = getVerified(address.address);
  const showVerifiedDesc = verified?.description || verified?.website ||
    verified?.isActive === false;

  const [openEditWallet, editWalletModal] = useEditWalletModal();
  const [openEditContact, editContactModal] = useEditContactModal();
  const [openSendTx, sendTxModal] = useSendTransactionModal();

  return <>
    {/* Address and buttons */}
    <Row className="top-address-row">
      {/* Address */}
      <Text className="address" copyable>
        {address.address}
      </Text>

      {/* Buttons (e.g. Send Mist, Add contact) */}
      <AddressButtonRow
        address={address.address}
        myWallet={myWallet}
        myContact={myContact}

        openEditWallet={openEditWallet}
        openEditContact={openEditContact}
        openSendTx={openSendTx}
      />
    </Row>

    {/* Wallet/contact/verified tags (if applicable) */}
    {(showWalletTags || showContactTags || verified) && (
      <Row className="address-wallet-row">
        {/* Verified label */}
        {verified?.label && <span className="address-wallet-verified">
          <Tag color={verified.isActive !== false ? "orange" : undefined}>
            {verified.label}
          </Tag>
        </span>}

        {/* Label */}
        {myWallet?.label && <span className="address-wallet-label">
          <span className="prefix">{t("address.walletLabel")}</span>
          <Tag>{myWallet.label}</Tag>
        </span>}

        {/* Category */}
        {myWallet?.category && <span className="address-wallet-category">
          <span className="prefix">{t("address.walletCategory")}</span>
          <Tag>{myWallet.category}</Tag>
        </span>}

        {/* Contact label */}
        {myContact?.label && <span className="address-wallet-contact">
          <span className="prefix">{t("address.contactLabel")}</span>
          <Tag>{myContact.label}</Tag>
        </span>}
      </Row>
    )}

    {/* Main address info */}
    <Row className="address-info-row">
      {/* Current balance */}
      <Col span={24} md={12} lg={8}>
        <Statistic
          titleKey="address.balance"
          value={<MistValue long green highlightZero value={address.balance} />}
        />
      </Col>

      {/* Names */}
      <Col span={24} md={12} lg={8}>
        <Statistic
          titleKey="address.names"
          value={(address.names || 0) > 0
            ? t("address.nameCount", { count: address.names })
            : t("address.nameCountEmpty")}
        />
      </Col>

      {/* First seen */}
      <Col span={24} md={24} lg={8}>
        <Statistic
          titleKey="address.firstSeen"
          value={<DateTime date={address.firstseen} />}
        />
      </Col>
    </Row>

    {/* Verified description/website */}
    {showVerifiedDesc && (
      <VerifiedDescription verified={verified!} />
    )}

    {/* Transaction and name row */}
    <Row gutter={16} className="address-card-row">
      {/* Recent transactions */}
      <Col span={24} xl={14} xxl={12}>
        <AddressTransactionsCard
          address={address.address}
          lastTransactionID={lastTransactionID}
        />
      </Col>

      {/* Names */}
      <Col span={24} xl={10} xxl={12}>
        {/* TODO: Subscription for this card */}
        <AddressNamesCard address={address.address} />
      </Col>
    </Row>

    {sendTxModal}
    {editWalletModal}
    {editContactModal}
  </>;
}

export function AddressPage(): JSX.Element {
  // Used to refresh the address data on syncNode change
  const syncNode = api.useSyncNode();

  const { address } = useParams<ParamTypes>();
  const [mistAddress, setMistAddress] = useState<MistAddressWithNames | undefined>();
  const [error, setError] = useState<Error | undefined>();

  // Used to refresh the address data when a transaction is made to it
  const lastTransactionID = useSubscription({ address });
  const shouldAutoRefresh = useBooleanSetting("autoRefreshAddressPage");
  const usedRefreshID = shouldAutoRefresh ? lastTransactionID : 0;

  // Load the address on page load
  // TODO: passthrough router state to pre-load from search
  // REVIEW: The search no longer clears the LRU cache on each open, meaning it
  //         is possible for an address's information to be up to 3 minutes
  //         out-of-date in the search box. If we passed through the state from
  //         the search and directly used it here, it would definitely be too
  //         outdated to display. It could be possible to show that state data
  //         and still lookup the most recent data, but is it worth it? The page
  //         would appear 10-200ms faster, sure, but if the data _has_ changed,
  //         then it would cause a jarring re-render, just to save a single
  //         cheap network request. Will definitely require some further
  //         usability testing.
  useEffect(() => {
    lookupAddress(address, true)
      .then(setMistAddress)
      .catch(setError);
  }, [syncNode, address, usedRefreshID]);

  // Change the page title depending on whether or not the address has loaded
  const title = mistAddress
    ? { siteTitle: mistAddress.address, subTitle: mistAddress.address }
    : { siteTitleKey: "address.title" };

  return <PageLayout
    className="address-page"
    titleKey="address.title"
    {...title}
  >
    {error
      ? (
        <APIErrorResult
          error={error}

          invalidParameterTitleKey="address.resultInvalidTitle"
          invalidParameterSubTitleKey="address.resultInvalid"

          notFoundMessage="address_not_found"
          notFoundTitleKey="address.resultNotFoundTitle"
          notFoundSubTitleKey="address.resultNotFound2"
        />
      )
      : (mistAddress
        ? (
          <PageContents
            address={mistAddress}
            lastTransactionID={usedRefreshID}
          />
        )
        : <Skeleton active />)}
  </PageLayout>;
}
