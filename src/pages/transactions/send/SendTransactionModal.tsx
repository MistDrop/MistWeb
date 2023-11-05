// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { Dispatch, SetStateAction } from "react";
import { Modal, notification } from "antd";

import { useTranslation } from "react-i18next";
import { translateError } from "@utils/i18n";

import { useWallets, Wallet } from "@wallets";
import { NoWalletsModal } from "@comp/results/NoWalletsResult";

import { MistTransaction } from "@api/types";

import { useTransactionForm } from "./SendTransactionForm";
import { NotifSuccessContents, NotifSuccessButton } from "./Success";

interface Props {
  visible: boolean;
  setVisible: Dispatch<SetStateAction<boolean>>;

  from?: Wallet | string;
  to?: string;
}

export function SendTransactionModal({
  visible,
  setVisible,
  from,
  to
}: Props): JSX.Element {
  const { t } = useTranslation();

  // Grab a context to display a button in the success notification
  const [notif, contextHolder] = notification.useNotification();

  // Create the transaction form
  const { isSubmitting, triggerSubmit, triggerReset, txForm } = useTransactionForm({
    from,
    to,

    // Display a success notification when the transaction is made
    onSuccess(tx: MistTransaction) {
      notif.success({
        message: t("sendTransaction.successNotificationTitle"),
        description: <NotifSuccessContents tx={tx} />,
        btn: <NotifSuccessButton tx={tx} />
      });

      // Close when done
      closeModal();
    },

    // Display errors as notifications in the modal
    onError: err => notification.error({
      message: t("sendTransaction.errorNotificationTitle"),
      description: translateError(t, err, "sendTransaction.errorUnknown")
    })
  });

  // Don't open the modal if there are no wallets.
  const { addressList } = useWallets();
  const hasWallets = addressList?.length > 0;

  function closeModal() {
    triggerReset();
    setVisible(false);
  }

  return <>
    {hasWallets
      ? (
        <Modal
          visible={visible}

          title={t("sendTransaction.modalTitle")}

          onOk={triggerSubmit}
          okText={t("sendTransaction.modalSubmit")}
          okButtonProps={isSubmitting ? { loading: true } : undefined}

          onCancel={closeModal}
          cancelText={t("dialog.cancel")}
          destroyOnClose
        >
          {txForm}
        </Modal>
      )
      : (
        <NoWalletsModal
          type="sendTransaction"
          visible={visible}
          setVisible={setVisible}
        />
      )
    }

    {/* Context for success notification */}
    {contextHolder}
  </>;
}
