import React, { useCallback, useEffect, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import SwiperProfile from "~/components/SwiperProfile";
import { useFavoriteBusiness } from "~/components/useInfiniteScrolling";
import seoHelp from "~/hooks/seoHelp";
import { Link } from "react-router-dom";
import moment from "moment";
import { Rate, Skeleton } from "antd";
import { BsBookmark, BsGeoAltFill, BsHeart } from "react-icons/bs";
import { AiFillLike, AiOutlineLike } from "react-icons/ai";
import LoginModal from "~/components/LoginModal";

const kaydedilenisletmeler = () => {
  const [existUser, handleChange, userProfile, API, API_KEY, API_IMAGES] =
    useOutletContext();
  const [loadingLike, setLoadingLike] = useState(false);
  const [loginModal, setLoginModal] = useState(false);

  //buradan
  const [pageNumber, setPageNumber] = useState(1);

  const { businesses, setBusinesses, hasMore, loading, error } =
    useFavoriteBusiness(userProfile.userId, pageNumber, API, API_KEY);

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

  const LikeBusiness = async () => {
    if (existUser !== null) {
      setLoadingLike(true);
      await fetch(API + "/FavoriteBusiness", {
        method: "POST",
        headers: {
          ApiKey: API_KEY,
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          businessId: data.id,
          userId: existUser.id,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          setLoadingLike(false);
          if (data.statusCode == 200) {
            const newItems = [...businesses];
            newItems[index].likedUsers.push(parseInt(existUser.id));
            setBusinesses(newItems);
          }
        });
    } else {
      handleLoginModal(true);
    }
  };

  const UnlikeBusiness = async () => {
    setLoadingLike(true);
    await fetch(
      API + `/FavoriteBusiness?businessId=${data.id}&userid=${existUser.id}`,
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
          const newItems = [...businesses];
          newItems[index].likedUsers = newItems[index].likedUsers.filter(
            (x) => x !== parseInt(existUser.id)
          );
          setBusinesses(newItems);
        }
      })
      .catch((err) => console.log(err));
  };

  const handleLoginModal = (state) => {
    setLoginModal(state);
  };

  return (
    <div className="space-y-4">
      {businesses.map((business, index) => {
        if (businesses.length === index + 1) {
          return (
            <div
              ref={lastCommentElementRef}
              key={index}
              className="bg-white w-full"
            >
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
            </div>
          );
        } else {
          return (
            <div key={index} className="bg-white w-full">
              {business.businessName}
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

export default kaydedilenisletmeler;
