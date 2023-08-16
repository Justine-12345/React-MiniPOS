import { WelcomePage } from "@refinedev/core";
import { login } from "actions/auth";
import { useRouter } from "next/router";
import { useEffect } from "react";
export default function Index() {

  const router = useRouter()

  useEffect(() => {
    router.push("/login")
  }, [])

  return <>
    <div></div>
  </>;
}

Index.noLayout = true;
