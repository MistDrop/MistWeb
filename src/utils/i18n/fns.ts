// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { useCallback, useMemo } from "react";
import { i18n } from "i18next";
import { useTranslation, TFunction } from "react-i18next";
import { TranslatedError } from "./errors";

export type TKeyFn = (key: string) => string;
export type TStrFn = (key: string) => string;
export type TErrFn = (key: string) => TranslatedError;
export interface TFns {
  t: TFunction;
  tKey: TKeyFn;
  tStr: TStrFn;
  tErr: TErrFn;
  i18n: i18n;
}
export function useTranslationFns(prefix?: string): TFns {
  const { t, i18n } = useTranslation();
  const tKey = useCallback((key: string) => prefix + key, [prefix]);
  const tStr = useCallback((key: string) => t(tKey(key)), [t, tKey]);
  const tErr = useCallback((key: string) => new TranslatedError(tKey(key)), [tKey]);

  return useMemo(() => ({ t, tKey, tStr, tErr, i18n }), [
    t, i18n, tKey, tStr, tErr
  ]);
}
export const useTFns = useTranslationFns;
