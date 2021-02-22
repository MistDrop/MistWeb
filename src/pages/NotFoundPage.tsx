import React from "react";
import { Button } from "antd";
import { FrownOutlined } from "@ant-design/icons";

import { useHistory } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { SmallResult } from "../components/SmallResult";

import "./NotFoundPage.less";

export function NotFoundPage(): JSX.Element {
  const { t } = useTranslation();
  const history = useHistory();

  return <div className="page-not-found">
    <SmallResult
      icon={<FrownOutlined />}
      status="error"
      title={t("pageNotFound.resultTitle")}
      extra={(
        <Button type="primary" onClick={() => history.goBack()}>
          {t("pageNotFound.buttonGoBack")}
        </Button>
      )}
    />
  </div>;
}
