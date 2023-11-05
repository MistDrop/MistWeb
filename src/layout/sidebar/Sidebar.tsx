// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { useState, useEffect, useMemo, Dispatch, SetStateAction } from "react";
import { Layout, Menu, MenuItemProps } from "antd";
import { HomeOutlined, WalletOutlined, TeamOutlined, BankOutlined, TagOutlined, TagsOutlined, CreditCardOutlined, BlockOutlined } from "@ant-design/icons";

import { TFunction, useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { ServiceWorkerCheck } from "./ServiceWorkerCheck";
import { SidebarTotalBalance } from "./SidebarTotalBalance";
import { SidebarFooter } from "./SidebarFooter";

import { ConditionalLink } from "@comp/ConditionalLink";

import "./Sidebar.less";

const { Sider } = Layout;

type SidebarItemProps = MenuItemProps & {
  to: string;
  icon: React.ReactNode;
  name: string;

  nyi?: boolean;

  group?: "global" | "personal";
}
const sidebarItems: SidebarItemProps[] = [
  { icon: <HomeOutlined />,   name: "dashboard",    to: "/" },
  { group: "personal", icon: <WalletOutlined />,      name: "myWallets",      to: "/wallets" },
  { group: "personal", icon: <TeamOutlined />,        name: "addressBook",    to: "/contacts" },
  { group: "personal", icon: <CreditCardOutlined />,  name: "myTransactions", to: "/me/transactions" },
  { group: "personal", icon: <TagOutlined />,         name: "myNames",        to: "/me/names" },

  { group: "global", icon: <BankOutlined />,  name: "allTransactions", to: "/network/transactions" },
  { group: "global", icon: <TagsOutlined />,  name: "allNames",        to: "/network/names" },
  { group: "global", icon: <BlockOutlined />,  name: "blocks",        to: "/network/blocks" },
];

function getSidebarItems(t: TFunction, group?: string) {
  return sidebarItems
    .filter(i => i.group === group)
    .map(i => (
      <Menu.Item key={i.to} icon={i.icon} className={i.nyi ? "nyi" : ""}>
        <ConditionalLink to={i.to} matchTo matchExact>
          {t("sidebar." + i.name)}
        </ConditionalLink>
      </Menu.Item>
    ));
}

interface Props {
  collapsed: boolean;
  setCollapsed: Dispatch<SetStateAction<boolean>>;
}

export function Sidebar({
  collapsed,
  setCollapsed
}: Props): JSX.Element {
  const { t } = useTranslation();

  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState<string | undefined>();

  useEffect(() => {
    setSelectedKey(sidebarItems.find(i => i.to === "/"
      ? location.pathname === "/"
      : location.pathname.startsWith(i.to))?.to);
  }, [location.pathname]);

  useEffect(() => {
    // Close the sidebar if we switch page
    setCollapsed(true);
  }, [setCollapsed, location.pathname]);

  const memoSidebar = useMemo(() => (
    <Sider
      width={240}
      className={"site-sidebar " + (collapsed ? "collapsed" : "")}
    >
      {/* Service worker update checker, which may appear at the top of the
        * sidebar if an update is available. */}
      <ServiceWorkerCheck />

      {/* Total balance */}
      <SidebarTotalBalance />

      {/* Menu items */}
      <Menu theme="dark" mode="inline" selectedKeys={selectedKey ? [selectedKey] : undefined}>
        {getSidebarItems(t)}

        <Menu.ItemGroup key="g1" title={t("sidebar.personal")}>
          {getSidebarItems(t, "personal")}
        </Menu.ItemGroup>

        <Menu.ItemGroup key="g1" title={t("sidebar.global")}>
          {getSidebarItems(t, "global")}
        </Menu.ItemGroup>
      </Menu>

      {/* Credits footer */}
      <SidebarFooter />
    </Sider>
  ), [t, collapsed, selectedKey]);

  return memoSidebar;
}
