// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { toHex } from "./";
import Debug from "debug";

// Set up custom debug formatters
// Booleans (%b)
Debug.formatters.b = (v: boolean) => v ? "true" : "false";
// Buffers as hex strings (%x)
Debug.formatters.x = (v: ArrayBufferLike | Uint8Array) => toHex(v);

import { showConsoleWarning } from "./consoleWarning";
showConsoleWarning();
