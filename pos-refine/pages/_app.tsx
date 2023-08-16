import {
  ThemedLayoutV2,
  ThemedSiderV2,
  notificationProvider,
} from "@refinedev/antd";
import { GitHubBanner, Refine } from "@refinedev/core";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,

} from "@refinedev/nextjs-router";
import type { NextPage } from "next";
import { AppProps } from "next/app";
import { Routes, Route } from "react-router-dom";
import { Header } from "@components/header";
import { ColorModeContextProvider } from "@contexts";
import "@refinedev/antd/dist/reset.css";
import dataProvider from "@refinedev/simple-rest";
import { HeadlessInferencer } from "@refinedev/inferencer/headless";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BaseURL } from "src/baseURl";
import { useForm } from "@refinedev/antd";
import axios, { AxiosInstance } from "axios";
import { axiosInstance } from "@refinedev/simple-rest";
import { useEffect, useState } from "react";
import { checkPermission } from "actions/auth";

const API_URL = BaseURL;

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  noLayout?: boolean;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};


function MyApp({ Component, pageProps }: AppPropsWithLayout): JSX.Element {

  const [menuUser, setMenuUser] = useState(false)
  const [menuRole, setMenuRole] = useState(false)
  const [menuPermission, setMenuPermission] = useState(false)
  const [menuSupplier, setMenuSupplier] = useState(false)
  const [menuCustomer, setMenuCustomer] = useState(false)
  const [menuCategory, setMenuCategory] = useState(false)
  const [menuProduct, setMenuProduct] = useState(false)
  const [menuOrder, setMenuOrder] = useState(false)
  const [menuSale, setMenuSale] = useState(false)
  const [menuAddSale, setMenuAddSale] = useState(false)

  useEffect(() => {

    async function getPermission() {
      const resMenuUser = await checkPermission("user list")
      console.log("resMenuUser",resMenuUser)
      setMenuUser(resMenuUser)

      const resMenuRole = await checkPermission("role list")
      setMenuRole(resMenuRole)

      const resMenuPermission = await checkPermission("permission list")
      setMenuPermission(resMenuPermission)

      const resMenuSupplier = await checkPermission("supplier list")
      setMenuSupplier(resMenuSupplier)

      const resMenuCustomer = await checkPermission("Customer list")
      setMenuCustomer(resMenuCustomer)

      const resMenuCategory = await checkPermission("category list")
      setMenuCategory(resMenuCategory)

      const resMenuProduct = await checkPermission("product list")
      setMenuProduct(resMenuProduct)

      const resMenuSale = await checkPermission("sale list")
      setMenuSale(resMenuSale)

      const resMenuAddSale = await checkPermission("sale add")
      setMenuAddSale(resMenuAddSale)
    }

    getPermission()

  })


  const renderComponent = () => {
    if (Component.noLayout) {
      return <Component {...pageProps} />;
    }

    return (
      <ThemedLayoutV2
        Title={() => <h1 style={{textAlign:"center", fontSize:"25px", color:"#61a3ff", paddingLeft:"24px", paddingTop:"10px"}} ><span style={{letterSpacing:"-2px"}} >Mini</span><span style={{fontWeight:"800"}} >POS</span></h1>}
        Header={() => <Header sticky />}
        Sider={(props) => <ThemedSiderV2 {...props} fixed />}
      >
        <Component {...pageProps} />
      </ThemedLayoutV2>
    );
  };


  return (
    <>

      <ToastContainer />
      <RefineKbarProvider>
        <ColorModeContextProvider>

          <Refine
            routerProvider={routerProvider}
            dataProvider={dataProvider(API_URL)}
            notificationProvider={notificationProvider}
            options={{
              syncWithLocation: true,
              warnWhenUnsavedChanges: true,
              projectId: "1yY3me-cM7gyv-kAJv0B",
            }}
            resources={[

              {
                meta: { label: "Dashboard" },
                name: "dashboard/",
                list: "/dashboard",
              },
              {
                name: "user",
                list: menuUser ? "/user" : ""
              },
              {
                meta: {
                  label: "Role",
                },
                name: "role/",
                list: menuRole ? "/role" : "",
                create: "/role/create",
                edit: "/role/edit/:id",
                show: "/role/show/:id"

              },
              {
                meta: { label: "Permission" },
                name: "permission/",
                list: menuPermission ? "/permission" : "",
                create: "/permission/create",
                edit: "/permission/edit/:id",
                show: "/permission/show/:id"

              }

              ,
              {
                meta: { label: "Supplier" },
                name: "supplier/",
                list: menuSupplier ? "/supplier" : "",
                create: "/supplier/create",
                edit: "/supplier/edit/:id",
                show: "/supplier/show/:id"

              },
              {
                meta: { label: "Customer" },
                name: "customer/",
                list: menuCustomer ? "/customer" : "",
                create: "/customer/create",
                edit: "/customer/edit/:id",
                show: "/customer/show/:id"

              },
              {
                meta: { label: "Category" },
                name: "category/",
                list: menuCategory ? "/category" : "",
                create: "/category/create",
                edit: "/category/edit/:id",
                show: "/category/show/:id"

              },
              {
                meta: { label: "Product" },
                name: "product/",
                list: menuProduct ? "/product" : "",
                create: "/product/create",
                edit: "/product/edit/:id",
                show: "/product/show/:id"

              },
              {
                meta: { label: "Sale" },
                name: "sale/",
                list: menuAddSale ? "/sale" : "",
                show: "/sales-report/show/:id"
              },
              {
                meta: { label: "Sales report" },
                name: "sales-report/",
                list: menuSale ? "/sales-report" : "",
              },
            ]}
          >
            {renderComponent()}

            <RefineKbar />


            <UnsavedChangesNotifier />
            <DocumentTitleHandler />
          </Refine>


        </ColorModeContextProvider>
      </RefineKbarProvider>
    </>
  );
}

export default MyApp;
