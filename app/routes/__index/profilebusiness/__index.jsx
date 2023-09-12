import React from "react";
import { Outlet, Link, useLocation, useOutletContext } from "react-router-dom";
import { Layout, Menu } from "antd";
const { Content, Sider } = Layout;
import {
  ShoppingCartOutlined,
  LogoutOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { getJwt, getUser } from "~/hooks/cookie";
import { useLoaderData } from "@remix-run/react";
import { redirect } from "@remix-run/node";

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

export const loader = async ({ request }) => {
  const jwt = getJwt(request.headers.get("cookie"));
  const user = await getUser(
    jwt,
    process.env.REACT_APP_API,
    process.env.REACT_APP_API_KEY
  );

  if (!user.userId) {
    return redirect("/uyelik");
  }

  const data = {
    API: process.env.REACT_APP_API,
    API_KEY: process.env.REACT_APP_API_KEY,
    API_IMAGES: process.env.REACT_APP_IMAGES,
  };
  return data;
};

const ProfileBusiness = () => {
  const [existUser, handleChange] = useOutletContext();
  const { API, API_KEY, API_IMAGES } = useLoaderData();
  const location = useLocation();
  const origin = location.pathname.split("/").pop();

  const items = [
    getItem(<Link to="/profilebusiness">Gösterge</Link>,"profilebusiness"),
    getItem(<Link to="/profilebusiness/mybusinesses">İşletmelerim</Link>, "mybusinesses"),
    getItem(<Link to="/">Çıkış Yap</Link>),
  ];

  return (
    <div className="mt-36">
      <div>
        <Layout>
          <Sider className=" bg-gray-100" width={250}>
            <div className="bg-red-500 text-white py-4 px-2 flex items-center">
              <img
                className="rounded-full h-16 w-16 p-2"
                src={`${API_IMAGES}user/${existUser && existUser.userPhoto}`}
                alt=""
                loading="lazy"
              />

              <div className="text-white">
                <p className="">Hoşgeldin</p>
                <p className="font-semibold text-xs">
                  {existUser.name + " " + existUser.surname}
                </p>
              </div>
            </div>
            <Menu
              className="pb-10 text-[13px] userNav"
              theme="light"
              selectedKeys={[origin]}
              mode="inline"
              items={items}
            />
          </Sider>
          <Layout className="bg-white">
            <Content style={{ margin: "0 0px" }}>
              <div style={{ padding: 20, minHeight: 360 }}>
                <Outlet />
              </div>
            </Content>
          </Layout>
        </Layout>
      </div>
    </div>
  );
};

export default ProfileBusiness;
