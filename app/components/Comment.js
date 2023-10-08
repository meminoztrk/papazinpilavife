import { useEffect, useState } from "react";
import { Rate } from "antd";
import { AiOutlineLike, AiOutlineComment, AiFillLike } from "react-icons/ai";
import moment from "moment";
import { BsThreeDots } from "react-icons/bs";
import { Link } from "react-router-dom";


const Comment = ({
  data,
  imagePath,
  existUser,
  busName,
  imageModal,
  API,
  API_KEY,
  handleLoginModal,
  border = true,
  cAvaible = false,
}) => {
  const [collap, setCollap] = useState(false);
  const [loading, setLoading] = useState(false);
  const [like, setLike] = useState({
    likes: data.likedUsers,
    count: data.likedUsers.length,
  });
  const contentless =
    data.comment && data.comment.length > 300
      ? data.comment.substring(0, 300) + "..."
      : data.comment;

  const LikeComment = async () => {
    if (existUser !== null) {
      setLoading(true);
      await fetch(API + "/FavoriteComment", {
        method: "POST",
        headers: {
          ApiKey: API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          businessCommentId: data.businessId,
          userId: existUser.id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoading(false);
          data.statusCode == 200 &&
            setLike({
              likes: [...like.likes, parseInt(existUser.id)],
              count: like.count + 1,
            });
        });
    } else {
      handleLoginModal(true)
    }
  };

  const DeleteComment = async () => {
    setLoading(true);
    await fetch(
      API +
        `/FavoriteComment?businessCommentId=${data.id}&userid=${existUser.id}`,
      {
        method: "DELETE",
        headers: {
          ApiKey: API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
      }
    )
      .then((response) => response.json())
      .then((data) => {
        setLoading(false);
        data.statusCode == 200 &&
          setLike({
            likes: [like.likes.filter((x) => x !== parseInt(existUser.id))],
            count: like.count - 1,
          });
      })
      .catch((err) => console.log(err));
  };

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
        <Link
          target="_blank"
          to={`/profile?userid=${data.userId}`}
          className="font-semibold hover:text-red-500"
        >
          {data.name} {data.surname[0]}.
        </Link>
        <span className="block text-[10px]">{data.totalComment} yorum</span>
      </div>

      <div className="col-span-4">
        <div className="flex flex-wrap flex-col p-2">
          <div className="flex justify-between space-x-4">
            <div className="space-x-4 flex items-center">
              <span className="font-semibold text-base">{busName}</span>
              <Rate
                className="text-[13px] text-red-500 font-bold"
                disabled
                allowHalf
                value={data.rate}
                defaultValue={0}
              />
              <span className="text-[10px]">
                {moment(data.created).format("DD.MM.yyyy")}
              </span>
            </div>
            <div className="flex items-start">
              <BsThreeDots className="text-gray-500" size={18} />
            </div>
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
            {data.images.map((x, i) => (
              <div
                key={i}
                className="relative hover:cursor-pointer"
                onClick={() =>
                  imageModal({ visible: true, data: data, currentIndex: i })
                }
              >
                <img
                  className="aspect-square w-20 rounded object-cover"
                  src={`${imagePath}/business/${x}`}
                  alt={x}
                />
                <div className="absolute rounded-lg bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,10%,16%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
              </div>
            ))}
          </div>
          {cAvaible && (
            <div className="flex items-center justify-start space-x-2">
              {existUser != null &&
              like.likes.includes(parseInt(existUser.id)) ? (
                <button
                  {...(loading && { disabled: true })}
                  onClick={() => DeleteComment()}
                  className="border flex items-center space-x-1 py-1 px-2 rounded-lg text-xs text-red-500 border-red-500"
                >
                  <AiFillLike className="text-base" />
                  <span>
                    Beğen {like.count > 0 && "(" + like.count + ")"}
                  </span>
                </button>
              ) : (
                <button
                {...(loading && { disabled: true })}
                  onClick={() => LikeComment()}
                  className="border flex items-center space-x-1 py-1 px-2 rounded-lg text-xs hover:text-red-500 hover:border-red-500"
                >
                  <AiOutlineLike className="text-base" />
                  <span>
                    Beğen {like.count > 0 && "(" + like.count + ")"}
                  </span>
                </button>
              )}

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
