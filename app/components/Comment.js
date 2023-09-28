import { useState } from "react";
import { Rate } from "antd";
import { AiOutlineLike, AiOutlineComment } from "react-icons/ai";
import moment from "moment";


const Comment = ({
  data,
  imagePath,
  busName,
  border = true,
  cAvaible = false,
}) => {
  const [collap, setCollap] = useState(false);

  const contentless =
    data.comment && data.comment.length > 300
      ? data.comment.substring(0, 300) + "..."
      : data.comment;

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
            src={`${imagePath}/user/thumbnail${data.userImage}`}
            alt={data.userImage}
          />
        </div>
        <span className="font-semibold">{data.name} {data.surname[0]}.</span>
        <span className="block text-[10px]">{data.totalComment} yorum</span>
      </div>

      <div className="col-span-4">
        <div className="flex flex-wrap flex-col p-2">
          <div className="flex items-center space-x-4">
            <span className="font-semibold text-base">
              {busName}
            </span>
            <Rate
              className="text-[13px] text-red-500 font-bold"
              disabled
              allowHalf 
              defaultValue={data.rate}
            />
            <span className="text-[10px]">{moment(data.created).format("DD.MM.yyyy")}</span>
          </div>
          <span className="text-sm ">
            <span className={`${collap ? "hidden" : ""}`}>{contentless}</span>
            <span className={`${collap ? "" : "hidden"}`}>{data.comment}</span>
            <span
              className={`text-blue-500 ${
                data.comment && data.comment.length > 200 ? "" : "hidden"
              } hover:cursor-pointer hover:text-blue-400`}
              onClick={() => setCollap((prev) => !prev)}
            >
              {collap ? "daha az göster" : "devamını oku"}
            </span>
          </span>

          <div className="flex flex-wrap space-x-2 items-center py-4">
            {data.images.map((x,i) => (
              <img
              key={i}
              className="aspect-square w-20 rounded object-cover"
              src={`${imagePath}/business/${x}`}
              alt={x}
            />
            ))}
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
