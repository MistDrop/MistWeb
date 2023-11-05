// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { Row } from "antd";

import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";

import { MistName } from "@api/types";
import { MistNameLink } from "@comp/names/MistNameLink";
import { DateTime } from "@comp/DateTime";

export function NameItem({ name }: { name: MistName }): JSX.Element {
  const { t } = useTranslation();

  // Display 'purchased' if this is the original owner, otherwise display
  // 'received'. Note that this is different to checking if `transferred` is set
  // or not - subjectively I believe if the name is back in the original owner's
  // hands, it makes more sense to show when they originally purchased it,
  // rather than when they received it back. This may change in the future.
  const transferred = name.owner !== name.original_owner;

  const nameEl = <MistNameLink name={name.name} />;
  const nameLink = "/network/names/" + encodeURIComponent(name.name);
  const nameTime = new Date(transferred && name.transferred
    ? name.transferred : name.registered);

  return <Row className="card-list-item address-name-item">
    <div className="name-info">
      {/* Display 'purchased' if this is the original owner, otherwise display
        * 'received'. */}
      {!transferred
        ? <Trans t={t} i18nKey="address.namePurchased">Purchased {nameEl}</Trans>
        : <Trans t={t} i18nKey="address.nameReceived">Received {nameEl}</Trans>}
    </div>

    {/* Purchase time */}
    <Link to={nameLink}>
      <DateTime date={nameTime} timeAgo small secondary />
    </Link>
  </Row>;
}
