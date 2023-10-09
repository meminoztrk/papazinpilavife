import { useLoaderData, Link } from "@remix-run/react";
import React, { useContext, useEffect, useState } from "react";
import { Spin, Rate } from "antd";
import { AiFillStar, AiFillShop, AiOutlinePushpin } from "react-icons/ai";
import { useNavigate } from "react-router-dom";
import { Collapse } from "react-collapse";
import Comment from "~/components/Comment";
import seoHelp from "~/hooks/seoHelp";


// export const loader = async ({ request }) => {
//   const req = await fetch(process.env.REACT_APP_API + "/Common/GetAllBlog", {
//     headers: {
//       ApiKey: process.env.REACT_APP_API_KEY,
//       "Content-Type": "application/json",
//     },
//   });
//   const blogs = await req.json();
//   const data = {
//     data: blogs.data,
//     IMAGES: process.env.REACT_APP_IMAGES,
//   };
//   return data;
// };

export default function IndexRoute() {
  let navigate = useNavigate();

  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;

  return (
    <div>
      <div className="font-inter grid grid-cols-2 mt-40">
        <div className="mr-1">
          <div className="flex items-center justify-between py-2 px-4 text-2xl font-bold text-red-500">
            <span>İŞLETMELER</span>
            <AiFillShop />
          </div>

          <div className="col-span-1 grid grid-cols-2 justify-center content-center bg-white shadow-xl rounded-lg p-2 pb-32">
            <div className="p-1">
              <Link to={`/isletme/${seoHelp("Yahyabey Kebap Pide")}-${18}`}>
                <div className="hover:shadow-lg hover:cursor-pointer rounded-lg p-2">
                  <img
                    className="aspect-square w-full rounded-lg object-cover"
                    src="https://media-cdn.tripadvisor.com/media/photo-s/24/e8/fe/a3/oztat-kebap.jpg"
                  />
                  <div className="flex items-center justify-between pt-1 px-1">
                    <p className="text-[15px] font-medium text-left">
                      Yahyabey Kebap Pide
                    </p>
                    <div className="flex items-center">
                      <span className="mr-1 text-xs">(5)</span>
                      <div className="flex text-xs items-center text-white font-semibold px-2 py-1 rounded bg-red-500">
                        <span>4.9</span>
                        <div></div>
                        <AiFillStar className="ml-1" />
                      </div>
                    </div>
                  </div>
                  <span className="block italic text-xs px-1">
                    #kebab, #iskender
                  </span>
                  <span className="block text-xs px-1">
                    Kadıpaşa Mh., Alanya, Türkiye
                  </span>
                </div>
              </Link>
            </div>

            <div className="p-1">
              <div className="hover:shadow-lg hover:cursor-pointer rounded-lg p-2">
                <img
                  className="aspect-square w-full rounded-lg object-cover"
                  src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/1c/30/70/a6/almira-hotel-thermal.jpg?w=300&h=300&s=1"
                />
                <div className="flex items-center justify-between pt-1 px-1">
                  <p className="text-[15px] font-medium text-left">
                    Almira Hotel Thermal
                  </p>
                  <div className="flex items-center">
                    <span className="mr-1 text-xs">(55)</span>
                    <div className="flex text-xs items-center text-white font-semibold px-2 py-1 rounded bg-red-500">
                      <span>4.7</span>
                      <div></div>
                      <AiFillStar className="ml-1" />
                    </div>
                  </div>
                </div>
                <span className="block italic text-xs px-1">
                  #otel, #spa, #termal, #kahvaltı
                </span>
                <span className="block text-xs px-1">Nilüfer, Bursa</span>
              </div>
            </div>

            <div className="p-1">
              <div className="hover:shadow-lg hover:cursor-pointer rounded-lg p-2">
                <img
                  className="aspect-square w-full rounded-lg object-cover"
                  src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/a2/ab/fe/kitap-evi-hotel-restaurant.jpg?w=300&h=300&s=1"
                />
                <div className="flex items-center justify-between pt-1 px-1">
                  <p className="text-[15px] font-medium text-left">
                    Kitap Evi Restaurant
                  </p>
                  <div className="flex items-center">
                    <span className="mr-1 text-xs">(125)</span>
                    <div className="flex text-xs items-center text-white font-semibold px-2 py-1 rounded bg-red-500">
                      <span>4.8</span>
                      <div></div>
                      <AiFillStar className="ml-1" />
                    </div>
                  </div>
                </div>
                <span className="block italic text-xs px-1">
                  #yemek, #ev-yemekleri
                </span>
                <span className="block text-xs px-1">Kütahya, Türkiye</span>
              </div>
            </div>

            <div className="p-1">
              <div className="hover:shadow-lg hover:cursor-pointer rounded-lg p-1">
                <img
                  className="aspect-square w-full rounded-lg object-cover"
                  src="https://media-cdn.tripadvisor.com/media/photo-s/1d/12/fd/7c/smile.jpg"
                />
                <div className="flex items-center justify-between pt-1 px-1">
                  <p className="text-[15px] font-medium text-left">
                    Smile Steakhouse 
                  </p>
                  <div className="flex items-center">
                    <span className="mr-1 text-xs">(98)</span>
                    <div className="flex text-xs items-center text-white font-semibold px-2 py-1 rounded bg-red-500">
                      <span>4.1</span>
                      <div></div>
                      <AiFillStar className="ml-1" />
                    </div>
                  </div>
                </div>
                <span className="block italic text-xs px-1">
                  #burger, #steak, #salata
                </span>
                <span className="block text-xs px-1">Esenler, İstanbul</span>
              </div>
            </div>
          </div>
        </div>
        <div className="ml-1">
          <div className="flex items-center justify-between py-2 px-4 text-2xl font-bold text-red-500">
            <span>SON İNCELEMELER</span>
            <AiOutlinePushpin />
          </div>

          <div className="col-span-1 grid grid-cols-1 justify-center content-center bg-white shadow-xl rounded-lg p-2 pb-32">
            <div className="col-span-1 grid grid-cols-5 p-2 border mt-2.5 mx-2.5 rounded-lg">
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
                    Harika bir yemekti. Çok lezzetli herkese tavsiye ediyorum.
                    İşletmecinin ilgi ve alakası için ayrıca teşekkür ederim.
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
                </div>
              </div>
            </div>

            <div className="col-span-1 grid grid-cols-5 p-2 border mt-2.5 mx-2.5 rounded-lg">
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
                    insanların önüne yemekleri koyduklarında hersey bitiyor bir
                    arkadaşın tavsiyesi üzerine öz tat restorant ta gittik hem
                    yemekleri hemde çalışanları o kadar samimi sanki kendi
                    evinizdeymis gibi his ediyorsunuz hele bir tepsi kebabı
                    yedik hayatımda yediğim en güzel tepsi kebabiydi sizde
                    ailenizle birlikte güzel bir tatil geçirmek için mutlaka öz
                    tat restorantti görmenizi öneririm
                  </span>
                  <div className="flex flex-wrap space-x-2 items-center py-4"></div>
                </div>
              </div>
            </div>

            <div className="col-span-1 grid grid-cols-5 p-2 border mt-2.5 mx-2.5 rounded-lg">
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
                    kahvaltı ve aile hamamı ile geçirdik. Kahvaltı çok yeterli
                    idi, her şey taze. Hele hamam tam bir terapi gibiydi.
                    İnanılmaz temiz ve her şey en ince ayrıntısına kadar
                    düşünülmüş. En güzeli de misafirperverlikleri, bundan sonra
                    sık sık ziyaret edeceğiz. 10/10
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
                </div>
              </div>
            </div>

            {/* <Comment content="Ailece tatil için gittiğimiz alanyada bazı restorant ta yemek yedik turizm bölgesi olduğu için bildiğiniz gibi insanların önüne yemekleri koyduklarında hersey bitiyor bir arkadaşın tavsiyesi üzerine öz tat restorant ta gittik hem yemekleri hemde çalışanları o kadar samimi sanki kendi evinizdeymis gibi his ediyorsunuz hele bir tepsi kebabı yedik hayatımda yediğim en güzel tepsi kebabiydi sizde ailenizle birlikte güzel bir tatil geçirmek için mutlaka öz tat restorantti görmenizi öneririm." /> */}
          </div>
        </div>
      </div>
    </div>
  );
}
