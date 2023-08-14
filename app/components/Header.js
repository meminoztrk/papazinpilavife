import React, { useEffect, useState } from "react";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaCaretRight,
  FaCaretLeft,
} from "react-icons/fa";
import {
  AiOutlineUser,
  AiOutlineUserAdd,
  AiOutlineSearch,
  AiOutlineLoading,
  AiFillStar
} from "react-icons/ai";
import { LoadingOutlined } from "@ant-design/icons";
import { GiHamburgerMenu } from "react-icons/gi";
import { IoMdArrowDropdown } from "react-icons/io";
import { Popover, Spin, Button, Input, Select, Space } from "antd";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import { Link } from "@remix-run/react";
import cities from "../data/Cities.json";
import { getUserToken } from "../hooks/cookie";
import seoHelp from "./../hooks/seoHelp";
const { Search } = Input;

const vakitlerName = ["İmsak", "Güneş", "Öğle", "İkindi", "Akşam", "Yatsı"];
const date = new Date();

export const Header = ({ openModal, data }) => {
  const [navbar, setNavbar] = useState(false);
  const [swidth, setSwidth] = useState({ s1: 40, s2: 40, s3: 40 });
  const [nextVakit, setNextVakit] = useState({});
  const [userlink, setUserlink] = useState(false);
  const [loading, setLoading] = useState({ namaz: false });

  const changeBackground = () => {
    if (window.scrollY >= 126) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    changeBackground();
    getUserToken() && setUserlink(true);
    // adding the event when scroll change background
    window.addEventListener("scroll", changeBackground);
    return () => window.addEventListener("scroll", changeBackground);
  }, []);

  const content = data.data.categories.slice(9).map((x, i) => (
    <Link
      key={i}
      className="hover:text-red-500"
      to={`/kategoriler/${seoHelp(x.name)}`}
    >
      {x.name}
    </Link>
  ));

  return (
    <div className="fixed  w-full top-0 z-40 font-inter">
      <div className={navbar ? "hidden" : " mx-auto xl:px-48 lg:px-12 px-2  pt-5 bg-gray-200"}>
        <div className="flex items-center justify-center text-gray-800">
          <div className="w-20 justify-center">
            <Link to="/">
              <img
                alt="logo"
                className="object-cover"
                src="https://seeklogo.com/images/L/logo-com-hr-logo-5636A4D2D5-seeklogo.com.png"
              />
            </Link>
          </div>
          <div className="flex items-center divide-x divide-gray-300">
            <div className="flex items-center px-3">
              <ul className="flex items-center">
                <li className="cursor-pointer hover:text-white hover:bg-gray-300 p-1 rounded-full">
                  <FaTwitter />
                </li>
                <li className="cursor-pointer hover:text-white hover:bg-gray-300 p-1 rounded-full">
                  <FaFacebookF />
                </li>
                <li className="cursor-pointer hover:text-white hover:bg-gray-300 p-1 rounded-full">
                  <FaInstagram />
                </li>
              </ul>          
            </div>

            {!userlink ? (
              <>
                <div className="flex items-center py-[10px] px-4">
                  <Link to="/uyelik" className="flex items-center">
                    <AiOutlineUser
                      size={19}
                      className="cursor-pointer hover:text-gray-500"
                    />
                    <span className="pl-2">Giriş Yap</span>
                  </Link>
                </div>

                <div className="flex items-center py-[10px] px-4">
                  <Link to="/uyelik" className="flex items-center">
                    <AiOutlineUserAdd
                      size={19}
                      className="cursor-pointer hover:text-gray-500"
                    />
                    <span className="pl-2">Kayıt Ol</span>
                  </Link>
                </div>
              </>
            ) : (
              <a href="/admin" className="flex items-center">
                <AiOutlineUser
                  size={19}
                  className="cursor-pointer hover:text-gray-500"
                />
                <span className="pl-2">Hesabım</span>
              </a>
            )}

            {/* <div className="flex items-center py-[10px] px-4">
              <AiOutlineSearch
                size={19}
                className="cursor-pointer hover:text-gray-500"
                onClick={() => openModal(true)}
              />
            </div> */}
          </div>
        </div>
      </div>

      <div
        className={
          navbar
            ? "h-24 bg-gray-200 hidden items-center"
            : "h-24 bg-gray-200 flex items-center"
        }
      >
        <div className="container mx-auto xl:px-48 lg:px-12 px-2 ">
          <div className="flex items-center justify-center text-gray-800 cursor-pointer">
            <Input
              className="w-80 rounded-l-xl h-12 px-4"
              placeholder="Ne aramak istediğiniz..."
            />
            <Input className="w-60 h-12 px-4n" placeholder="Konum" />
            <div className="bg-red-600 py-[14px] rounded-r-xl pl-3 pr-4 stroke-2">
              <AiOutlineSearch fontSize={19} color="white" strokeWidth={2} />
            </div>
          </div>
        </div>
      </div>
      <nav
        className={
          navbar
            ? "absolute z-50 transition ease-in-out delay-50 bg-gradient-to-r from-red-700 via-red-600 to-red-500 top-0 w-full h-12 flex items-center text-white"
            : "top-0 w-full h-8 bg-red-500 flex items-center"
        }
      >
        <div className="container mx-auto xl:px-48 lg:px-12 px-2 md:text-[14px] text-[10px] flex justify-between items-center font-medium text-white">
          <Link to={"/"} className="md:flex hidden items-center hover:text-white hover:cursor-pointer e-x-4">
            <AiFillStar className="text-yellow-500 text-lg mr-2"/>
            Popüler
          </Link>
          <Link to={"/business"} className="md:flex hidden hover:text-white hover:cursor-pointer space-x-4">
            Restoran
          </Link>
          <ul className="md:flex hidden hover:text-white hover:cursor-pointer space-x-4">
            Pizza
          </ul>
          <ul className="md:flex hidden  hover:text-white hover:cursor-pointer space-x-4">
            Burger
          </ul>
          <ul className="md:flex hidden  hover:text-white hover:cursor-pointer space-x-4">
            Ev Hizmetleri
          </ul>
          <ul className="md:flex hidden  hover:text-white hover:cursor-pointer space-x-4">
            Araba Servisleri
          </ul>
          <ul className="md:flex hidden  hover:text-white hover:cursor-pointer space-x-4">
            Fabrikalar
          </ul>
          <ul className="md:flex hidden  hover:text-white hover:cursor-pointer space-x-4">
            Diğer
          </ul>
          <ul className="md:flex hidden  hover:text-white hover:cursor-pointer space-x-4">
            Kuryeler
          </ul>
          {/* <ul className="md:flex hidden md:text-[13px] text-[10px] items-center space-x-4">
            {data.data.categories.slice(0, 9).map((x, i) => (
              <Link
                key={i}
                className="hover:text-red-500"
                to={`/kategoriler/${seoHelp(x.name)}`}
              >
                {x.name}
              </Link>
            ))}
          </ul>

          <ul className="md:hidden flex md:text-[13px] text-[10px] items-center space-x-4">
            {data.data.categories.slice(0, 5).map((x, i) => (
              <Link
                key={i}
                className="hover:text-red-500"
                to={`/kategoriler/${seoHelp(x.name)}`}
              >
                {x.name}
              </Link>
            ))}
          </ul> */}
        </div>
      </nav>
      <hr className="w-full h-0.5 shadow-2xl mx-auto bg-gray-300 border-0" />
    </div>
  );
};
