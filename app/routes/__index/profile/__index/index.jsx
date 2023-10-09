import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import SwiperProfile from "~/components/SwiperProfile";
import {useCommentSearch} from "~/components/useInfiniteScrolling";
import seoHelp from "~/hooks/seoHelp";
import { Link } from "react-router-dom";
import moment from "moment";
import { Rate, Skeleton } from "antd";
import { BsBookmark, BsGeoAltFill, BsHeart } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import LoginModal from "~/components/LoginModal";

const reviews = () => {
  const [existUser, handleChange, userProfile, API, API_KEY, API_IMAGES] =
    useOutletContext();
  const [loadingLike, setLoadingLike] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  //buradan
  const [pageNumber, setPageNumber] = useState(1);

  const { comments, setComments, hasMore, loading, error } = useCommentSearch(
    userProfile.userId,
    pageNumber,
    API,
    API_KEY
  );

  const observer = useRef();
  const lastCommentElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  //buraya

  const LikeComment = async (id, index) => {
    if (existUser !== null) {
      setLoadingLike(true);
      await fetch(API + "/FavoriteComment", {
        method: "POST",
        headers: {
          ApiKey: API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          businessCommentId: id,
          userId: existUser.id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoadingLike(false);
          if (data.statusCode == 200) {
            const newItems = [...comments];
            newItems[index].likedUsers.push(parseInt(existUser.id));
            setComments(newItems);
          }
        });
    } else {
      handleLoginModal(true);
    }
  };

  const DeleteComment = async (id, index) => {
    setLoadingLike(true);
    await fetch(
      API + `/FavoriteComment?businessCommentId=${id}&userid=${existUser.id}`,
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
        setLoadingLike(false);
        if (data.statusCode == 200) {
          const newItems = [...comments];
          newItems[index].likedUsers = newItems[index].likedUsers.filter(
            (x) => x !== parseInt(existUser.id)
          );
          setComments(newItems);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleLoginModal = (state) => {
    setLoginModal(state);
  };

  return (
    <div className="space-y-4">
      {comments.map((comment, index) => {
        if (comments.length === index + 1) {
          return (
            <div
              ref={lastCommentElementRef}
              key={index}
              className="bg-white w-full"
            >
              <div className="p-4">
                <div className="flex gap-x-3">
                  <img
                    className="w-16 h-16 rounded"
                    src={`${API_IMAGES}business/thumbnail${comment.businessImage}`}
                  />
                  <div className="flex-col flex">
                    <div>
                      <span>
                        <Link
                          target="_blank"
                          to={`/isletme/${
                            seoHelp(comment.businessName) +
                            "-" +
                            comment.businessId
                          }`}
                          className="hover:text-red-500 font-bold text-[15px]"
                        >
                          {comment.businessName}
                        </Link>
                      </span>
                    </div>
                    <span className="text-xs flex items-center">
                      <BsGeoAltFill className="text-gray-500 mr-1" />{" "}
                      {comment.location}
                    </span>
                    <span className="text-xs pt-2 text-gray-400">
                      {moment(comment.created).format("DD.MM.yyyy")} tarihinde
                      yorum yapıldı.
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  <Rate
                    className="text-[15px] text-red-500 font-bold"
                    disabled
                    defaultValue={comment.rate}
                  />
                </div>
                <div className="pt-1">{comment.comment}</div>
              </div>
              <div className="relative">
                <SwiperProfile
                  comment={comment}
                  user={userProfile}
                  API_IMAGES={API_IMAGES}
                />
              </div>
              <div className="p-4 flex items-center gap-x-3 text-xs">
                {existUser != null &&
                comment.likedUsers.includes(parseInt(existUser.id)) ? (
                  <button
                    {...(loadingLike && { disabled: true })}
                    onClick={() => DeleteComment(comment.id, index)}
                    className="flex items-center gap-x-1 text-red-500 border-red-500"
                  >
                    <AiFillLike className="text-base" />
                    <span>
                      Beğen{" "}
                      {comment.likedUsers.count > 0 &&
                        "(" + comment.likedUsers.count + ")"}
                    </span>
                  </button>
                ) : (
                  <button
                    {...(loadingLike && { disabled: true })}
                    onClick={() => LikeComment(comment.id, index)}
                    className="flex items-center gap-x-1  hover:text-red-500 hover:border-red-500"
                  >
                    <AiOutlineLike className="text-base" />
                    <span>
                      Beğen{" "}
                      {comment.likedUsers.count > 0 &&
                        "(" + comment.likedUsers.count + ")"}
                    </span>
                  </button>
                )}
                <button className="flex items-center gap-x-1 hover:text-red-500">
                  <BsBookmark />
                  Kaydet
                </button>
              </div>
            </div>
          );
        } else {
          return (
            <div key={index} className="bg-white w-full">
              <div className="p-4">
                <div className="flex gap-x-3">
                  <img
                    className="w-16 h-16 rounded"
                    src={`${API_IMAGES}business/thumbnail${comment.businessImage}`}
                  />
                  <div className="flex-col flex">
                    <div>
                      <span>
                        <Link
                          target="_blank"
                          to={`/isletme/${
                            seoHelp(comment.businessName) +
                            "-" +
                            comment.businessId
                          }`}
                          className="hover:text-red-500 font-bold text-[15px]"
                        >
                          {comment.businessName}
                        </Link>
                      </span>
                    </div>
                    <span className="text-xs flex items-center">
                      <BsGeoAltFill className="text-gray-500 mr-1" />{" "}
                      {comment.location}
                    </span>
                    <span className="text-xs pt-2 text-gray-400">
                      {moment(comment.created).format("DD.MM.yyyy")} tarihinde
                      yorum yapıldı.
                    </span>
                  </div>
                </div>
                <div className="pt-2">
                  <Rate
                    className="text-[15px] text-red-500 font-bold"
                    disabled
                    defaultValue={comment.rate}
                  />
                </div>
                <div className="pt-1">{comment.comment}</div>
              </div>
              <div className="relative">
                <SwiperProfile
                  comment={comment}
                  user={userProfile}
                  API_IMAGES={API_IMAGES}
                />
              </div>
              <div className="p-4 flex items-center gap-x-3 text-xs">
                {existUser != null &&
                comment.likedUsers.includes(parseInt(existUser.id)) ? (
                  <button
                    {...(loadingLike && { disabled: true })}
                    onClick={() => DeleteComment(comment.id, index)}
                    className="flex items-center gap-x-1 text-red-500 border-red-500"
                  >
                    <AiFillLike className="text-base" />
                    <span>
                      Beğen{" "}
                      {comment.likedUsers.count > 0 &&
                        "(" + comment.likedUsers.count + ")"}
                    </span>
                  </button>
                ) : (
                  <button
                    {...(loadingLike && { disabled: true })}
                    onClick={() => LikeComment(comment.id, index)}
                    className="flex items-center gap-x-1  hover:text-red-500 hover:border-red-500"
                  >
                    <AiOutlineLike className="text-base" />
                    <span>
                      Beğen{" "}
                      {comment.likedUsers.count > 0 &&
                        "(" + comment.likedUsers.count + ")"}
                    </span>
                  </button>
                )}
                <button className="flex items-center gap-x-1 hover:text-red-500">
                  <BsBookmark />
                  Kaydet
                </button>
              </div>
            </div>
          );
        }
      })}
      <div>{loading && <Skeleton active />}</div>
      <div>{error && "Error"}</div>
      <LoginModal
        API={API}
        API_KEY={API_KEY}
        loginModal={loginModal}
        handleLoginModal={handleLoginModal}
      />
    </div>
  );
};

export default reviews;
