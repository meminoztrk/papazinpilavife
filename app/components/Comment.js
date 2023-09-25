import { useState } from "react";
import { Rate } from "antd";
import { Collapse } from "react-collapse";
import { AiOutlineLike, AiOutlineComment } from "react-icons/ai";

const Comment = ({
  img,
  content = "",
  rating,
  busspics,
  bussname,
  border = true,
  cAvaible = false,
}) => {
  const [collap, setCollap] = useState(false);

  const contentless =
    content && content.length > 200
      ? content.substring(0, 200) + "..."
      : content;

  return (
    <div
      className={`col-span-1 grid grid-cols-5 p-2 ${
        border && "border"
      } mt-2.5 mx-2.5 rounded-lg`}
    >
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
              allowHalf 
              defaultValue={4}
            />
            <span className="text-[9px]">07.08.2023</span>
          </div>
          <span className="text-sm ">
            <span className={`${collap ? "hidden" : ""}`}>{contentless}</span>
            <span className={`${collap ? "" : "hidden"}`}>{content}</span>
            <span
              className={`text-blue-500 ${
                content && content.length > 200 ? "" : "hidden"
              } hover:cursor-pointer hover:text-blue-400`}
              onClick={() => setCollap((prev) => !prev)}
            >
              {collap ? "daha az göster" : "devamını oku"}
            </span>
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
          {cAvaible && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Comment;
