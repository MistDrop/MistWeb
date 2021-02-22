import React from "react";
import { Row, Col } from "antd";

import { Wallet } from "../../krist/wallets/Wallet";

import { KristValue } from "../../components/KristValue";

export function WalletItem({ wallet }: { wallet: Wallet }): JSX.Element {
  return <Row className="dashboard-list-item dashboard-wallet-item">
    <Col className="wallet-left">
      {wallet.label && <span className="wallet-label">{wallet.label}</span>}
      <span className="wallet-address">{wallet.address}</span>
    </Col>

    <Col className="wallet-right">
      <KristValue value={wallet.balance} />
    </Col>
  </Row>;
}
