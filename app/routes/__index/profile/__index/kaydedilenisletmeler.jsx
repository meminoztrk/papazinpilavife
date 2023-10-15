import { useCallback, useRef, useState } from "react";
import { useOutletContext } from "react-router-dom";
import { useFavoriteBusiness } from "~/components/useInfiniteScrolling";
import seoHelp from "~/hooks/seoHelp";
import { Link } from "react-router-dom";
import { Empty, Rate, Skeleton } from "antd";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";
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

  const LikeBusiness = async (businessId, index) => {
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
          businessId: businessId,
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

  const UnlikeBusiness = async (businessId, index) => {
    setLoadingLike(true);
    await fetch(
      API + `/FavoriteBusiness?businessId=${businessId}&userid=${existUser.id}`,
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

  const splitItem = (text) => {
    return text != null ? text.split(",,") : null;
  };

  return (
    <div className="pb-20 p-2 bg-white flex flex-wrap">
      {businesses.length > 0 ? (
        businesses.map((business, index) => {
          if (businesses.length === index + 1) {
            return (
              <div
                ref={lastCommentElementRef}
                key={index}
                className="bg-white w-1/2"
              >
                <div className="p-1">
                  <div className="relative group shadow hover:shadow-lg cursor-pointer rounded-lg p-2">
                    <div className="absolute right-2 top-2 text-white hidden group-hover:flex ml-auto">
                      {existUser != null &&
                      business.likedUsers.includes(parseInt(existUser.id)) ? (
                        <button
                          {...(loadingLike && { disabled: true })}
                          onClick={() => UnlikeBusiness(business.id, index)}
                          className="m-2 bg-red-500 rounded-full p-2"
                        >
                          <AiFillHeart size={24} />
                        </button>
                      ) : (
                        <button
                          {...(loadingLike && { disabled: true })}
                          onClick={() => LikeBusiness(business.id, index)}
                          className="m-2 bg-red-500 rounded-full p-2"
                        >
                          <AiOutlineHeart size={24} />
                        </button>
                      )}
                    </div>

                    <Link
                      to={`/isletme/${seoHelp(business.businessName)}-${
                        business.id
                      }`}
                      className="hover:text-black"
                    >
                      <div>
                        <img
                          className="aspect-square w-full rounded-lg object-cover"
                          src={`${API_IMAGES}business/thumbnail${business.businessImage}`}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1 px-1">
                        <p className="text-[15px] font-medium text-left">
                          {business.businessName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 px-1 text-xs">
                        <Rate
                          className="text-[13px] text-red-500 font-bold"
                          disabled
                          defaultValue={business.rate}
                        />
                        <span className="pt-[2px]">{business.rate}</span>
                        <span className="pt-[2px] text-[11px]">
                          ({business.totalComment} yorum)
                        </span>
                      </div>
                      <span className="block italic text-xs px-1 py-1">
                        <span className="not-italic font-medium">
                          {business.businessType}
                        </span>{" "}
                        {business.foodTypes &&
                          splitItem(business.foodTypes)
                            .slice(0, 2)
                            .map((food, i) => (
                              <span key={i}>
                                #{food.toLocaleLowerCase("tr")}
                                {i == 1 ? "" : ", "}
                              </span>
                            ))}
                        {" - "}
                        {business.businessServices &&
                          splitItem(business.businessServices)
                            .slice(0, 3)
                            .map((service, i) => (
                              <span key={i}>
                                #{service.toLocaleLowerCase("tr")}
                                {i == 2 ? "" : ", "}
                              </span>
                            ))}
                      </span>
                      <span className="block text-xs px-1">
                        {business.location}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          } else {
            return (
              <div key={index} className="bg-white w-1/2">
                <div className="p-1">
                  <div className="relative group shadow hover:shadow-lg cursor-pointer rounded-lg p-2">
                    <div className="absolute right-2 top-2 text-white hidden group-hover:flex ml-auto">
                      {existUser != null &&
                      business.likedUsers.includes(parseInt(existUser.id)) ? (
                        <button
                          {...(loadingLike && { disabled: true })}
                          onClick={() => UnlikeBusiness(business.id, index)}
                          className="m-2 bg-red-500 rounded-full p-2"
                        >
                          <AiFillHeart size={24} />
                        </button>
                      ) : (
                        <button
                          {...(loadingLike && { disabled: true })}
                          onClick={() => LikeBusiness(business.id, index)}
                          className="m-2 bg-red-500 rounded-full p-2"
                        >
                          <AiOutlineHeart size={24} />
                        </button>
                      )}
                    </div>

                    <Link
                      to={`/isletme/${seoHelp(business.businessName)}-${
                        business.id
                      }`}
                      className="hover:text-black"
                    >
                      <div>
                        <img
                          className="aspect-square w-full rounded-lg object-cover"
                          src={`${API_IMAGES}business/thumbnail${business.businessImage}`}
                        />
                      </div>
                      <div className="flex items-center justify-between pt-1 px-1">
                        <p className="text-[15px] font-medium text-left">
                          {business.businessName}
                        </p>
                      </div>
                      <div className="flex items-center space-x-1 px-1 text-xs">
                        <Rate
                          className="text-[13px] text-red-500 font-bold"
                          disabled
                          defaultValue={business.rate}
                        />
                        <span className="pt-[2px]">{business.rate}</span>
                        <span className="pt-[2px] text-[11px]">
                          ({business.totalComment} yorum)
                        </span>
                      </div>
                      <span className="block italic text-xs px-1 py-1">
                        <span className="not-italic font-medium">
                          {business.businessType}
                        </span>{" "}
                        {business.foodTypes &&
                          splitItem(business.foodTypes)
                            .slice(0, 2)
                            .map((food, i) => (
                              <span key={i}>
                                #{food.toLocaleLowerCase("tr")}
                                {i == 1 ? "" : ", "}
                              </span>
                            ))}
                        {" - "}
                        {business.businessServices &&
                          splitItem(business.businessServices)
                            .slice(0, 3)
                            .map((service, i) => (
                              <span key={i}>
                                #{service.toLocaleLowerCase("tr")}
                                {i == 2 ? "" : ", "}
                              </span>
                            ))}
                      </span>
                      <span className="block text-xs px-1">
                        {business.location}
                      </span>
                    </Link>
                  </div>
                </div>
              </div>
            );
          }
        })
      ) : (
        <div className="mx-auto mt-14">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description={"Kaydedilen İşletme Bulunamadı"}
          />
        </div>
      )}

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
