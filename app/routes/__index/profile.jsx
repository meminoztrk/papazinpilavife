import React from "react";
import { useForm } from "sunflower-antd";
import { Checkbox, Form, Input } from "antd";
import { AlertFilled, UserOutlined } from "@ant-design/icons";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useLoaderData } from "@remix-run/react";
import { userPrefs } from "./../../hooks/cookie";
import { BsGeoAltFill, BsThreeDots } from "react-icons/bs";
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
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const { API, API_KEY } = useLoaderData();
  
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
        <div className="w-1/4 p-4 bg-white">01</div>
        <div className="w-2/4">
          <div className="bg-white w-full h-full">
            <div className="p-6">BAŞLIK</div>
            <div className="relative">
              <SwiperProfile/>
            </div>
            <div className="p-6">BAŞLIK</div>
          </div>
        </div>
        <div className="w-1/4 h-14 bg-white">03</div>
      </div>
    </div>
  );
};

export default uyelik;
