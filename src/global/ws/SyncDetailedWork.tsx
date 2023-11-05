// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { useEffect } from "react";

import { useSelector } from "react-redux";
import { RootState } from "@store";
import * as nodeActions from "@actions/NodeActions";

import { store } from "@app";

import * as api from "@api";
import { MistWorkDetailed } from "@api/types";

import { criticalError } from "@utils";

import Debug from "debug";
const debug = Debug("mistweb:sync-work");

export async function updateDetailedWork(): Promise<void> {
  debug("updating detailed work");
  const data = await api.get<MistWorkDetailed>("work/detailed");

  debug("work: %d", data.work);
  store.dispatch(nodeActions.setDetailedWork(data));
}

/** Sync the detailed work with the Mist node on startup. */
export function SyncDetailedWork(): JSX.Element | null {
  const { lastBlockID } = useSelector((s: RootState) => s.node);

  useEffect(() => {
    updateDetailedWork().catch(criticalError);
  }, [lastBlockID]);

  return null;
}
