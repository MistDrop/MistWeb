// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { createReducer } from "typesafe-actions";
import {
  incrementNameTableLock, decrementNameTableLock, setTip
} from "@actions/MiscActions";

export interface State {
  readonly nameTableLock: number;
  readonly tip: number;
}

const initialState: State = {
  nameTableLock: 0,
  tip: localStorage.getItem("tip") !== null
    ? parseInt(localStorage.getItem("tip")!)
    : -1
};

export const MiscReducer = createReducer(initialState)
  .handleAction(incrementNameTableLock, (state, _) => ({
    ...state,
    nameTableLock: state.nameTableLock + 1
  }))
  .handleAction(decrementNameTableLock, (state, _) => ({
    ...state,
    nameTableLock: state.nameTableLock - 1
  }))
  .handleAction(setTip, (state, { payload }) => ({
    ...state, tip: payload
  }));
