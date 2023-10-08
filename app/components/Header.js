import { useEffect, useState, useRef } from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import {
  AiOutlineUser,
  AiOutlineLogout,
  AiOutlineSearch,
  AiOutlineSwapRight,
  AiFillStar,
  AiOutlineSetting,
  AiOutlineShop,
  AiOutlineProfile,
} from "react-icons/ai";
import {
  Popover,
  Spin,
  Button,
  Input,
  Select,
  Space,
  Dropdown,
  Menu,
} from "antd";
import { Link, useLocation, useNavigate } from "@remix-run/react";
import { getUserToken, removeToken } from "../hooks/cookie";
import logo from "public/pngegg.png";

const vakitlerName = ["İmsak", "Güneş", "Öğle", "İkindi", "Akşam", "Yatsı"];
const date = new Date();

export const Header = ({ openModal, data, existUser, handleChange }) => {
  const [navbar, setNavbar] = useState(false);
  const [search, setSearch] = useState({ text: "", location: "", loctext: "" });
  const [hidden, setHidden] = useState(true);
  const location = useLocation();
  const [provinces, setProvinces] = useState([]);
  let menuRef = useRef();
  let navigate = useNavigate();
  let start = new Date();

  const getSearchingProvince = async (value) => {
    await fetch(data.API + `/Generic/GetSearchingProvinces?value=${value}`, {
      method: "GET",
      headers: {
        // 'ApiKey': API_KEY,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProvinces(data.data);
      });
  };

  const changeBackground = () => {
    if (window.scrollY >= 126) {
      setNavbar(true);
    } else {
      setNavbar(false);
    }
  };

  useEffect(() => {
    let handler = (e) => {
      if (!menuRef.current.contains(e.target)) {
        setHidden(true);
      }
    };
    window.addEventListener("mousedown", handler);

    changeBackground();

    // adding the event when scroll change background
    window.addEventListener("scroll", changeBackground);
    return () => window.addEventListener("scroll", changeBackground);
  }, []);

  const menu = (
    <Menu className="w-40 mt-2">
      <Menu.Item
        key="Recommend"
        onClick={() =>
          navigate(
            existUser && existUser.isBusiness
              ? "/profilebusiness"
              : `profile?userid=${existUser.userId}`
          )
        }
      >
        {existUser && existUser.isBusiness ? (
          <div className="flex items-center space-x-2">
            <AiOutlineShop size={16} />
            <span>İşletmem</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <AiOutlineProfile size={16} />
            <span>Profilim</span>
          </div>
        )}
      </Menu.Item>
      <Menu.Item key="Newestss">
        <div className="flex items-center space-x-2">
          <AiOutlineSetting size={16} />
          <span>Ayarlar</span>
        </div>
      </Menu.Item>
      <Menu.Item
        key="Newest"
        onClick={() => {
          navigate("/");
          setTimeout(() => removeToken(handleChange), 500);
        }}
      >
        <div className="flex items-center space-x-2">
          <AiOutlineLogout size={16} />
          <span>Çıkış Yap</span>
        </div>
      </Menu.Item>
    </Menu>
  );

  const handleSearch = (ent) => {
    ent.text.trim() != "" &&
      ent.location != "" &&
      location.search != `?text=${ent.text.trim()}&location=${ent.location}` &&
      navigate(`/search?text=${ent.text.trim()}&location=${ent.location}`);
  };

  return (
    <div className="fixed w-full top-0 z-40 font-inter">
      <div
        className={
          navbar
            ? "hidden"
            : " mx-auto xl:px-48 lg:px-12 px-2  pt-5 bg-gray-200"
        }
      >
        <div className="flex items-center justify-center text-gray-800">
          <div className="w-20 justify-center">
            <Link to="/">
              <img alt="logo" className="object-cover" src={logo} />
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

            {!existUser ? (
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

                {/* <div className="flex items-center py-[10px] px-4">
                  <Link to="/uyelik" className="flex items-center">
                    <AiOutlineUserAdd
                      size={19}
                      className="cursor-pointer hover:text-gray-500"
                    />
                    <span className="pl-2">İşletme Hesabı Aç</span>
                  </Link>
                </div> */}
              </>
            ) : (
              <div>
                <Dropdown transitionName="" overlay={menu} trigger={["click"]}>
                  <button className="ml-4 hover:text-gray-500 flex items-center">
                    <AiOutlineUser size={19} className="cursor-pointer" />
                    <span className="pl-2">Hesabım</span>
                  </button>
                </Dropdown>
              </div>
            )}
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
            <div>
              <Input
                className="w-96 rounded-l-xl h-12 px-4"
                placeholder="Ne aramak istediğiniz..."
                value={search.text}
                onChange={(e) => setSearch({ ...search, text: e.target.value })}
              />
            </div>
            <div className="flex items-center">
              <div className="relative flex" ref={menuRef}>
                <Input
                  className="w-80 h-12 px-4n"
                  placeholder="Konum"
                  onChange={(e) => {
                    setSearch({ ...search, loctext: e.target.value });
                    start = new Date();
                    setTimeout(function () {
                      if (new Date() - start > 250) {
                        getSearchingProvince(e.target.value);
                        setHidden(false);
                      }
                    }, 250);
                  }}
                  value={search.loctext}
                />
                <div
                  className={`top-12 w-full cursor-default absolute bg-white rounded-b-lg border py-4 p-2 ${
                    hidden ? "hidden" : "flex"
                  } flex-col`}
                >
                  {provinces.length > 0 ? (
                    provinces.map((x, i) => (
                      <button
                        key={i}
                        className="hover:bg-gray-100 hover:text-black font-medium rounded-lg w-full p-2 flex items-center text-start"
                        onClick={() => {
                          setSearch({
                            ...search,
                            location: x.id,
                            loctext: x.city,
                          });
                          setHidden(true);
                        }}
                      >
                        <AiOutlineSwapRight className="text-gray-400 mr-2" />
                        {x.city}
                      </button>
                    ))
                  ) : (
                    <span className="pb-10 text-gray-200">Konum girin</span>
                  )}
                </div>
              </div>
              <button
                onClick={() => handleSearch(search)}
                className="bg-red-600 py-[14px] rounded-r-xl pl-3 pr-4 stroke-2"
              >
                <AiOutlineSearch fontSize={19} color="white" strokeWidth={2} />
              </button>
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
          <Link
            to={"/"}
            className="md:flex hidden items-center hover:text-white hover:cursor-pointer e-x-4"
          >
            <AiFillStar className="text-yellow-500 text-lg mr-2" />
            Popüler
          </Link>
          <Link
            to={"/isletme/yahyabey-kebap-pide-18"}
            className="md:flex hidden hover:text-white hover:cursor-pointer space-x-4"
          >
            Restoran
          </Link>
          <Link
            to={"/profile"}
            className="md:flex hidden hover:text-white hover:cursor-pointer space-x-4"
          >
            Pizza
          </Link>
          <Link
            to={"/search"}
            className="md:flex hidden hover:text-white hover:cursor-pointer space-x-4"
          >
            Burger
          </Link>
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
