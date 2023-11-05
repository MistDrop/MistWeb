// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { useTranslation } from "react-i18next";

import { useWallets } from "@wallets";
import { MistValue } from "@comp/mist/MistValue";

export function SidebarTotalBalance(): JSX.Element {
  const { t } = useTranslation();

  const { wallets } = useWallets();
  const balance = Object.values(wallets)
    .filter(w => w.balance !== undefined)
    .reduce((acc, w) => acc + w.balance!, 0);

  return (
    <div className="site-sidebar-header site-sidebar-total-balance">
      <h5>{t("sidebar.totalBalance")}</h5>
      <MistValue value={balance} long />
    </div>
  );
}
