import { useLoaderData } from "@remix-run/react";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "@remix-run/react";
import seoHelp from "./../../hooks/seoHelp";
import { redirect } from "@remix-run/node";
import { Rate } from "antd";
import { BsFillChatLeftFill,BsThreeDots } from "react-icons/bs";

export const loader = async ({ request }) => {
  const url = new URL(request.url);
  const search = new URLSearchParams(url.search);
  return null;
};

const Search = () => {
  return (
    <div className="mt-36">
      <div className="w-full bg-white rounded-lg p-8 flex flex-col gap-y-8">
        <div className="flex gap-x-4 relative">
          <div className="absolute right-2 top-0">
            <BsThreeDots className="text-xl" />
          </div>
          <div className="md:w-1/6 w-[95%]">
            <img
              className="aspect-square w-full rounded-lg object-cover"
              src="https://media-cdn.tripadvisor.com/media/photo-s/24/e8/fe/a3/oztat-kebap.jpg"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight">
              Yahyabey Kebap Pide
            </h1>
            <span className="text-gray-500 pl-[2px]">
              Hamitler Mh Osmangazi, Bursa
            </span>
            <div className="mt-2 flex space-x-2 items-center">
              <Rate
                className="text-[15px] text-red-500 font-bold bg-red-300 px-1 rounded"
                disabled
                allowHalf
                defaultValue={4.5}
              />
              <span className="text-xs text-gray-400">623 yorum</span>
            </div>
            <span className="mt-2 text-gray-500">
              #döner, #iskender, #çorba #pizza, #anadolu mutfağı
            </span>
            <div className="flex flex-wrap items-center text-xs">
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Gel Al
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Kahvaltı
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Paket Servis
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Ücretsiz Wi-Fi
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                TV
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Bebek Sandalyesi
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Bahçe
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Aile
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Otopark
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Çocuk Oyun Alanı
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              <div className="flex items-center ">
                <BsFillChatLeftFill className="mr-1" /> 1 yorumda bahsediliyor:
                çorba
              </div>
              <span>
                "...Yediğim en güzel{" "}
                <span className="font-semibold italic">çorba</span> olabilir
                elinize sağlık..."
              </span>
            </div>
          </div>
        </div>

        <div className="flex gap-x-4 relative">
          <div className="absolute right-2 top-0">
            <BsThreeDots className="text-xl" />
          </div>
          <div className="md:w-1/6 w-[95%]">
            <img
              className="aspect-square w-full rounded-lg object-cover"
              src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/07/a2/ab/fe/kitap-evi-hotel-restaurant.jpg?w=300&h=300&s=1"
            />
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-bold tracking-tight">
              Kitap Evi Restorant
            </h1>
            <span className="text-gray-500 pl-[2px]">
              Hamitler Mh Osmangazi, Bursa
            </span>
            <div className="mt-2 flex space-x-2 items-center">
              <Rate
                className="text-[15px] text-red-500 font-bold bg-red-300 px-1 rounded"
                disabled
                allowHalf
                defaultValue={4.5}
              />
              <span className="text-xs text-gray-400">623 yorum</span>
            </div>
            <span className="mt-2 text-gray-500">
              #döner, #iskender, #çorba #pizza, #anadolu mutfağı
            </span>
            <div className="flex flex-wrap items-center text-xs">
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Gel Al
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Kahvaltı
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Paket Servis
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Ücretsiz Wi-Fi
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                TV
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Bebek Sandalyesi
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Bahçe
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Aile
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Otopark
              </span>
              <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                Çocuk Oyun Alanı
              </span>
            </div>
            <div className="mt-2 text-xs text-gray-400">
              <div className="flex items-center ">
                <BsFillChatLeftFill className="mr-1" /> 1 yorumda bahsediliyor:
                çorba
              </div>
              <span>
                "...Yediğim en güzel{" "}
                <span className="font-semibold italic text-black">çorba</span> olabilir
                elinize sağlık..."
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Search;
