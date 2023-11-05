// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { useState, useEffect, useMemo } from "react";
import { Form, FormInstance } from "antd";

import { TFns } from "@utils/i18n";

import { Mode } from "./NameEditModal";

import { NamePicker } from "./NamePicker";
import { AddressPicker } from "@comp/addresses/picker/AddressPicker";
import { NameDataInput } from "./NameDataInput";

interface FormValues {
  names: string[];
  recipient?: string;
  data?: string;
}

interface Props {
  name?: string;
  data?: string | null;
  mode: Mode;

  submitting?: boolean;
  onSubmit: () => void;

  tFns: TFns;
}

interface NameEditFormHookResponse {
  form: JSX.Element;
  formInstance: FormInstance<FormValues>;
  resetFields: () => void;
}

export function useNameEditForm({
  name,
  data,
  mode,

  submitting,
  onSubmit,

  tFns
}: Props): NameEditFormHookResponse {
  const { t, tStr } = tFns;

  const [formInstance] = Form.useForm<FormValues>();

  // Used to filter out names owned by the recipient (for transfers)
  const [names, setNames] = useState<string[] | undefined>();
  const [recipient, setRecipient] = useState<string | undefined>();

  function onValuesChange(_: unknown, values: Partial<FormValues>) {
    setNames(values.names || undefined);
    setRecipient(values.recipient || undefined);
  }

  function resetFields() {
    formInstance.resetFields();
    setNames(undefined);
    setRecipient(undefined);
  }

  const initialValues: FormValues = useMemo(() => ({
    names: name ? [name] : [],

    // Start with an initial A record if this is the update name modal
    ...(mode === "update" && data ? { data } : {})
  }), [mode, name, data]);

  // If the initial values change, refresh the form
  useEffect(() => {
    if (!formInstance || !mode) return;
    formInstance.setFieldsValue(initialValues);
  }, [formInstance, mode, initialValues]);

  const form = <Form
    form={formInstance}
    layout="vertical"
    className={mode === "transfer"
      ? "name-transfer-form"
      : "name-update-form"}

    name={mode === "transfer" ? "nameTransfer" : "nameUpdate"}

    onValuesChange={onValuesChange}
    onFinish={onSubmit}
  >
    {/* Names */}
    <NamePicker
      formName="names"
      label={tStr("labelNames")}
      tabIndex={1}

      filterOwner={mode === "transfer" ? recipient : undefined}
      suppressUpdates={submitting}

      value={names}
      setValue={names => formInstance.setFieldsValue({ names })}

      multiple
      allowAll
    />

    {/* Display the correct input; an address picker for transfer recipients, or
      * a textbox for A records. */}
    {mode === "transfer"
      ? (
        // Transfer - Recipient
        <AddressPicker
          name="recipient"
          label={t("nameTransfer.labelRecipient")}
          tabIndex={2}

          value={recipient}
          suppressUpdates={submitting}

          noNames
          nameHint
        />
      )
      : (
        // Update - A record
        <NameDataInput />
      )}
  </Form>;

  return { form, formInstance, resetFields };
}
