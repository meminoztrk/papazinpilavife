import React, { useEffect } from "react";
import { useForm } from "sunflower-antd";
import { Form, Rate } from "antd";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { userPrefs } from "./../../hooks/cookie";
import {
  BsGeoAltFill,
  BsThreeDots,
  BsHeart,
  BsBookmark,
  BsCalendar,
  BsCursor,
  BsAspectRatio
} from "react-icons/bs";
import SwiperProfile from "~/components/SwiperProfile";


export const loader = async () => {
  const data = {
    API: process.env.REACT_APP_API,
    API_KEY: process.env.REACT_APP_API_KEY,
  };
  console.log(data);
  return data;
};

const uyelik = () => {
  const [existUser,handleChange] = useOutletContext();
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const { API, API_KEY } = useLoaderData();

  useEffect(() => { 
    // console.log(existUser);
    // !existUser && navigate("/");
  }, []);

  const login = async (username, password) => {
    await fetch(API + "/User/login", {
      method: "POST",
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        username,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        userPrefs(data.token);
        navigate("/admin");
      });
  };

  const { formProps, formLoading } = useForm({
    form,
    async submit({ username, password }) {
      await login(username, password);
      return "ok";
    },
  });

  return (
    <div className="mt-36">
      <div className="bg-white rounded p-6">
        <div className="flex gap-x-4">
          <div className="rounded-full h-32 w-32">
            <img
              className="rounded-full"
              src="https://s3-media0.fl.yelpcdn.com/photo/-mt3HnF5OoeIzmLRhMjMaA/ls.jpg"
            />
          </div>
          <div className="flex flex-col">
            <span className=" font-black text-2xl">Ahmet B.</span>
            <span className="flex items-center">
              <BsGeoAltFill className="text-gray-500 mr-1" />
              Osmangazi, Bursa
            </span>
            <div className="flex space-x-6 pt-6">
              <div className="flex flex-col">
                <span className="font-semibold text-base tracking-tight">
                  Yorum
                </span>
                <span className="tracking-tight text-[17px]">18</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-base tracking-tight">
                  Fotoğraf
                </span>
                <span className="tracking-tight text-[17px]">24</span>
              </div>
              <div className="flex flex-col">
                <span className="font-semibold text-base tracking-tight">
                  Takipçi
                </span>
                <span className="tracking-tight text-[17px]">2</span>
              </div>
            </div>
          </div>
          <div className="ml-auto mr-2">
            <div>
              <BsThreeDots className="text-2xl hover:text-gray-500 cursor-pointer" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex mt-5 space-x-5">
        <div className="w-1/4">
          <div className="p-4 bg-white">
            <div className="pt-2 font-semibold text-gray-500 space-y-2">
              <span className="flex items-center bg-gray-100 p-2 rounded-lg">
                <BsCalendar className="text-gray-500 mr-2 text-lg" />
                Profil
              </span>
              <span className="flex items-center p-2 rounded-lg">
                <BsCursor className="text-gray-500 mr-2 text-lg" />
                İncelemeler
              </span>
              <span className="flex items-center p-2 rounded-lg">
                <BsAspectRatio className="text-gray-500 mr-2 text-lg" />
                Fotoğraflar
              </span>
            </div>
          </div>
        </div>
        <div className="w-2/4 space-y-4">
          <div className="bg-white w-full">
            <div className="p-4">
              <div className="flex gap-x-3">
                <img
                  className="w-16 h-16 rounded-lg"
                  src="https://media-cdn.tripadvisor.com/media/photo-s/24/e8/fe/a3/oztat-kebap.jpg"
                />
                <div className="flex-col flex">
                  <span className="text-blue-500">Yahyabey Kebap Pide</span>
                  <span className="text-xs flex items-center">
                    <BsGeoAltFill className="text-gray-500 mr-1" /> Alanya,
                    Türkiye
                  </span>
                  <span className="text-xs pt-2 text-gray-400">
                    22.08.2023 tarihinde yorum yapıldı.
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <Rate
                  className="text-[15px] text-red-500 font-bold"
                  disabled
                  defaultValue={4}
                />
              </div>
              <div className="pt-1">
                Ailece tatil için gittiğimiz alanyada bazı restorant ta yemek
                yedik turizm bölgesi olduğu için bildiğiniz gibi insanların
                önüne yemekleri koyduklarında hersey bitiyor bir arkadaşın
                tavsiyesi üzerine öz tat restorant ta gittik hem yemekleri hemde
                çalışanları o kadar samimi sanki kendi evinizdeymis gibi his
                ediyorsunuz hele bir tepsi kebabı yedik hayatımda yediğim en
                güzel tepsi kebabiydi sizde ailenizle birlikte güzel bir tatil
                geçirmek için mutlaka öz tat restorantti görmenizi öneririm
              </div>
            </div>
            <div className="relative">
              <SwiperProfile />
            </div>
            <div className="p-4 flex items-center gap-x-3 text-xs">
              <button className="flex items-center gap-x-1 hover:text-red-500">
                <BsHeart />
                Beğen
              </button>
              <button className="flex items-center gap-x-1 hover:text-red-500">
                <BsBookmark />
                Kaydet
              </button>
            </div>
          </div>

          <div className="bg-white w-full">
            <div className="p-4">
              <div className="flex gap-x-3">
                <img
                  className="w-16 h-16 rounded-lg"
                  src="https://media-cdn.tripadvisor.com/media/photo-s/24/e8/fe/a3/oztat-kebap.jpg"
                />
                <div className="flex-col flex">
                  <span className="text-blue-500">Yahyabey Kebap Pide</span>
                  <span className="text-xs flex items-center">
                    <BsGeoAltFill className="text-gray-500 mr-1" /> Alanya,
                    Türkiye
                  </span>
                  <span className="text-xs pt-2 text-gray-400">
                    22.08.2023 tarihinde yorum yapıldı.
                  </span>
                </div>
              </div>
              <div className="pt-2">
                <Rate
                  className="text-[15px] text-red-500 font-bold"
                  disabled
                  defaultValue={4}
                />
              </div>
              <div className="pt-1">
                Ailece tatil için gittiğimiz alanyada bazı restorant ta yemek
                yedik turizm bölgesi olduğu için bildiğiniz gibi insanların
                önüne yemekleri koyduklarında hersey bitiyor bir arkadaşın
                tavsiyesi üzerine öz tat restorant ta gittik hem yemekleri hemde
                çalışanları o kadar samimi sanki kendi evinizdeymis gibi his
                ediyorsunuz hele bir tepsi kebabı yedik hayatımda yediğim en
                güzel tepsi kebabiydi sizde ailenizle birlikte güzel bir tatil
                geçirmek için mutlaka öz tat restorantti görmenizi öneririm
              </div>
            </div>
            <div className="relative">
              <SwiperProfile />
            </div>
            <div className="p-4 flex items-center gap-x-3 text-xs">
              <button className="flex items-center gap-x-1 hover:text-red-500">
                <BsHeart />
                Beğen
              </button>
              <button className="flex items-center gap-x-1 hover:text-red-500">
                <BsBookmark />
                Kaydet
              </button>
            </div>
          </div>
        </div>
        <div className="w-1/4">
          <div className="p-4 bg-white h-40">
            <div className="text-xs text-gray-500 space-y-2">
              <span className="flex items-center">
                <BsCalendar className="text-gray-500 mr-1" />
                22.08.2023 tarihinde katıldı.
              </span>
              <span className="flex items-center">
                <BsGeoAltFill className="text-gray-500 mr-1" />
                Osmangazi, Bursa
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default uyelik;
