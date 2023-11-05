// Copyright (c) 2020-2021 Drew Lemmy
// This file is part of KristWeb 2 under AGPL-3.0.
// Full details: https://github.com/MistDrop/MistWeb/blob/master/LICENSE.txt
import { Switch, Route, Redirect } from "react-router-dom";
import { ErrorBoundary } from "@global/ErrorBoundary";

import { DashboardPage } from "@pages/dashboard/DashboardPage";
import { WalletsPage } from "@pages/wallets/WalletsPage";
import { ContactsPage } from "@pages/contacts/ContactsPage";

import { SendTransactionPage } from "@pages/transactions/send/SendTransactionPage";
import { RequestPage } from "@pages/transactions/request/RequestPage";

import { AddressPage } from "@pages/addresses/AddressPage";
import { BlocksPage } from "@pages/blocks/BlocksPage";
import { BlockPage } from "@pages/blocks/BlockPage";
import { TransactionsPage, ListingType as TXListing } from "@pages/transactions/TransactionsPage";
import { TransactionPage } from "@pages/transactions/TransactionPage";
import { NamesPage, ListingType as NamesListing } from "@pages/names/NamesPage";
import { NamePage } from "@pages/names/NamePage";

import { SettingsPage } from "@pages/settings/SettingsPage";
import { SettingsTranslations } from "@pages/settings/translations/SettingsTranslations";

import { WhatsNewPage } from "@pages/whatsnew/WhatsNewPage";
import { CreditsPage } from "@pages/credits/CreditsPage";

import { DevPage } from "@pages/dev/DevPage";

import { NotFoundPage } from "@pages/NotFoundPage";

interface AppRoute {
  path: string;
  name: string;
  component?: React.ReactNode;
}

export const APP_ROUTES: AppRoute[] = [
  { path: "/", name: "dashboard", component: <DashboardPage /> },

  // My wallets, etc
  { path: "/wallets", name: "wallets", component: <WalletsPage /> },
  { path: "/contacts", name: "contacts", component: <ContactsPage /> },
  { path: "/me/transactions", name: "myTransactions",
    component: <TransactionsPage listingType={TXListing.WALLETS} /> },
  { path: "/me/names", name: "myNames",
    component: <NamesPage listingType={NamesListing.WALLETS} /> },

  // Payments
  { path: "/send", name: "sendTransaction", component: <SendTransactionPage /> },
  { path: "/request", name: "request", component: <RequestPage /> },

  // Network explorer
  { path: "/network/addresses/:address", name: "address", component: <AddressPage /> },
  { path: "/network/addresses/:address/transactions", name: "addressTransactions",
    component: <TransactionsPage listingType={TXListing.NETWORK_ADDRESS} /> },
  { path: "/network/addresses/:address/names", name: "addressNames",
    component: <NamesPage listingType={NamesListing.NETWORK_ADDRESS} /> },
  { path: "/network/blocks", name: "blocks", component: <BlocksPage /> },
  { path: "/network/blocks/lowest", name: "blocksLowest", component: <BlocksPage lowest /> },
  { path: "/network/blocks/:id", name: "block", component: <BlockPage /> },
  { path: "/network/transactions", name: "transactions",
    component: <TransactionsPage listingType={TXListing.NETWORK_ALL} /> },
  { path: "/network/transactions/:id", name: "transaction",
    component: <TransactionPage /> },
  { path: "/network/names", name: "networkNames",
    component: <NamesPage listingType={NamesListing.NETWORK_ALL} /> },
  { path: "/network/names/new", name: "networkNamesNew",
    component: <NamesPage listingType={NamesListing.NETWORK_ALL} sortNew={true} /> },
  { path: "/network/names/:name", name: "networkName",
    component: <NamePage /> },
  { path: "/network/names/:name/history", name: "nameHistory",
    component: <TransactionsPage listingType={TXListing.NAME_HISTORY} /> },
  { path: "/network/names/:name/transactions", name: "nameTransactions",
    component: <TransactionsPage listingType={TXListing.NAME_SENT} /> },
  { path: "/network/search/transactions/address", name: "searchTransactionsAddress",
    component: <TransactionsPage listingType={TXListing.SEARCH_ADDRESS} /> },
  { path: "/network/search/transactions/name", name: "searchTransactionsName",
    component: <TransactionsPage listingType={TXListing.SEARCH_NAME} /> },
  { path: "/network/search/transactions/metadata", name: "searchTransactionsMetadata",
    component: <TransactionsPage listingType={TXListing.SEARCH_METADATA} /> },

  // Settings
  { path: "/settings", name: "settings", component: <SettingsPage /> },
  { path: "/settings/debug", name: "settingsDebug" },
  { path: "/settings/debug/translations", name: "settings", component: <SettingsTranslations /> },

  { path: "/whatsnew", name: "whatsNew", component: <WhatsNewPage /> },
  { path: "/credits", name: "credits", component: <CreditsPage /> },

  // NYI and dev
  { path: "/mining", name: "mining", component: <NotFoundPage nyi /> },
  { path: "/network/statistics", name: "statistics", component: <NotFoundPage nyi /> },
  { path: "/dev", name: "dev", component: <DevPage /> }
];

