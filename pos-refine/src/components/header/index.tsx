
import type { RefineThemedLayoutV2HeaderProps } from "@refinedev/antd";
import { useGetIdentity } from "@refinedev/core";
import {
  Layout as AntdLayout,
  Avatar,
  Button,
  Space,
  Switch,
  Typography,
  theme,
} from "antd";
import React, { useCallback, useContext, useEffect, useState, useRef } from "react";
import { ColorModeContext } from "../../contexts";
import { getAuthUser } from "actions/auth";
import dynamic from 'next/dynamic'
import { logout } from "actions/auth";
import { useRouter } from "next/router";
const Name = dynamic(() => import('./name'), { ssr: false })
const { Text } = Typography;
const { useToken } = theme;


type IUser = {
  id: number;
  name: string;
  avatar: string;
};

export const Header: React.FC<RefineThemedLayoutV2HeaderProps> = ({
  sticky,
}) => {
  const { token } = useToken();
  const { data: user } = useGetIdentity<IUser>();
  const { mode, setMode } = useContext(ColorModeContext);
  const [fullname, setFullname] = useState<any>("")
  const fullnameRef = useRef<string | null>('');
  const router = useRouter()
  const headerStyles: React.CSSProperties = {
    backgroundColor: token.colorBgElevated,
    display: "flex",
    justifyContent: "flex-end",
    alignItems: "center",
    padding: "0px 24px",
    height: "64px",
  };

  if (sticky) {
    headerStyles.position = "sticky";
    headerStyles.top = 0;
    headerStyles.zIndex = 1;
  }

  if (typeof window !== "undefined") {
    fullnameRef.current = window.localStorage.getItem('username')
  }


  const onLogout = async () => {
    const res = await logout()
    console.log("res.data.success",res.data.success)
    if(res.data.success === true){
      router.push("/login")
    }
  }


  return (
    <AntdLayout.Header style={headerStyles}>
      <Space>
        {/* <Switch
          checkedChildren="🌛"
          unCheckedChildren="🔆"
          onChange={() => setMode(mode === "light" ? "dark" : "light")}
          defaultChecked={mode === "dark"}
        /> */}

        <h3 style={{ transition: "opacity 0.3s ease-in-out" }} >Welcome, <Name /> </h3>
        <Button onClick={onLogout} type="primary"> Logout </Button>
        {(user?.name || user?.avatar) && (
          <Space style={{ marginLeft: "8px" }} size="middle">
            {user?.name && <Text strong>{user.name}</Text>}
            {user?.avatar && <Avatar src={user?.avatar} alt={user?.name} />}
          </Space>
        )}
      </Space>
    </AntdLayout.Header>
  );
};
