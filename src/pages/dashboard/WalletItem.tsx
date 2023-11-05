// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { Row, Col } from "antd";

import { Wallet } from "@wallets";

import { MistValue } from "@comp/mist/MistValue";
import { ContextualAddress } from "@comp/addresses/ContextualAddress";

export function WalletItem({ wallet }: { wallet: Wallet }): JSX.Element {
  return <Row className="card-list-item dashboard-wallet-item">
    <Col className="wallet-left">
      {wallet.label && <span className="wallet-label">{wallet.label}</span>}
      <ContextualAddress
        className="wallet-address"
        address={wallet.address}
        wallet={false}
        contact={false}
        nonExistent={!wallet.firstSeen}
      />
    </Col>

    <Col className="wallet-right">
      <MistValue value={wallet.balance} highlightZero />
    </Col>
  </Row>;
}
