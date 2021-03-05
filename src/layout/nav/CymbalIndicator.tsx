// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under GPL-3.0.
// Full details: https://github.com/tmpim/KristWeb2/blob/master/LICENSE.txt
import React from "react";
import Icon from "@ant-design/icons";

import { useSelector, shallowEqual } from "react-redux";
import { RootState } from "@store";
import { SettingsState } from "@utils/settings";

export const CymbalIconSvg = (): JSX.Element => (
  <svg width="1em" height="1em" fill="currentColor" viewBox="0 0 270.93 270.93">
    <path d="m135.47 32.809a9.525 9.525 0 0 0-9.5254 9.5254v8.3203c-28.322 3.1556-53.742 8.3582-72.736 14.764-10.188 3.4357-18.548 7.113-24.998 11.506-3.2249 2.1964-6.0254 4.5681-8.2656 7.6602-2.2402 3.0921-3.9328 7.318-3.4863 11.838 0.39672 4.0164 2.4293 7.422 4.8379 9.9629-0.24724 0.2559-0.54453 0.44177-0.7832 0.71093-2.5333 2.8569-4.6348 6.8957-4.6348 11.438 0 4.5418 2.1015 8.5826 4.6348 11.439 2.5333 2.8569 5.5533 4.9398 8.9785 6.8086 6.8504 3.7376 15.532 6.5766 26.008 8.9941 18.747 4.3262 43.317 6.9369 70.445 7.4648v75.359a9.525 9.525 0 0 0 9.5254 9.5254 9.525 9.525 0 0 0 9.5254-9.5254v-75.359c27.128-0.528 51.699-3.1386 70.445-7.4648 10.476-2.4176 19.157-5.2566 26.008-8.9941 3.4252-1.8688 6.4452-3.9517 8.9785-6.8086 2.5333-2.8569 4.6348-6.8976 4.6348-11.439 0-4.5418-2.1015-8.5806-4.6348-11.438-2.5333-2.8569-5.5533-4.9418-8.9785-6.8105-2.118-1.1556-4.4724-2.2014-6.9394-3.1992 2.9809-1.4822 5.7817-3.0166 8.2207-4.6777 3.2249-2.1964 6.0254-4.5661 8.2656-7.6582 2.2402-3.0921 3.9328-7.318 3.4863-11.838-0.44645-4.5198-2.9345-8.3337-5.7363-10.928s-6.0112-4.3715-9.6035-5.8945c-7.1846-3.0461-16.102-5.0184-26.766-6.3945-18.264-2.3571-41.699-2.6118-67.381-0.76367v-6.5977a9.525 9.525 0 0 0-9.5254-9.5254zm40.367 33.893c12.897-0.013673 24.489 0.64843 34.1 1.8887s17.271 3.1319 21.77 5.0391c1.2574 0.53312 1.5815 0.86168 2.291 1.3047-0.60923 0.57343-0.86268 0.96118-1.9922 1.7305-4.0382 2.7503-11.179 6.1047-20.361 9.2012-18.364 6.1929-44.957 11.67-74.613 14.6-29.656 2.9293-56.807 2.7598-76.027 0.2793-9.6104-1.2402-17.271-3.1319-21.77-5.0391-1.2587-0.53365-1.5833-0.86338-2.293-1.3066 0.60926-0.57353 0.86424-0.95896 1.9941-1.7285 4.0382-2.7503 11.179-6.1047 20.361-9.2012 16.67-5.6217 40.281-10.551 66.648-13.623v6.3535a9.525 9.525 0 0 0 9.5254 9.5254 9.525 9.525 0 0 0 9.5254-9.5254v-8.1621c10.767-0.80028 21.241-1.3258 30.842-1.3359zm27.408 41.49a9.525 9.525 0 0 0 0.45508 0.09961c2.6064 0.49639 5.0966 1.0178 7.457 1.5625 9.4419 2.1789 16.879 4.8142 21.168 7.1543 1.1996 0.65453 1.4897 1.0146 2.1523 1.5254-0.66264 0.51077-0.9527 0.87087-2.1523 1.5254-4.2889 2.34-11.726 4.9754-21.168 7.1543-18.884 4.3578-45.887 7.1953-75.688 7.1953-29.8 0-56.804-2.8375-75.688-7.1953-9.4419-2.1789-16.879-4.8142-21.168-7.1543-1.1996-0.65452-1.4897-1.0146-2.1523-1.5254 0.66264-0.51076 0.9527-0.87086 2.1523-1.5254 0.51732-0.28225 1.2237-0.58236 1.832-0.875 5.3651 1.4755 11.349 2.6305 18.117 3.5039 21.326 2.7522 49.502 2.8312 80.34-0.21484 24.1-2.3805 46.096-6.3451 64.342-11.23z" />
  </svg>
);
export const CymbalIcon = (props: any): JSX.Element =>
  <Icon component={CymbalIconSvg} {...props} />;

export function CymbalIndicator(): JSX.Element | null {
  const allSettings: SettingsState = useSelector((s: RootState) => s.settings, shallowEqual);
  const on = allSettings.walletFormats;

  return on ? <div className="site-header-element">
    <CymbalIcon className="site-header-cymbal" />
  </div> : null;
}
