import React from "react";
import "./App.scss";

import { MainLayout } from "../layouts/main";

import { StorageManager } from "./StorageManager";
import { kristService } from "@krist/KristConnectionService";

import packageJson from "@/package.json";

kristService().connect(packageJson.defaultSyncNode) // TODO
  .catch(console.error);

export const App = (): JSX.Element => (
  <>
    <MainLayout />
    <StorageManager />
  </>
);
