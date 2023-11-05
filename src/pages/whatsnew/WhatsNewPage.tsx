// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { useState, useEffect } from "react";
import { Row, Col, Typography, Tooltip, Card } from "antd";
import { GithubOutlined } from "@ant-design/icons";

import { useTranslation } from "react-i18next";

import { useSelector } from "react-redux";
import { RootState } from "@store";

import * as api from "@api";
import { WhatsNewResponse, Commit } from "./types";
import { getAuthorInfo, criticalError } from "@utils";

import { PageLayout } from "@layout/PageLayout";

import { WhatsNewCard } from "./WhatsNewCard";
import { CommitsCard } from "./CommitsCard";

import "./WhatsNewPage.less";

const { Title } = Typography;

declare const __GIT_COMMITS__: Commit[];
const mistWebCommits: Commit[] = __GIT_COMMITS__;

export function WhatsNewPage(): JSX.Element {
  const { t } = useTranslation();

  const syncNode = api.useSyncNode();

  const [mistData, setMistData] = useState<WhatsNewResponse>();
  const [loading, setLoading] = useState(true);

  // Get the repository URL for MistWeb
  const mistWebRepo = getAuthorInfo().gitURL;
  // Get the repository URL for the sync node
  const mistPackage = useSelector((s: RootState) => s.node.package);

  useEffect(() => {
    // Fetch the 'whats new' and commits from the Mist sync node
    api.get<WhatsNewResponse>("whatsnew")
      .then(setMistData)
      .catch(criticalError) // TODO: show errors to the user
      .finally(() => setLoading(false));
  }, [syncNode]);

  return <PageLayout
    titleKey="whatsNew.title"
    siteTitleKey="whatsNew.siteTitle"

    className="whats-new-page"
  >
    {/* MistWeb */}
    <Title level={2}>
      {t("whatsNew.titleMistWeb")}
      <GithubLink repoURL={mistWebRepo} />
    </Title>

    <Row gutter={16}>
      {/* MistWeb What's new */}
      <Col span={24} lg={12}>
        {/* Temporary card */}
        <Card
          title={t("whatsNew.cardWhatsNewTitle")}
          className="kw-card whats-new-card-whats-new"
        >
          <h1 style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontSize: 96,
            height: "100%"
          }}>
            This
          </h1>
        </Card>
      </Col>

      {/* MistWeb commits */}
      <Col span={24} lg={12}>
        <CommitsCard
          loading={loading}
          commits={mistWebCommits}
          repoURL={mistWebRepo}
        />
      </Col>
    </Row>

    {/* Mist */}
    <Title level={2} style={{ marginTop: 16 }}>
      {t("whatsNew.titleMist")}
      <GithubLink repoURL={mistPackage.repository} />
    </Title>

    <Row gutter={16}>
      {/* Mist What's new */}
      <Col span={24} lg={12}>
        <WhatsNewCard
          loading={loading}
          whatsNew={mistData?.whatsNew}
          baseURL={syncNode}
          repoURL={mistPackage.repository}
        />
      </Col>

      {/* Mist commits */}
      <Col span={24} lg={12}>
        <CommitsCard
          loading={loading}
          commits={mistData?.commits}
          repoURL={mistPackage.repository}
        />
      </Col>
    </Row>
  </PageLayout>;
}

function GithubLink({ repoURL }: { repoURL: string }): JSX.Element {
  const { t } = useTranslation();

  return <Tooltip title={t("whatsNew.tooltipGitHub")}>
    <a
      className="whats-new-github-link"
      href={repoURL}
      target="_blank" rel="noopener noreferrer"
    >
      <GithubOutlined />
    </a>
  </Tooltip>;
}
