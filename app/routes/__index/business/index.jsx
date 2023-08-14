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
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import { Link } from "@remix-run/react";
const { Search } = Input;

const BusinessIndex = () => {
  return (
    <div className="font-inter mt-32">
      <div className="text-xs">
        <Breadcrumb style={{ fontSize: "12px" }}>
          <Breadcrumb.Item href="">Anasayfa</Breadcrumb.Item>
          <Breadcrumb.Item href="">Bursa</Breadcrumb.Item>
          <Breadcrumb.Item href="">Osmangazi</Breadcrumb.Item>
          <Breadcrumb.Item href="">Kebap</Breadcrumb.Item>
          <Breadcrumb.Item>Yahyabey Kebap</Breadcrumb.Item>
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
                Yahyabey Kebap Pide
              </h1>
              <Rate
                className="text-[13px] text-red-500 font-bold bg-white py-1 px-2 rounded-lg mr-2"
                disabled
                defaultValue={4}
              />
              <span className="text-gray-600 font-extralight">
                4.9 (5 inceleme)
              </span>
              <div className="ml-auto text-red-500 rounded-lg cursor-pointer px-2 py-1 hover:text-gray-500">
                <AiOutlineAlert className="text-[25px]" />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="pt-1 px-1 text-gray-600 font-extralight">
                Pizza, Pasta, İtalyan, Fast Food
              </p>
              <p>
                <span className="text-green-500 font-light">Şuanda açık</span> -
                09:00 - 20:00 (Bugün)
              </p>
            </div>
            <span className="px-1 text-gray-600 font-extralight">
              Osmangazi, Bursa
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
            <div className="py-10">
              <h1 className="text-xl font-bold pb-4">Menü</h1>
              <h2 className="-mb-4">En Çok Tercih Edilenler</h2>
              <div className={"pt-4 flex items-center container"}>
                <div className="swiper-button-prev-unique cursor-pointer"></div>
                <Swiper
                  className="destur"
                  modules={[Navigation, Pagination, Autoplay]}
                  navigation={{
                    nextEl: ".swiper-button-next-unique",
                    prevEl: ".swiper-button-prev-unique",
                  }}
                  slidesPerView="4"
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  loop={true}
                  // breakpoints={{

                  //     960: {
                  //         slidesPerView: 4,
                  //     },
                  //     // 720: {
                  //     //     slidesPerView: 3,
                  //     //     spaceBetween: 6
                  //     // },
                  //     // 540: {
                  //     //     slidesPerView: 2,
                  //     //     spaceBetween: 4
                  //     // },
                  //     // 320: {
                  //     //     slidesPerView: 1,
                  //     //     spaceBetween: 2
                  //     // },

                  // }}
                >
                  <SwiperSlide key={1}>
                    <div className="py-4 px-2 flex flex-col justify-center">
                      <div className="min-w-fit flex">
                        <Link
                          className="hover:text-red-500 flex flex-col flex-wrap"
                          to={`/yazarlar/`}
                        >
                          <img
                            className="w-48 h-32 object-cover  shadow rounded-lg align-middle border-none"
                            src="https://s3-media0.fl.yelpcdn.com/bphoto/UT9Aryi6x-UPKa8oHJR3tA/o.jpg"
                            alt=""
                          />
                          <div className="flex flex-col pl-1">
                            <p className="font-semibold xl:text-[13px] text-[10px]">
                              Pizza
                            </p>
                            <p className="xl:text-[11px] text-[9px]">60.00 ₺</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide key={2}>
                    <div className="py-4 px-2 flex flex-col justify-center">
                      <div className="min-w-fit flex">
                        <Link
                          className="hover:text-red-500 flex flex-col flex-wrap"
                          to={`/yazarlar/`}
                        >
                          <img
                            className="w-48 h-32 object-cover  shadow rounded-lg align-middle border-none"
                            src="https://s3-media0.fl.yelpcdn.com/bphoto/pbhWPGX9f2eY-vtqdGOOUg/o.jpg"
                            alt=""
                          />
                          <div className="flex flex-col pl-1">
                            <p className="font-semibold xl:text-[13px] text-[10px]">
                              Cantık
                            </p>
                            <p className="xl:text-[11px] text-[9px]">25.00 ₺</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide key={3}>
                    <div className="py-4 px-2 flex flex-col justify-center">
                      <div className="min-w-fit flex">
                        <Link
                          className="hover:text-red-500 flex flex-col flex-wrap"
                          to={`/yazarlar/`}
                        >
                          <img
                            className="w-48 h-32 object-cover  shadow rounded-lg align-middle border-none"
                            src="https://s3-media0.fl.yelpcdn.com/bphoto/UT9Aryi6x-UPKa8oHJR3tA/o.jpg"
                            alt=""
                          />
                          <div className="flex flex-col pl-1">
                            <p className="font-semibold xl:text-[13px] text-[10px]">
                              Pizza
                            </p>
                            <p className="xl:text-[11px] text-[9px]">60.00 ₺</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>

                  <SwiperSlide key={4}>
                    <div className="py-4 px-2 flex flex-col justify-center">
                      <div className="min-w-fit flex">
                        <Link
                          className="hover:text-red-500 flex flex-col flex-wrap"
                          to={`/yazarlar/`}
                        >
                          <img
                            className="w-48 h-32 object-cover  shadow rounded-lg align-middle border-none"
                            src="https://s3-media0.fl.yelpcdn.com/bphoto/pbhWPGX9f2eY-vtqdGOOUg/o.jpg"
                            alt=""
                          />
                          <div className="flex flex-col pl-1">
                            <p className="font-semibold xl:text-[13px] text-[10px]">
                              Kıymalı Kaşarlı Cantık
                            </p>
                            <p className="xl:text-[11px] text-[9px]">25.00 ₺</p>
                          </div>
                        </Link>
                      </div>
                    </div>
                  </SwiperSlide>
                </Swiper>

                <div className="swiper-button-next-unique cursor-pointer"></div>
              </div>
            </div>

            <div className="py-10">
              <h1 className="text-xl font-bold">İşletme Hakkında</h1>
              <div className="flex pt-2 space-x-6">
                <div className="flex w-2/3 flex-col flex-wrap divide-y">
                  <div className="py-4">
                    <h2 className="text-base py-2 font-semibold">
                      Mutfak Türü
                    </h2>
                    <div className="flex flex-wrap">
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        Döner
                      </span>
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        İskender
                      </span>
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        Çorba
                      </span>
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        Pizza
                      </span>
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        Anadolu Mutfağı
                      </span>
                    </div>
                  </div>

                  <div className="py-4">
                    <h2 className="text-base py-2 font-semibold">
                      İşletme Özellikleri
                    </h2>
                    <div className="flex flex-wrap">
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        Gel Al
                      </span>
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        Kahvaltı
                      </span>
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        Paket Servis
                      </span>
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        Ücretsiz Wi-Fi
                      </span>
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        TV
                      </span>
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        Bebek Sandalyesi
                      </span>
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        Bahçe
                      </span>
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        Aile
                      </span>
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        Otopark
                      </span>
                      <span className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400">
                        Çocuk Oyun Alanı
                      </span>
                    </div>
                  </div>

                  <div className="py-4">
                    <h2 className="text-base py-2 font-semibold">Hakkında</h2>
                    <div className="flex flex-wrap">
                      <span>
                        Akşam yemeği için pizza makarnası ve Sicilya
                        spesiyaliteleri ve öğle yemeği için sert sandviçler!
                      </span>
                    </div>
                  </div>
                </div>
                <div className="w-1/3">
                  <div className="flex flex-wrap flex-col text-center rounded-2xl">
                    <p className="p-1 font-semibold bg-red-500 text-white rounded-t-2xl">
                      ÇALIŞMA SAATLERİ
                    </p>
                    <div className="flex items-center justify-between px-4 p-1 font-extralight">
                      <span>PAZARTESİ</span>
                      <span>09:00 - 20:00</span>
                    </div>
                    <div className="flex items-center justify-between px-4 p-1 font-extralight">
                      <span>SALI</span>
                      <span>09:00 - 20:00</span>
                    </div>
                    <div className="flex items-center justify-between px-4 p-1 font-extralight">
                      <span>ÇARŞAMBA</span>
                      <span>09:00 - 20:00</span>
                    </div>
                    <div className="flex items-center justify-between px-4 p-1 font-light text-red-500">
                      <span>PERŞEMBE</span>
                      <span>09:00 - 20:00</span>
                    </div>
                    <div className="flex items-center justify-between px-4 p-1 font-extralight">
                      <span>CUMA</span>
                      <span>09:00 - 20:00</span>
                    </div>
                    <div className="flex items-center justify-between px-4 p-1 font-extralight">
                      <span>CUMARTESİ</span>
                      <span>09:00 - 20:00</span>
                    </div>
                    <div className="flex items-center justify-between px-4 p-1 font-extralight rounded-b-2xl">
                      <span>PAZAR</span>
                      <span>09:00 - 20:00</span>
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
                  src="https://maps.google.com/maps?width=100%25&amp;height=600&amp;hl=tr&amp;q=40.24400805442096,%2028.995192993784467+(Your%20Business%20Name)&amp;t=&amp;z=14&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
                  width="100%"
                  height="250px"
                  style={{ borderRadius: "0.5rem" }}
                  frameBorder="0"
                  marginHeight="0"
                  marginWidth="0"
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

export default BusinessIndex;
