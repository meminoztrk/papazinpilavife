import { Outlet } from "@remix-run/react";
import React, { useState, useEffect } from 'react'
import { Layout, Menu, Breadcrumb,Badge,Avatar } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useLoaderData } from '@remix-run/react';
import {
  BuildOutlined,
  MediumOutlined,
  PieChartOutlined,
  BookOutlined,
  FileOutlined,
  TeamOutlined,
  ArrowLeftOutlined,
  PictureOutlined,
  EditOutlined,
  PlusOutlined,
  SettingOutlined,
  CommentOutlined
} from '@ant-design/icons';
const { Header, Content, Footer, Sider } = Layout;
import { getUser, getJwt, removeToken } from './../hooks/cookie';
import { redirect } from '@remix-run/node';


function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}


export const loader = async ({ request }) => {
  const jwt = getJwt(request.headers.get("cookie"))
  const data = await getUser(jwt,process.env.REACT_APP_API,process.env.REACT_APP_API_KEY);
  if(data.userId){ return data }else{ return redirect("/")}
}

export default function Admin() {
  const user = useLoaderData()
  const [collapse, setCollapse] = useState(false)
  const location = useLocation();
  const origin = location.pathname.split("/").pop();
  let navigate = useNavigate();

  const items = [
    getItem(<Link to="/admin">Gösterge Paneli</Link>, 'admin', <PieChartOutlined />),
    getItem(<Link to="/admin/kategoriler">Kategoriler</Link>, 'kategoriler', <BuildOutlined />),
    getItem('Haber', 'haber', <BookOutlined />, [
      getItem(<Link to="/admin/haberler">Haberler</Link>, 'haberler',<BookOutlined/>),
      getItem(<Link to="/admin/haberler/yenihaber">Haber Ekle</Link>, 'yenihaber', <PlusOutlined/>),
    ]),
    getItem('Köşe Yazısı', 'koseyazisi', <EditOutlined />, [
      getItem(<Link to="/admin/koseyazilari">Köşe Yazıları</Link>, 'koseyazilari',<BookOutlined/>),
      getItem(<Link to="/admin/koseyazilari/yenikoseyazisi">Yazı Ekle</Link>, 'yenikoseyazisi', <PlusOutlined/>),
    ]),
    getItem(<Link to="/admin/yorumlar">Yorumlar</Link>, 'yorumlar', <Badge dot={true}><CommentOutlined className="text-gray-400" /></Badge>),
    getItem(<Link to="/admin/kimlik">Kimlik</Link>, 'kimlik', <MediumOutlined />),
    getItem(<Link to="/admin/yazarlar">Yazarlar</Link>, 'yazarlar', <TeamOutlined />),
    getItem(<Link to="/admin/galeri">Galeri</Link>, 'galeri', <PictureOutlined />),
    getItem(<Link to="/admin/dosyalar">Dosyalar</Link>, 'dosyalar', <FileOutlined />),
    getItem(<Link to="/admin/ayarlar">Ayarlar</Link>, 'ayarlar', <SettingOutlined />),

    getItem(<Link to="/">Siteye Dön</Link>, 'aaa', <ArrowLeftOutlined />)
  ];

  return (
    <div>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider collapsible collapsed={collapse} onCollapse={() => setCollapse(!collapse)}>
          <div className='img'>
            <div className="logo" />
          </div>

          <Menu theme="dark" selectedKeys={[origin]} mode="inline" items={items} />
        </Sider>
        <Layout className="site-layout" style={{ width:'1500px'}}>
          <Header className="bg-white">
            <div className="flex justify-end">
              {user.username}
              <div onClick={()=>{removeToken();navigate("/")}} className="cursor-pointer px-10">
                LOGOUT
              </div>
            </div>
          </Header>
          <Content style={{ margin: '0 16px' }}>
            <Breadcrumb style={{ margin: '16px 0' }}>
              <Breadcrumb.Item>Admin</Breadcrumb.Item>
              <Breadcrumb.Item>Admin</Breadcrumb.Item>
            </Breadcrumb>
            <div className="bg-white" style={{ padding: 24, minHeight: 360 }}>
              <Outlet context={[user, origin]} />
            </div>
          </Content>
          <Footer style={{ textAlign: 'center' }}>Diyanet Gönüllüleri Admin Paneli</Footer>
        </Layout>
      </Layout>
    </div>
  )
}