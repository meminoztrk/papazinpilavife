import { Breadcrumb, Rate, Select, Input, Progress } from "antd";
import {
  AiOutlineAlert,
  AiOutlineStar,
  AiOutlineShareAlt,
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineLike,
  AiOutlineComment,
} from "react-icons/ai";
import { BsPinMap, BsTelephone, BsLink } from "react-icons/bs";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Comment from "~/components/Comment";
import { Link, useLoaderData } from "@remix-run/react";
import SwiperMenu from "~/components/SwiperMenu";
import { redirect } from "@remix-run/node";
import { useEffect } from "react";
import moment from "moment";
const { Search } = Input;

export const loader = async ({ request }) => {
  const param = new URL(request.url).searchParams.get("bussid");
  !param && redirect("404");
  const req = await fetch(
    process.env.REACT_APP_API +
      `/Business/GetBusinessesWithCommentById?id=${param}`,
    {
      method: "GET",
      headers: {
        ApiKey: process.env.REACT_APP_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await req.json();
  data.API = process.env.REACT_APP_API;
  data.API_KEY = process.env.REACT_APP_API_KEY;
  data.IMAGES = process.env.REACT_APP_IMAGES;

  return data.data ? data : redirect("/404");
};

const Business = () => {
  const { data, API, API_KEY, API_IMAGES } = useLoaderData();

  useEffect(() => {
    console.log(moment().day());
  }, []);

  const splitItem = (text) => {
    return text != null ? text.split(",,") : null;
  };

  const isOpen = (rangeString) => {
    var range = rangeString.split(" - ");
    var openTime = range[0].split(":").join("");
    var closeTime = range[1].split(":").join("");
    var nowTime = moment().format("HH:mm").split(":").join("");
    var result = false;
    result =
      parseInt(openTime) < parseInt(nowTime) &&
      parseInt(closeTime) > parseInt(nowTime) &&
      true;
    return result;
  };

  const renderNowDate = () => {
    switch (moment().day()) {
      case 0:
        return (
          <p>
            <span
              className={`${
                isOpen(data.mo) ? "text-green-500" : "text-red-500"
              }  font-light`}
            >
              {isOpen(data.mo) ? "Şuanda açık" : "Kapalı"}
            </span>{" "}
            - {data.mo} (Bugün)
          </p>
        );
        break;
      case 1:
        return (
          <p>
            <span
              className={`${
                isOpen(data.tu) ? "text-green-500" : "text-red-500"
              }  font-light`}
            >
              {isOpen(data.tu) ? "Şuanda açık" : "Kapalı"}
            </span>{" "}
            - {data.tu} (Bugün)
          </p>
        );
        break;
      case 2:
        return (
          <p>
            <span
              className={`${
                isOpen(data.we) ? "text-green-500" : "text-red-500"
              }  font-light`}
            >
              {isOpen(data.we) ? "Şuanda açık" : "Kapalı"}
            </span>{" "}
            - {data.we} (Bugün)
          </p>
        );
        break;
      case 3:
        return (
          <p>
            <span
              className={`${
                isOpen(data.th) ? "text-green-500" : "text-red-500"
              }  font-light`}
            >
              {isOpen(data.th) ? "Şuanda açık" : "Kapalı"}
            </span>{" "}
            - {data.th} (Bugün)
          </p>
        );
        break;
      case 4:
        return (
          <p>
            <span
              className={`${
                isOpen(data.fr) ? "text-green-500" : "text-red-500"
              }  font-light`}
            >
              {isOpen(data.fr) ? "Şuanda açık" : "Kapalı"}
            </span>{" "}
            - {data.fr} (Bugün)
          </p>
        );
        break;
      case 5:
        return (
          <p>
            <span
              className={`${
                isOpen(data.sa) ? "text-green-500" : "text-red-500"
              }  font-light`}
            >
              {isOpen(data.sa) ? "Şuanda açık" : "Kapalı"}
            </span>{" "}
            - {data.sa} (Bugün)
          </p>
        );
        break;
      case 6:
        return (
          <p>
            <span
              className={`${
                isOpen(data.su) ? "text-green-500" : "text-red-500"
              }  font-light`}
            >
              {isOpen(data.su) ? "Şuanda açık" : "Kapalı"}
            </span>{" "}
            - {data.su} (Bugün)
          </p>
        );
    }
  };

  return (
    <div className="font-inter mt-32">
      <div className="text-xs">
        <Breadcrumb style={{ fontSize: "12px" }}>
          <Breadcrumb.Item href="">Anasayfa</Breadcrumb.Item>
          <Breadcrumb.Item href="">{data.city}</Breadcrumb.Item>
          <Breadcrumb.Item href="">{data.district}</Breadcrumb.Item>
          <Breadcrumb.Item href="">{data.neighborhood}</Breadcrumb.Item>
          <Breadcrumb.Item>{data.businessName}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {
        //#region Image Gallery
      }
      <div className="mt-2">
        <div className="flex space-x-1 w-full">
          <div className="w-3/5 relative cursor-pointer">
            <img
              alt="gallery"
              className="block h-full w-full aspect-[16/9] rounded-l-lg object-cover object-center"
              src="https://media-cdn.tripadvisor.com/media/photo-s/13/55/10/b5/gorele-usulu-zengin-cesit.jpg"
            />
            <div className="absolute rounded-lg bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,10%,16%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
          </div>

          <div className="w-1/5 flex flex-col gap-y-1">
            <div className="h-1/2 relative cursor-pointer">
              <img
                alt="gallery"
                className="block h-full w-full object-cover object-center"
                src="https://media-cdn.tripadvisor.com/media/photo-s/13/55/12/a1/yahyabey-corum-tandir.jpg"
              />
              <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,10%,16%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
            </div>
            <div className="h-1/2 relative cursor-pointer">
              <img
                alt="gallery"
                className="block h-full w-full object-cover object-center"
                src="https://media-cdn.tripadvisor.com/media/photo-f/13/55/10/95/konya-usulu.jpg"
              />
              <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,10%,16%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
            </div>
          </div>

          <div className="w-1/5 flex relative cursor-pointer">
            <img
              alt="gallery"
              className="block h-full w-full aspect-[9/16] rounded-r-lg object-cover object-center"
              src="https://media-cdn.tripadvisor.com/media/photo-f/13/55/10/90/bursa-ya-ozgu-cantik.jpg"
            />
            <div className="absolute rounded-lg bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,10%,16%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
          </div>
        </div>
      </div>
      {
        //#endregion
      }
      <div className="bg-white -mt-3 rounded-b-lg py-6 px-6">
        {
          //#region Business Header
        }
        <div>
          <div>
            <div className="flex items-center pt-2">
              <h1 className="text-2xl font-extrabold pr-4">
                {data.businessName}
              </h1>
              <Rate
                className="text-[13px] text-red-500 font-bold bg-white py-1 px-2 rounded-lg mr-2"
                disabled
                allowHalf
                defaultValue={data.rate}
              />
              <span className="text-gray-600 font-extralight">
                {data.rate} ({data.businessComments.length} inceleme)
              </span>
              <div className="ml-auto text-red-500 rounded-lg cursor-pointer px-2 py-1 hover:text-gray-500">
                <AiOutlineAlert className="text-[25px]" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="pt-1 px-1 text-gray-600 font-extralight">
                {data.minHeader}
              </p>
              {renderNowDate()}
            </div>
            <span className="px-1 text-gray-600 font-extralight">
              {data.neighborhood}, {data.district}, {data.city}
            </span>
          </div>
          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <button className=" text-white bg-red-500 hover:bg-red-700 pl-2 pr-3 py-1 rounded-lg flex items-center gap-x-1 text-base">
                <AiOutlineStar className="text-[20px]" />{" "}
                <span className="text-[13px]">Yorum Yap</span>
              </button>
              <button className=" text-white bg-red-500 hover:bg-red-700 pl-2 pr-3 py-1 rounded-lg flex items-center gap-x-1 text-base">
                <AiOutlineHeart className="text-[20px]" />{" "}
                <span className="text-[13px]">Kaydet</span>
              </button>
              <button className=" text-white bg-red-500 hover:bg-red-700 pl-2 pr-3 py-1 rounded-lg flex items-center gap-x-1 text-base">
                <AiOutlineShareAlt className="text-[20px]" />{" "}
                <span className="text-[13px]">Paylaş</span>
              </button>
            </div>
            <div>
              <ul className="flex items-center text-[18px] text-red-500">
                <li className="cursor-pointer hover:text-gray-500 p-1 rounded-full">
                  <FaInstagram />
                </li>
                <li className="cursor-pointer hover:text-gray-500 p-1 rounded-full">
                  <FaFacebookF />
                </li>
                <li className="cursor-pointer hover:text-gray-500 p-1 rounded-full">
                  <FaTwitter />
                </li>
              </ul>
            </div>
          </div>
        </div>
        {
          //#endregion
        }
        <hr className="mt-10" />
        <div className="grid grid-cols-6">
          {
            //#region Business Body
          }
          <div className="col-span-4 pr-5 divide-y">
            {data.menu && (
              <div className="py-10">
                <h1 className="text-xl font-bold pb-4">Menü</h1>
                <h2 className="-mb-4">En Çok Tercih Edilenler</h2>
                <div className={"pt-4 flex items-center container"}>
                  <SwiperMenu />
                </div>
              </div>
            )}

            <div className="py-10">
              <h1 className="text-xl font-bold">İşletme Hakkında</h1>
              <div className="flex pt-2 space-x-6">
                <div className="flex w-2/3 flex-col flex-wrap divide-y">
                  {data.foodTypes != null && (
                    <div className="py-4">
                      <h2 className="text-base py-2 font-semibold">
                        Yemek Çeşitleri
                      </h2>
                      <div className="flex flex-wrap">
                        {splitItem(data.foodTypes).map((item, index) => (
                          <span
                            key={index}
                            className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.businessProps != null && (
                    <div className="py-4">
                      <h2 className="text-base py-2 font-semibold">
                        İşletme Özellikleri
                      </h2>
                      <div className="flex flex-wrap">
                        {splitItem(data.businessProps).map((item, index) => (
                          <span
                            key={index}
                            className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.businessServices != null && (
                    <div className="py-4">
                      <h2 className="text-base py-2 font-semibold">
                        İşletme Hizmetleri
                      </h2>
                      <div className="flex flex-wrap">
                        {splitItem(data.businessServices).map((item, index) => (
                          <span
                            key={index}
                            className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.about != null && (
                    <div className="py-4">
                      <h2 className="text-base py-2 font-semibold">Hakkında</h2>
                      <div className="flex flex-wrap">
                        <span>{data.about}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="w-1/3">
                  <div className="flex flex-wrap flex-col text-center rounded-2xl">
                    <p className="p-1 font-semibold bg-red-500 text-white rounded-t-2xl">
                      ÇALIŞMA SAATLERİ
                    </p>
                    <div
                      className={`flex items-center justify-between px-4 p-1 font-extralight ${
                        moment().day() === 1 && "text-red-500"
                      }`}
                    >
                      <span>PAZARTESİ</span>
                      <span>
                        {data.mo == "00:00 - 00:00" ? "Kapalı" : data.mo}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between px-4 p-1 font-extralight ${
                        moment().day() === 2 && "text-red-500"
                      }`}
                    >
                      <span>SALI</span>
                      <span>
                        {data.tu == "00:00 - 00:00" ? "Kapalı" : data.tu}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between px-4 p-1 font-extralight ${
                        moment().day() === 3 && "text-red-500"
                      }`}
                    >
                      <span>ÇARŞAMBA</span>
                      <span>
                        {data.we == "00:00 - 00:00" ? "Kapalı" : data.we}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between px-4 p-1 font-extralight ${
                        moment().day() === 4 && "text-red-500"
                      }`}
                    >
                      <span>PERŞEMBE</span>
                      <span>
                        {data.th == "00:00 - 00:00" ? "Kapalı" : data.th}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between px-4 p-1 font-extralight ${
                        moment().day() === 5 && "text-red-500"
                      }`}
                    >
                      <span>CUMA</span>
                      <span>
                        {data.fr == "00:00 - 00:00" ? "Kapalı" : data.fr}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between px-4 p-1 font-extralight ${
                        moment().day() === 0 && "text-red-500"
                      }`}
                    >
                      <span>CUMARTESİ</span>
                      <span>
                        {data.sa == "00:00 - 00:00" ? "Kapalı" : data.sa}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between px-4 p-1 font-extralight ${
                        moment().day() === "Sunday" && "text-red-500"
                      }`}
                    >
                      <span>PAZAR</span>
                      {data.su == "00:00 - 00:00" ? "Kapalı" : data.su}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-10">
              <h1 className="text-xl font-bold">Kuryeler</h1>
              <div className="flex flex-wrap justify-start text-center pt-4">
                <div className="w-1/4 pt-4">
                  <img
                    className="w-32 h-32 mx-auto"
                    src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                  />
                  <div className="flex flex-col text-center mt-2">
                    <p>Ahmet B.</p>
                  </div>
                </div>

                <div className="w-1/4 pt-4">
                  <img
                    className="w-32 h-32 mx-auto"
                    src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                  />
                  <div className="flex flex-col text-center mt-2">
                    <p>Ahmet B.</p>
                  </div>
                </div>

                <div className="w-1/4 pt-4">
                  <img
                    className="w-32 h-32 mx-auto"
                    src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                  />
                  <div className="flex flex-col text-center mt-2">
                    <p>Ahmet B.</p>
                  </div>
                </div>

                <div className="w-1/4 pt-4">
                  <img
                    className="w-32 h-32 mx-auto"
                    src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                  />
                  <div className="flex flex-col text-center mt-2">
                    <p>Ahmet B.</p>
                  </div>
                </div>

                <div className="w-1/4 pt-4">
                  <img
                    className="w-32 h-32 mx-auto"
                    src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                  />
                  <div className="flex flex-col text-center mt-2">
                    <p>Ahmet B.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="py-10">
              <div>
                <h1 className="text-xl font-bold">Yorumlar</h1>
                <div className="grid grid-cols-3 py-4">
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="flex flex-col flex-wrap">
                      <span className="text-left font-semibold">
                        Tüm Yorumlar
                      </span>
                      <Rate
                        className="text-[32px] text-red-500 font-bold bg-white rounded-lg"
                        disabled
                        defaultValue={4}
                      />
                      <span className="text-left font-light">8 İnceleme</span>
                    </div>
                  </div>
                  <div className="col-span-2 px-4 space-y-2">
                    <div className="flex items-center gap-x-1">
                      <span className="w-20">5 Yıldız</span>
                      <Progress
                        percent={80}
                        strokeColor={"#FB503C"}
                        showInfo={false}
                      />
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="w-20">4 Yıldız</span>
                      <Progress
                        percent={20}
                        strokeColor={"#FF643D"}
                        showInfo={false}
                      />
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="w-20">3 Yıldız</span>
                      <Progress
                        percent={10}
                        strokeColor={"#FF8742"}
                        showInfo={false}
                      />
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="w-20">2 Yıldız</span>
                      <Progress
                        percent={0}
                        strokeColor={"#FFAD48"}
                        showInfo={false}
                      />
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="w-20">1 Yıldız</span>
                      <Progress
                        percent={10}
                        strokeColor={"#FFCC4B"}
                        showInfo={false}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-6">
                <div className="space-x-4">
                  <Select
                    className="w-28"
                    defaultValue="5"
                    options={[
                      {
                        value: "5",
                        label: "En Yeni",
                      },
                      {
                        value: "4",
                        label: "En Eski",
                      },
                    ]}
                  />

                  <Select
                    className="w-28"
                    defaultValue="t"
                    options={[
                      {
                        value: "t",
                        label: "Tümü",
                      },
                      {
                        value: "5",
                        label: "Kalite",
                      },
                      {
                        value: "4",
                        label: "Fiyat",
                      },
                      {
                        value: "3",
                        label: "Konum",
                      },
                      {
                        value: "2",
                        label: "Hizmet",
                      },
                      {
                        value: "1",
                        label: "Servis",
                      },
                      {
                        value: "all",
                        label: "Atmosfer",
                      },
                    ]}
                  />

                  <Select
                    className="w-28"
                    defaultValue="all"
                    options={[
                      {
                        value: "all",
                        label: "Tümü",
                      },
                      {
                        value: "5",
                        label: "5 Yıldız",
                      },
                      {
                        value: "4",
                        label: "4 Yıldız",
                      },
                      {
                        value: "3",
                        label: "3 Yıldız",
                      },
                      {
                        value: "2",
                        label: "2 Yıldız",
                      },
                      {
                        value: "1",
                        label: "1 Yıldız",
                      },
                    ]}
                  />
                </div>
                <div className="flex items-center">
                  <Search placeholder="Yorumlarda ara..." className="w-60" />
                </div>
              </div>

              <div className="col-span-1 grid grid-cols-1 justify-center content-center bg-white rounded-lg pt-8 pb-32">
                <div className="col-span-1 grid grid-cols-5 p-2 mt-2.5 mx-2.5 rounded-lg">
                  <div className="col-span-1 flex flex-wrap flex-col items-center bg-white p-2">
                    <div className="rounded-full h-16 w-16">
                      <img
                        className="rounded-full"
                        src="https://s3-media0.fl.yelpcdn.com/photo/tsvlqX3iUJEK0360ksMFew/ls.jpg"
                      />
                    </div>
                    <span className="font-semibold">Kay A.</span>
                    <span className="block text-[10px]">4 yorum</span>
                  </div>

                  <div className="col-span-4">
                    <div className="flex flex-wrap flex-col p-2">
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-base">
                          Kitap Evi Restaurant
                        </span>
                        <Rate
                          className="text-[13px] text-red-500 font-bold"
                          disabled
                          defaultValue={4}
                        />
                        <span className="text-[9px]">07.08.2023</span>
                      </div>
                      <span className=" text-sm">
                        Harika bir yemekti. Çok lezzetli herkese tavsiye
                        ediyorum. İşletmecinin ilgi ve alakası için ayrıca
                        teşekkür ederim.
                      </span>
                      <div className="flex flex-wrap space-x-2 items-center py-4">
                        <img
                          className="aspect-square w-20 rounded object-cover"
                          src="https://media-cdn.tripadvisor.com/media/photo-l/1d/91/9d/2a/ben-cok-begendim-herkese.jpg"
                        />
                        <img
                          className="aspect-square w-20 rounded object-cover"
                          src="https://media-cdn.tripadvisor.com/media/photo-l/1d/c9/3a/03/caption.jpg"
                        />
                        <img
                          className="aspect-square w-20 rounded object-cover"
                          src="https://media-cdn.tripadvisor.com/media/photo-l/1d/c9/3a/04/caption.jpg"
                        />
                      </div>
                      <div className="flex items-center justify-start space-x-2">
                        <button className="border flex items-center space-x-1 py-1 px-2 rounded-lg text-xs hover:text-red-500 hover:border-red-500">
                          <AiOutlineLike className="text-base" />
                          <span>Beğen</span>
                        </button>
                        <button className="border flex items-center space-x-1 py-1 px-2 rounded-lg text-xs hover:text-red-500 hover:border-red-500">
                          <AiOutlineComment className="text-base" />
                          <span>Yorum Yap</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 grid grid-cols-5 p-2 mt-2.5 mx-2.5 rounded-lg">
                  <div className="col-span-1 flex flex-wrap flex-col items-center bg-white p-2">
                    <div className="rounded-full h-16 w-16">
                      <img
                        className="rounded-full"
                        src="https://s3-media0.fl.yelpcdn.com/photo/NgfOtVKaiu1bPXUeoXUb5A/ls.jpg"
                      />
                    </div>
                    <span className="font-semibold">Alex J.</span>
                    <span className="block text-[10px]">62 yorum</span>
                  </div>

                  <div className="col-span-4">
                    <div className="flex flex-wrap flex-col p-2">
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-base">
                          Smile Steakhouse
                        </span>
                        <Rate
                          className="text-[13px] text-red-500 font-bold"
                          disabled
                          defaultValue={2}
                        />
                        <span className="text-[9px]">07.08.2023</span>
                      </div>
                      <span className=" text-sm">
                        Ailece tatil için gittiğimiz alanyada bazı restorant ta
                        yemek yedik turizm bölgesi olduğu için bildiğiniz gibi
                        insanların önüne yemekleri koyduklarında hersey bitiyor
                        bir arkadaşın tavsiyesi üzerine öz tat restorant ta
                        gittik hem yemekleri hemde çalışanları o kadar samimi
                        sanki kendi evinizdeymis gibi his ediyorsunuz hele bir
                        tepsi kebabı yedik hayatımda yediğim en güzel tepsi
                        kebabiydi sizde ailenizle birlikte güzel bir tatil
                        geçirmek için mutlaka öz tat restorantti görmenizi
                        öneririm
                      </span>
                      <div className="flex flex-wrap space-x-2 items-center py-4"></div>
                      <div className="flex items-center justify-start space-x-2">
                        <button className="border flex items-center space-x-1 py-1 px-2 rounded-lg text-xs hover:text-red-500 hover:border-red-500">
                          <AiOutlineLike className="text-base" />
                          <span>Beğen</span>
                        </button>
                        <button className="border flex items-center space-x-1 py-1 px-2 rounded-lg text-xs hover:text-red-500 hover:border-red-500">
                          <AiOutlineComment className="text-base" />
                          <span>Yorum Yap</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="col-span-1 grid grid-cols-5 p-2 mt-2.5 mx-2.5 rounded-lg">
                  <div className="col-span-1 flex flex-wrap flex-col items-center bg-white p-2">
                    <div className="rounded-full h-16 w-16">
                      <img
                        className="rounded-full"
                        src="https://s3-media0.fl.yelpcdn.com/photo/Cl0w6GlT_41thF2Yzsx_kg/ls.jpg"
                      />
                    </div>
                    <span className="font-semibold">Rick E.</span>
                    <span className="block text-[10px]">144 yorum</span>
                  </div>

                  <div className="col-span-4">
                    <div className="flex flex-wrap flex-col p-2">
                      <div className="flex items-center space-x-4">
                        <span className="font-semibold text-base">
                          Almira Hotel Thermal
                        </span>
                        <Rate
                          className="text-[13px] text-red-500 font-bold"
                          disabled
                          defaultValue={5}
                        />
                        <span className="text-[9px]">07.08.2023</span>
                      </div>
                      <span className=" text-sm">
                        Hafta sonu vip paketi ile bir pazar gününü, açık büfe
                        kahvaltı ve aile hamamı ile geçirdik. Kahvaltı çok
                        yeterli idi, her şey taze. Hele hamam tam bir terapi
                        gibiydi. İnanılmaz temiz ve her şey en ince ayrıntısına
                        kadar düşünülmüş. En güzeli de misafirperverlikleri,
                        bundan sonra sık sık ziyaret edeceğiz. 10/10
                      </span>
                      <div className="flex flex-wrap space-x-2 items-center py-4">
                        <img
                          className="aspect-square w-20 rounded object-cover"
                          src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/f0/21/d0/caption.jpg?w=1100&h=-1&s=1"
                        />
                        <img
                          className="aspect-square w-20 rounded object-cover"
                          src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/e5/6b/bd/caption.jpg?w=1100&h=-1&s=1"
                        />
                        <img
                          className="aspect-square w-20 rounded object-cover"
                          src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/29/e2/a4/ed/caption.jpg?w=1100&h=-1&s=1"
                        />
                      </div>

                      <div className="flex items-center justify-start space-x-2">
                        <button className="border flex items-center space-x-1 py-1 px-2 rounded-lg text-xs hover:text-red-500 hover:border-red-500">
                          <AiOutlineLike className="text-base" />
                          <span>Beğen</span>
                        </button>
                        <button className="border flex items-center space-x-1 py-1 px-2 rounded-lg text-xs hover:text-red-500 hover:border-red-500">
                          <AiOutlineComment className="text-base" />
                          <span>Yorum Yap</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <Comment
                  cAvaible={true}
                  border={false}
                  content="Ailece tatil için gittiğimiz alanyada bazı restorant ta yemek yedik turizm bölgesi olduğu için bildiğiniz gibi insanların önüne yemekleri koyduklarında hersey bitiyor bir arkadaşın tavsiyesi üzerine öz tat restorant ta gittik hem yemekleri hemde çalışanları o kadar samimi sanki kendi evinizdeymis gibi his ediyorsunuz hele bir tepsi kebabı yedik hayatımda yediğim en güzel tepsi kebabiydi sizde ailenizle birlikte güzel bir tatil geçirmek için mutlaka öz tat restorantti görmenizi öneririm."
                />
              </div>
            </div>
          </div>
          {
            //#endregion
          }
          {
            //#region Sticky Menu
          }
          <div className="col-span-2">
            <div className="sticky top-16 mt-10 rounded-lg border shadow-lg pb-10">
              <div>
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3045.7212382339303!2d28.974800376541495!3d40.23749987146894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14ca144295b039ef%3A0xe97f54f5c2e67b61!2sYahyabey%20Pide%20Kebap!5e0!3m2!1str!2sus!4v1694250663970!5m2!1str!2sus"
                  width="100%"
                  height="250px"
                  style={{ borderRadius: "0.5rem" }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
              <div>
                <div className="flex items-center text-[13.5px] pt-4 mr-1 font-light">
                  <span className="mx-4 text-lg text-blue-500">
                    <BsPinMap
                      style={{ strokeWidth: "0.5", height: "1.5rem" }}
                    />
                  </span>
                  <span>
                    Hamitler, 1. Destan Sk. No:8, 16160 Osmangazi/Bursa
                  </span>
                </div>
                <div className="flex items-center text-[13.5px] pt-2 mr-1 font-light">
                  <span className="mx-4 text-lg text-blue-500">
                    <BsTelephone
                      style={{ strokeWidth: "0.5", height: "1.5rem" }}
                    />
                  </span>
                  <span>0552 850 23 52</span>
                </div>
                <div className="flex items-center text-[13.5px] pt-2 mr-1 font-light">
                  <span className="mx-4 text-lg text-blue-500">
                    <BsLink style={{ strokeWidth: "0.5", height: "1.5rem" }} />
                  </span>
                  <a
                    href="https://www.papaziinpilavi.com"
                    className="text-blue-500 hover:underline"
                    target="_blank"
                  >
                    www.papaziinpilavi.com
                  </a>
                </div>
              </div>
            </div>
          </div>
          {
            //#endregion
          }
        </div>
      </div>
    </div>
  );
};

export default Business;
