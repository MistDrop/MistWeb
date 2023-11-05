// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { Input } from "antd";

/// Fake username field for master password inputs, to trick autofill.
export function FakeUsernameInput(): JSX.Element {
  return <Input
    type="username"
    id="username" name="username"
    value="Master password" /* Do not translate */
    style={{ position: "absolute", pointerEvents: "none", opacity: 0 }}
  />;
}
