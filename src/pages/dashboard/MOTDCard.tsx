// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { Card, Alert } from "antd";

import { useSelector } from "react-redux";
import { RootState } from "@store";

import { useTranslation } from "react-i18next";

import Markdown from "markdown-to-jsx";
import { useMarkdownLink } from "@comp/mist/MarkdownLink";
import { DateTime } from "@comp/DateTime";

export function MOTDCard(): JSX.Element {
  const { t } = useTranslation();
  const { motd, motdSet, endpoint, debugMode }
    = useSelector((s: RootState) => s.node.motd);

  // Make relative links start with the sync node, and override all links to
  // open in a new tab
  const MarkdownLink = useMarkdownLink();

  return <Card title={t("dashboard.motdCardTitle")} className="kw-card dashboard-card-motd">

    <Markdown options={{
      disableParsingRawHTML: true,
      overrides: { a: MarkdownLink }
    }}>
      {motd}
    </Markdown>

    <DateTime date={motdSet} timeAgo small secondary />
  </Card>;
}
