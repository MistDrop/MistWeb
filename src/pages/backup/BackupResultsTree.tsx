// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { useMemo } from "react";
import { Tree } from "antd";
import { DataNode } from "antd/lib/tree";
import { CheckCircleOutlined, WarningOutlined, ExclamationCircleOutlined } from "@ant-design/icons";

import { i18n } from "i18next";
import { useTranslation, TFunction } from "react-i18next";
import { translateError } from "@utils/i18n";

import {
  BackupResults, ResultType, MessageType, TranslatedMessage
} from "./backupResults";

import "./BackupResultsTree.less";

interface Props {
  results: BackupResults;
}

const CLEAN_ID_RE = /^(?:[Ww]allet\d*|[Ff]riend\d*|[Cc]ontact\d*)-/;

/** Maps the different types of message results (success, warning, error)
 * to icons. */
function getMessageIcon(type: ResultType) {
  switch (type) {
  case "success":
    return <CheckCircleOutlined className="backup-result-icon backup-result-success" />;
  case "warning":
    return <WarningOutlined className="backup-result-icon backup-result-warning" />;
  case "error":
    return <ExclamationCircleOutlined className="backup-result-icon backup-result-error" />;
  }
}

/** Maps the different types of messages to a properly rendered ReactNode. */
function getMessageTitle(
  t: TFunction, i18n: i18n,
  message?: MessageType, error?: Error
): React.ReactNode {
  // If there was an error, translate it if possible and render it.
  if (error) {
    return translateError(t, error);
  }

  // If there's no error, show the message instead
  if (typeof message === "string") {
    // If the message is a string, translate it if possible, otherwise, render
    // it directly.
    if (i18n.exists(message)) return t(message);
    else return message;
  } else if (message && typeof message === "object" && (message as TranslatedMessage).key) {
    // If the message is a TranslatedMessage, translate it and substitute the
    // arguments in
    const msg = (message as TranslatedMessage);
    return t(msg.key, msg.args);
  } else if (message) {
    // It's probably a ReactNode, render it directly
    return message;
  }

  // Shouldn't happen, but there was neither a message nor an error.
  return null;
}

function getTreeItem(
  t: TFunction, i18n: i18n,
  results: BackupResults,
  type: "wallets" | "contacts",
  id: string,
): DataNode {
  // The IDs are the keys of the backup, which may begin with prefixes like
  // "Wallet-"; remove those for cleanliness
  const cleanID = id.replace(CLEAN_ID_RE, "");
  const resultSet = results.messages[type][id];
  const { label, messages } = resultSet;
  const messageNodes: DataNode[] = [];

  for (let i = 0; i < messages.length; i++) {
    const { type, message, error } = messages[i];
    const icon = getMessageIcon(type);
    const title = getMessageTitle(t, i18n, message, error);

    messageNodes.push({
      key: `${type}-${cleanID}-${i}`,
      title,
      icon,
      isLeaf: true,
      className: "backup-results-tree-message"
    });
  }

  return {
    key: `${type}-${cleanID}`,
    title: t(
      type === "wallets"
        ? "import.results.treeWallet"
        : "import.results.treeContact",
      { id: label || cleanID }
    ),
    children: messageNodes
  };
}

/** Converts the backup results into a tree of messages, grouped by wallet
 * and contact UUID. */
function getTreeData(
  t: TFunction, i18n: i18n,
  results: BackupResults
): DataNode[] {
  const out: DataNode[] = [];

  // Add the wallet messages data
  for (const id in results.messages.wallets)
    out.push(getTreeItem(t, i18n, results, "wallets", id));

  // Add the contact messages data
  for (const id in results.messages.contacts)
    out.push(getTreeItem(t, i18n, results, "contacts", id));

  return out;
}

export function BackupResultsTree({ results }: Props): JSX.Element {
  const { t, i18n } = useTranslation();

  const treeData = useMemo(() =>
    getTreeData(t, i18n, results), [t, i18n, results]);

  return <Tree
    className="backup-results-tree"

    selectable={false}
    defaultExpandAll
    showIcon

    treeData={treeData}
  />;
}
