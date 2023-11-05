// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { ReactNode } from "react";
import { Typography, Spin } from "antd";
import { LoadingOutlined } from "@ant-design/icons";

import { Trans, useTranslation } from "react-i18next";

import { MistAddress, MistName, MistBlock, MistTransaction } from "@api/types";
import { MistValue } from "@comp/mist/MistValue";
import { MistNameLink } from "@comp/names/MistNameLink";
import { DateTime } from "@comp/DateTime";

import "./SearchResults.less";

const { Text } = Typography;

export function Loading(): JSX.Element {
  return <div className="search-result-loading"><Spin /></div>;
}

export function NoResults(): JSX.Element {
  const { t } = useTranslation();
  return <Text type="secondary">{t("nav.search.noResults")}</Text>;
}

export function RateLimitHit(): JSX.Element {
  const { t } = useTranslation();
  return <Text type="danger">{t("nav.search.rateLimitHit")}</Text>;
}

interface ExactMatchBaseProps {
  typeKey: string;
  primaryValue: ReactNode | number;
  extraInfo?: ReactNode;
}
export function ExactMatchBase({ typeKey, primaryValue, extraInfo }: ExactMatchBaseProps): JSX.Element {
  const { t } = useTranslation();

  return <div className="search-result search-result-exact">
    <div className="result-left">
      {/* Result type (e.g. 'Address', 'Transaction') */}
      <span className="search-result-type">
        {t(typeKey)}
      </span>

      {/* Primary result value (e.g. the address, the ID) */}
      <span className="search-result-value">
        {typeof primaryValue === "number"
          ? primaryValue.toLocaleString()
          : primaryValue}
      </span>
    </div>

    {extraInfo && <div className="result-right">
      {extraInfo}
    </div>}
  </div>;
}

export function ExactAddressMatch({ address }: { address: MistAddress }): JSX.Element {
  return <ExactMatchBase
    typeKey="nav.search.resultAddress"
    primaryValue={address.address}
    extraInfo={<MistValue value={address.balance} />}
  />;
}

export function ExactNameMatch({ name }: { name: MistName }): JSX.Element {
  const { t } = useTranslation();

  function Owner() {
    return <b>{name.owner}</b>;
  }

  return <ExactMatchBase
    typeKey="nav.search.resultName"
    primaryValue={<MistNameLink name={name.name} noLink />}
    extraInfo={<span className="search-name-owner">
      <Trans t={t} i18nKey="nav.search.resultNameOwner">
        Owned by <Owner />
      </Trans>
    </span>}
  />;
}

export function ExactBlockMatch({ block }: { block: MistBlock }): JSX.Element {
  const { t } = useTranslation();

  function Miner() {
    return <b>{block.address}</b>;
  }

  return <ExactMatchBase
    typeKey="nav.search.resultBlockID"
    primaryValue={block.height}
    extraInfo={<>
      <span className="search-block-miner">
        <Trans t={t} i18nKey="nav.search.resultBlockIDMinedBy">
          Mined by <Miner />
        </Trans>
      </span>

      <DateTime date={block.time} />
    </>}
  />;
}

export function ExactTransactionMatch({ transaction }: { transaction: MistTransaction }): JSX.Element {
  return <ExactMatchBase
    typeKey="nav.search.resultTransactionID"
    primaryValue={transaction.id}
    extraInfo={<>
      <MistValue value={transaction.value} />
      <DateTime date={transaction.time} />
    </>}
  />;
}

interface ExtendedMatchProps {
  loading?: boolean;
  count?: number;
  query?: ReactNode;

  loadingKey: string;
  resultKey: string;
}
type ExtendedMatchBaseProps = Omit<ExtendedMatchProps, "loadingKey" | "resultKey" | "query"> & { query: string };
export function ExtendedMatchBase({ loading, count, query, loadingKey, resultKey }: ExtendedMatchProps): JSX.Element {
  const { t } = useTranslation();

  function Query(): JSX.Element {
    return <>{query}</>;
  }

  return <div className="search-result search-result-extended">
    {/* Result type (e.g. 'Address', 'Transaction') */}
    <span className="search-result-type">
      {t("nav.search.resultTransactions")}
    </span>

    <span className="search-result-extended-info">
      {loading || typeof count !== "number"
        ? <>
          <LoadingOutlined spin />
          <Trans t={t} i18nKey={loadingKey}>
            Placeholder <Query />
          </Trans>
        </>
        : (count > 0
          ? (
            <Trans t={t} i18nKey={resultKey} count={count}>
              <b>{{ count }}</b> placeholder <Query />
            </Trans>
          )
          : (
            <Trans t={t} i18nKey={resultKey + "Empty"}>
              No placeholder <Query />
            </Trans>
          ))}

    </span>
  </div>;
}

export function ExtendedAddressMatch(props: ExtendedMatchBaseProps): JSX.Element {
  return <ExtendedMatchBase
    {...props}

    query={<b>{props.query}</b>}

    loadingKey="nav.search.resultTransactionsAddress"
    resultKey="nav.search.resultTransactionsAddressResult"
  />;
}

export function ExtendedNameMatch(props: ExtendedMatchBaseProps): JSX.Element {
  return <ExtendedMatchBase
    {...props}

    query={<MistNameLink name={props.query} noLink />}

    loadingKey="nav.search.resultTransactionsName"
    resultKey="nav.search.resultTransactionsNameResult"
  />;
}

export function ExtendedMetadataMatch(props: ExtendedMatchBaseProps): JSX.Element {
  return <ExtendedMatchBase
    {...props}

    query={<>&apos;<b>{props.query}</b>&apos;</>}

    loadingKey="nav.search.resultTransactionsMetadata"
    resultKey="nav.search.resultTransactionsMetadataResult"
  />;
}
