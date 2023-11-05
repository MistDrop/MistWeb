// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { FC } from "react";

import { Link, useRouteMatch } from "react-router-dom";

import "./styles/ConditionalLink.less";

interface Props {
  to?: string;
  condition?: boolean;

  replace?: boolean;

  matchTo?: boolean;
  matchPath?: string;
  matchExact?: boolean;
  matchStrict?: boolean;
  matchSensitive?: boolean;
}

export const ConditionalLink: FC<Props> = ({
  to,
  condition,

  replace,

  matchTo,
  matchPath,
  matchExact,
  matchStrict,
  matchSensitive,

  children, ...props
}): JSX.Element => {
  // Disable the link if we're already on that route
  const wantsCondition = condition !== undefined;
  const wantsMatch = matchTo || !!matchPath;

  const match = useRouteMatch(wantsMatch ? {
    path: matchTo && to ? to : matchPath,
    exact: matchExact,
    strict: matchStrict,
    sensitive: matchSensitive
  } : {});

  const active = (!wantsCondition || !!condition) && (!wantsMatch || !match);

  return active && to
    ? (
      <Link
        to={to}
        replace={replace}
        {...props}
      >
        {children}
      </Link>
    )
    : (
      <span className="conditional-link-disabled" {...props}>
        {children}
      </span>
    );
};
