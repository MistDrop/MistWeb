// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { FC } from "react";
import classNames from "classnames";
import { Menu } from "antd";

import { useTranslation } from "react-i18next";
import { getLanguages, Language } from "@utils/i18n";

import { Flag } from "@comp/Flag";

interface LanguageItemProps {
  code: string;
  lang: Language;
}
const LanguageItem: FC<LanguageItemProps> = ({ code, lang, ...props }): JSX.Element => {
  const { i18n } = useTranslation();

  const isCurrent = i18n.language === code;
  const classes = classNames("settings-language-item", {
    "settings-language-item-current": isCurrent
  });

  function changeLanguage() {
    i18n.changeLanguage(code);
  }

  return <Menu.Item {...props} className={classes} onClick={changeLanguage}>
    {/* Flag of language country */}
    <Flag
      code={lang.country}
      name={lang.name}
      className="settings-language-flag"
    />

    {/* Language name */}
    <span className="settings-language-name">{lang.name}</span>

    {/* Native name, if applicable */}
    {lang.nativeName && (
      <span className="settings-language-native-name">
        ({lang.nativeName})
      </span>
    )}
  </Menu.Item>;
};

export function getLanguageItems(): JSX.Element[] {
  const languages = getLanguages();
  if (!languages) return [];

  const entries = Object.entries(languages);
  entries.sort((a, b) => a[1].name.localeCompare(b[1].name));

  return entries
    .map(([code, lang]) => (
      <LanguageItem
        key={"language/" + code}
        code={code}
        lang={lang}
      />
    ));
}
