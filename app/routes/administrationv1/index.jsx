import {
  BsBuilding,
  BsChatLeftText,
  BsPerson,
  BsBicycle,
} from "react-icons/bs";
import { useOutletContext } from "react-router-dom";
import { Navigation, Pagination, Autoplay } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Area,
  AreaChart,
} from "recharts";
import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";

export const loader = async ({ request }) => {
  const req = await fetch(
    process.env.REACT_APP_API + "/Admin/GetDashboard",
    {
      method: "GET",
      headers: {
        ApiKey: process.env.REACT_APP_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  const dash = await req.json();
  return dash.data;
};

export default function Dashboard() {
  const dash = useLoaderData();
  const [existUser, handleChange] = useOutletContext();
  const [chartload, setChartload] = useState(false);
  

  useEffect(() => {
    setChartload(true);
  }, []);

  const sschart = [
    { name: "4 Gün Önce", value: 0 },
    { name: "3 Gün Önce", value: 0 },
    { name: "2 Gün Önce", value: 0 },
    { name: "Dün", value: 0 },
    { name: "Bugün", value: 0 },
  ];


  return (
    <div>
      <div className="flex flex-row space-x-4">
        <div className="w-1/2">
          <div className="block relative p-0 rounded  bg-gray-100">
            <div className="m-0 flex flex-wrap items-center flex-1 bg-no-repeat">
              <div className="w-2/3 p-4">
                <h1 className="text-lg font-semibold tracking-wide text-gray-600">
                  Hoşgeldin {existUser.name}!
                </h1>
                <span className="block">
                  Admin panelinde işletmeleri, incelemeleri ve kullanıcıları
                  rahatlıkla yönetebilirsin
                </span>
                <button className="p-2 rounded bg-red-500 mt-4 text-white">
                  İşletme Ekle
                </button>
              </div>
              <div className="w-1/3">
                <img
                  className="p-0 m-0 bg-no-repeat max-h-40"
                  src="https://sneat-vuetify-admin-template.vercel.app/assets/illustration-john-light-0061869a.png"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="w-1/2 flex items-center space-x-4">
          <div className="w-1/2 rounded  bg-gray-100 h-full">
            <div className="p-4">
              <div className="flex">
                <div className="p-4 bg-red-200 rounded-full">
                  <BsBuilding className="text-red-500" size={30} />
                </div>
              </div>
              <span className="block text-base pt-1">İşletme sayısı</span>
              <span className="block text-xl pt-1 font-bold tracking-tighter">
                {dash.businessCount}
              </span>
            </div>
          </div>

          <div className="w-1/2 rounded  bg-gray-100 h-full">
            <div className="p-4">
              <div className="flex">
                <div className="p-4 bg-green-200 rounded-full">
                  <BsChatLeftText className="text-green-500" size={30} />
                </div>
              </div>
              <span className="block text-base pt-1">İnceleme sayısı</span>
              <span className="block text-xl pt-1 font-bold tracking-tighter">
              {dash.commentCount}
              </span>
            </div>
          </div>

          <div className="w-1/2 rounded  bg-gray-100 h-full">
            <div className="p-4">
              <div className="flex">
                <div className="p-4 bg-blue-200 rounded-full">
                  <BsPerson className="text-blue-500" size={30} />
                </div>
              </div>
              <span className="block text-base pt-1">Kullanıcı sayısı</span>
              <span className="block text-xl pt-1 font-bold tracking-tighter">
              {dash.userCount}
              </span>
            </div>
          </div>

          <div className="w-1/2 rounded  bg-gray-100 h-full">
            <div className="p-4">
              <div className="flex">
                <div className="p-4 bg-purple-200 rounded-full">
                  <BsBicycle className="text-purple-500" size={30} />
                </div>
              </div>
              <span className="block text-base pt-1">Kurye sayısı</span>
              <span className="block text-xl pt-1 font-bold tracking-tighter">
                58
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <div className="w-1/2 block relative p-4 rounded  bg-gray-100">
          <h1 className="text-lg font-semibold tracking-wide text-gray-600">
            Açılan İşletmeler
          </h1>
          {chartload && (
            <ResponsiveContainer width="100%" height={250} >
              <AreaChart
                data={dash.businessChart}
                margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient id="colorisletme" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#FF4949" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#FF4949" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value) => [value, "İşletme"]} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#FF4949"
                  fillOpacity={1}
                  fill="url(#colorisletme)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="w-1/2 block relative p-4 rounded  bg-gray-100">
          <h1 className="text-lg font-semibold tracking-wide text-gray-600">
            Yapılan İncelemeler
          </h1>
          {chartload && (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={dash.commentChart}
                margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="colorinceleme"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#5BFFA0" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#5BFFA0" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value) => [value, "İnceleme"]} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#5BFFA0"
                  fillOpacity={1}
                  fill="url(#colorinceleme)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mt-4 flex items-center space-x-4">
        <div className="w-1/2 block relative p-4 rounded  bg-gray-100">
          <h1 className="text-lg font-semibold tracking-wide text-gray-600">
            Üye Olan Kullanıcılar
          </h1>
          {chartload && (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={dash.userChart}
                margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="coloruser"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#4DA9FF" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#4DA9FF" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip formatter={(value) => [value, "Kullanıcı"]} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#4DA9FF"
                  fillOpacity={1}
                  fill="url(#coloruser)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        <div className="w-1/2 block relative p-4 rounded  bg-gray-100">
          <h1 className="text-lg font-semibold tracking-wide text-gray-600">
            Kuryeler
          </h1>
          {chartload && (
            <ResponsiveContainer width="100%" height={250}>
              <AreaChart
                data={sschart}
                margin={{ top: 30, right: 30, left: 20, bottom: 5 }}
              >
                <defs>
                  <linearGradient
                    id="colorİşletme4"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8884d8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" />
                <YAxis />
                <CartesianGrid strokeDasharray="3 3" />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="#8884d8"
                  fillOpacity={1}
                  fill="url(#colorİşletme4)"
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  );
}