export function AppRouter(): JSX.Element {
  return <Switch>
    {/* Render the matched route's page component */}
    {APP_ROUTES.map(({ path, component }, key) => (
      component && (
        <Route exact path={path} key={key}>
          {/* Try to catch errors on a route without crashing everything */}
          <ErrorBoundary name="app-router">
            {component}
          </ErrorBoundary>
        </Route>
      )
    ))}

    {/* Redirects from MistWeb v1 router */}
    <Redirect from="/overview"    to="/" />
    <Redirect from="/addressbook" to="/contacts" />
    <Redirect from="/friends"     to="/contacts" />
    <Redirect from="/address/:address"                to="/network/addresses/:address" />
    <Redirect from="/address/:address/transaction"    to="/network/addresses/:address/transactions" />
    <Redirect from="/address/:address/transactions"   to="/network/addresses/:address/transactions" />
    <Redirect from="/address/:address/name"           to="/network/addresses/:address/names" />
    <Redirect from="/address/:address/names"          to="/network/addresses/:address/names" />
    <Redirect from="/addresses/:address"              to="/network/addresses/:address" />
    <Redirect from="/addresses/:address/transaction"  to="/network/addresses/:address/transactions" />
    <Redirect from="/addresses/:address/transactions" to="/network/addresses/:address/transactions" />
    <Redirect from="/addresses/:address/name"         to="/network/addresses/:address/names" />
    <Redirect from="/addresses/:address/names"        to="/network/addresses/:address/names" />
    <Redirect from="/transaction"       to="/me/transactions" exact />
    <Redirect from="/transaction/make"  to="/send" />
    <Redirect from="/transaction/all"   to="/network/transactions" />
    <Redirect from="/transaction/:id"   to="/network/transactions/:id" />
    <Redirect from="/transactions"      to="/me/transactions" exact />
    <Redirect from="/transactions/make" to="/send" />
    <Redirect from="/transactions/all"  to="/network/transactions" />
    <Redirect from="/transactions/:id"  to="/network/transactions/:id" />
    <Redirect from="/block"         to="/network/blocks" exact />
    <Redirect from="/block/latest"  to="/network/blocks" />
    <Redirect from="/block/lowest"  to="/network/blocks/lowest" />
    <Redirect from="/block/:id"     to="/network/blocks/:id" />
    <Redirect from="/blocks"        to="/network/blocks" exact />
    <Redirect from="/blocks/latest" to="/network/blocks" />
    <Redirect from="/blocks/lowest" to="/network/blocks/lowest" />
    <Redirect from="/blocks/:id"    to="/network/blocks/:id" />
    <Redirect from="/name"        to="/me/names" exact />
    <Redirect from="/name/all"    to="/network/names" />
    <Redirect from="/name/:name"  to="/network/names/:name" />
    <Redirect from="/names"       to="/me/names" exact />
    <Redirect from="/names/all"   to="/network/names" />
    <Redirect from="/names/:name" to="/network/names/:name" />

    <Route path="*"><NotFoundPage /></Route>
  </Switch>;
}
