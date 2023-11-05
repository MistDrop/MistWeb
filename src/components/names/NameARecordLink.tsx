// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import classNames from "classnames";

import { useNameSuffix, stripNameSuffix } from "@utils/mist";

import { MistNameLink } from "./MistNameLink";

import "./NameARecordLink.less";

interface Props {
  a?: string;
  className?: string;
}

export function NameARecordLink({ a, className }: Props): JSX.Element | null {
  const nameSuffix = useNameSuffix();

  if (!a) return null;

  const classes = classNames("name-a-record-link", className);

  // I don't have a citation for this other than a vague memory, but there are
  // (as of writing this) 45 names in the database whose A records begin with
  // `$` and then point to another name. There is an additional 1 name that
  // actually points to a domain, but still begins with `$` and ends with the
  // name suffix. 40 of these names end in the `.kst` suffix. Since I cannot
  // find any specification or documentation on it right now, I support both
  // formats. The suffix is stripped if it is present.
  if (a.startsWith("$")) {
    // Probably a name redirect
    const withoutPrefix = a.replace(/^\$/, "");
    const nameWithoutSuffix = stripNameSuffix(nameSuffix, withoutPrefix);

    return <MistNameLink
      className={classes}
      name={nameWithoutSuffix}
      text={a}
      neverCopyable
    />;
  }

  return <span className={classes}>
    {a}
  </span>;
}
