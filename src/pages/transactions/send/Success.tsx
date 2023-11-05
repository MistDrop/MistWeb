// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { Button } from "antd";

import { useTranslation, Trans } from "react-i18next";

import { Link } from "react-router-dom";

import { MistTransaction } from "@api/types";
import { MistValue } from "@comp/mist/MistValue";
import { ContextualAddress } from "@comp/addresses/ContextualAddress";

export function NotifSuccessContents({ tx }: { tx: MistTransaction }): JSX.Element {
  const { t } = useTranslation();

  return <Trans t={t} i18nKey="sendTransaction.successNotificationContent">
    You sent
    <MistValue value={tx.value} />
    from
    <ContextualAddress
      address={tx.from || "UNKNOWN"}
      metadata={tx.metadata}
      source
      neverCopyable
    />
    to
    <ContextualAddress
      address={tx.to}
      metadata={tx.metadata}
      neverCopyable
    />
  </Trans>;
}

export function NotifSuccessButton({ tx }: { tx: MistTransaction }): JSX.Element {
  const { t } = useTranslation();

  return <Link to={"/network/transactions/" + encodeURIComponent(tx.id)}>
    <Button type="primary">
      {t("sendTransaction.successNotificationButton")}
    </Button>
  </Link>;
}
