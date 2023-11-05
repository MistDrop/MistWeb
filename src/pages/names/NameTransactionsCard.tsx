// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { useState, useEffect } from "react";
import classNames from "classnames";
import { Card, Skeleton, Empty } from "antd";

import { useTranslation } from "react-i18next";

import { TransactionSummary } from "@comp/transactions/TransactionSummary";
import { lookupTransactions, LookupTransactionsResponse, LookupTransactionType as LookupTXType } from "@api/lookup";

import { useSyncNode } from "@api";

import { SmallResult } from "@comp/results/SmallResult";

import Debug from "debug";
const debug = Debug("mistweb:name-transactions-card");

async function fetchTransactions(name: string, type: LookupTXType): Promise<LookupTransactionsResponse> {
  debug("fetching name transactions (type %d)", type);
  return lookupTransactions(
    [name],
    { type, limit: 5, orderBy: "id", order: "DESC" }
  );
}

interface Props {
  name: string;
  type: LookupTXType;
  lastTransactionID: number;
}

export function NameTransactionsCard({
  name,
  type,
  lastTransactionID
}: Props): JSX.Element {
  const { t } = useTranslation();
  const syncNode = useSyncNode();

  const [res, setRes] = useState<LookupTransactionsResponse | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [loading, setLoading] = useState(true);

  // Fetch transactions on page load or sync node reload
  useEffect(() => {
    if (!syncNode) return;

    // Remove the existing results in case the name changed
    setRes(undefined);
    setLoading(true);

    fetchTransactions(name, type)
      .then(setRes)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [syncNode, name, type, lastTransactionID]);

  const isEmpty = !loading && (error || !res || res.count === 0);
  const classes = classNames("kw-card", "name-card-transactions", {
    "empty": isEmpty
  });

  return <Card
    // Change the title depending on the type of card this is
    title={type === LookupTXType.NAME_HISTORY
      ? t("name.cardHistoryTitle")
      : t("name.cardRecentTransactionsTitle")}
    className={classes}
  >
    <Skeleton paragraph={{ rows: 4 }} title={false} active loading={loading}>
      {error
        ? (
          <SmallResult
            status="error"
            title={t("error")}
            subTitle={type === LookupTXType.NAME_HISTORY
              ? t("name.transactionsError")
              : t("name.historyError")}
          />
        )
        : (res && res.count > 0
          ? (
            <TransactionSummary
              transactions={res.transactions}
              seeMoreCount={res.total}
              seeMoreLink={type === LookupTXType.NAME_HISTORY
                ? `/network/names/${encodeURIComponent(name)}/history`
                : `/network/names/${encodeURIComponent(name)}/transactions`}
            />
          )
          : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />
        )}
    </Skeleton>
  </Card>;
}
