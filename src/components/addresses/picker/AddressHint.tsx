// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { useTranslation, Trans } from "react-i18next";

import { MistAddressWithNames } from "@api/lookup";
import { MistValue } from "@comp/mist/MistValue";

interface Props {
  address?: MistAddressWithNames;
  nameHint?: boolean;
}

export function AddressHint({ address, nameHint }: Props): JSX.Element {
  const { t } = useTranslation();

  return <span className="address-picker-hint address-picker-address-hint">
    {nameHint
      ? (
        // Show the name count if this picker is relevant to a name transfer
        <Trans t={t} i18nKey="addressPicker.addressHintWithNames">
          Balance: <b>{{ names: address?.names || 0 }}</b>
        </Trans>
      )
      : (
        // Otherwise, show the balance
        <Trans t={t} i18nKey="addressPicker.addressHint">
          Balance: <MistValue value={address?.balance || 0} />
        </Trans>
      )
    }
  </span>;
}
