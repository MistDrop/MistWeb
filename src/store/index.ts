// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { ActionType, StateType } from "typesafe-actions";

export type Store = StateType<typeof import("@app").store>;
export type RootAction = ActionType<typeof import("./actions/index").default>;
export type RootState = StateType<typeof import("./reducers/RootReducer").default>;
