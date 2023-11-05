// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { Descriptions } from "antd";

import { useTranslation } from "react-i18next";

import { OptionalField } from "@comp/OptionalField";
import { MistValue } from "@comp/mist/MistValue";
import { DateTime } from "@comp/DateTime";
import { BooleanText } from "./BooleanText";

import { WalletDescProps } from "./WalletInfoModal";

export function WalletDescSyncedInfo({ wallet, descProps }: WalletDescProps): JSX.Element {
  const { t } = useTranslation();

  return <Descriptions title={t("myWallets.info.titleSyncedInfo")} {...descProps}>
    {/* Wallet Address */}
    <Descriptions.Item label={t("myWallets.info.address")}>
      <OptionalField copyable value={wallet.address} />
    </Descriptions.Item>

    {/* Wallet Balance */}
    <Descriptions.Item label={t("myWallets.info.balance")}>
      <OptionalField
        copyable={{ text: wallet.balance?.toString() }}
        value={wallet.firstSeen
          ? <MistValue value={wallet.balance} />
          : undefined}
      />
    </Descriptions.Item>

    {/* Wallet Name Count */}
    <Descriptions.Item label={t("myWallets.info.names")}>
      <OptionalField copyable value={wallet.names ? wallet.names : undefined} />
    </Descriptions.Item>

    {/* Wallet First Seen */}
    <Descriptions.Item label={t("myWallets.info.firstSeen")}>
      <OptionalField
        copyable={{ text: wallet.firstSeen?.toString() }}
        value={wallet.firstSeen
          ? <DateTime neverRelative tooltip={false} date={wallet.firstSeen} />
          : undefined}
      />
    </Descriptions.Item>

    {/* Wallet Exists on network */}
    <Descriptions.Item label={t("myWallets.info.existsOnNetwork")}>
      <BooleanText value={!!wallet.firstSeen} />
    </Descriptions.Item>

    {/* Wallet Last Synced */}
    <Descriptions.Item label={t("myWallets.info.lastSynced")}>
      <OptionalField
        copyable={{ text: wallet.lastSynced?.toString() }}
        value={wallet.lastSynced
          ? <DateTime neverRelative tooltip={false} date={wallet.lastSynced} />
          : undefined}
      />
    </Descriptions.Item>
  </Descriptions>;
}
