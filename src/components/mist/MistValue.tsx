// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import React from "react";
import classNames from "classnames";

import { useSelector } from "react-redux";
import { RootState } from "@store";

import { MistSymbol } from "./MistSymbol";

import "./MistValue.less";

interface OwnProps {
  icon?: React.ReactNode;
  value?: number;
  long?: boolean;
  hideNullish?: boolean;
  green?: boolean;
  highlightZero?: boolean;
}
type Props = React.HTMLProps<HTMLSpanElement> & OwnProps;

export const MistValue = ({
  icon,
  value,
  long,
  hideNullish,
  green,
  highlightZero,
  ...props
}: Props): JSX.Element | null => {
  const currencySymbol = useSelector((s: RootState) => s.node.currency.currency_symbol);

  if (hideNullish && (value === undefined || value === null)) return null;

  const classes = classNames("mist-value", props.className, {
    "mist-value-green": green,
    "mist-value-zero": highlightZero && value === 0
  });

  return (
    <span {...props} className={classes}>
      {icon || ((currencySymbol || "KST") === "KST" && <MistSymbol />)}
      <span className="mist-value-amount">{(value || 0).toLocaleString()}</span>
      {long && <span className="mist-currency-long">{currencySymbol || "KST"}</span>}
    </span>
  );
};
