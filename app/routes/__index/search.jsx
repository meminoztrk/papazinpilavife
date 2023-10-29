import { useLoaderData, useLocation } from "@remix-run/react";
import { AiOutlineMenu } from "react-icons/ai";
import { Link } from "@remix-run/react";
import seoHelp from "./../../hooks/seoHelp";
import { redirect } from "@remix-run/node";
import { Empty, Pagination, Rate, Result, Select, Skeleton } from "antd";
import { BsFillChatLeftFill, BsThreeDots } from "react-icons/bs";
import { useEffect, useState } from "react";

export const loader = async ({ request }) => {
  const params = new URL(request.url).searchParams;
  const text = params.get("text");
  const location = params.get("location");
  if (!location) {
    return redirect("404");
  }
  const data = {};
  data.API = process.env.REACT_APP_API;
  data.API_KEY = process.env.REACT_APP_API_KEY;
  data.IMAGES = process.env.REACT_APP_IMAGES;
  data.PARAMS = { text: text, location: location };

  return data;
};

const Search = () => {
  const { data, API, API_KEY, IMAGES, PARAMS } = useLoaderData();
  const location = useLocation();
  const [businesses, setBusinesses] = useState({});
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [formPagination, setFormPagination] = useState({
    isMostReview: true,
    page: 1,
    currentPage: 1,
  });

  const getPaginationComment = async (ent) => {
    await fetch(
      API +
        `/Business/GetBusinessWithCountBySearching?provinceId=${
          PARAMS.location
        }&isMostReview=${ent.isMostReview}&page=${
          ent.currentPage
        }&take=${10}&search=${PARAMS.text}`,
      {
        method: "GET",
        headers: {
          ApiKey: API_KEY,
          "Content-Type": "application/json",
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setBusinesses(data.data);
        console.log(data.data);
        setPaginationLoading(false);
      });
  };

  useEffect(() => {
    setPaginationLoading(true);
    const timer = setTimeout(
      async () => await getPaginationComment(formPagination),
      500
    );
    return () => clearTimeout(timer);
  }, [formPagination, location]);

  const splitItem = (text) => {
    return text != null ? text.split(",,") : null;
  };

  return (
    <div className="mt-36">
      <div className="w-full bg-white rounded-lg p-8 flex flex-col gap-y-8">
        <div className="py-2 flex items-center justify-between">
          <span className="text-lg font-semibold leading-3 tracking-tight">
            {!paginationLoading ? (
              `${businesses.provinceName} konumunda "${PARAMS.text}" ile ilgili eşleşen sonuçlar: ${businesses.businessCount}`
            ) : (
              <Skeleton.Button
                className="w-60"
                active
                size="small"
                shape="round"
              />
            )}
          </span>
          <div className="flex items-center space-x-2">
            <span className="font-normal">Sıralama:</span>
            <Select
              onChange={(e) => {
                setFormPagination({
                  ...formPagination,
                  isMostReview: e,
                  currentPage: 1,
                });
              }}
              defaultValue={true}
              options={[
                {
                  value: true,
                  label: "En Çok Değerlendirilen",
                },
                {
                  value: false,
                  label: "En Yüksek Puan",
                },
              ]}
            />
          </div>
        </div>

        {paginationLoading ? (
          <div className="space-y-8">
            <Skeleton active />
            <Skeleton active />
            <Skeleton active />
          </div>
        ) : businesses &&
          businesses.businessesBySearching &&
          businesses.businessesBySearching.length > 0 ? (
          businesses.businessesBySearching.map((bus, i) => (
            <div key={i} className="flex gap-x-4 relative">
              <div className="absolute right-2 top-0">
                <BsThreeDots className="text-xl" />
              </div>
              <div className="md:w-1/6 w-[95%] border rounded-lg">
                <img
                  className="aspect-square w-full rounded-lg object-cover"
                  src={`${IMAGES}/business/thumbnail${bus.businessImage}`}
                />
              </div>
              <div className="flex flex-col">
                <h1 className="text-xl font-bold tracking-tight">
                  {bus.businessName}
                </h1>
                <span className="text-gray-500 pl-[2px]">{bus.location}</span>
                <div className="mt-2 flex space-x-2 items-center">
                  <Rate
                    className="text-[15px] text-red-500 font-bold bg-red-300 px-1 rounded"
                    disabled
                    allowHalf
                    defaultValue={bus.rate}
                  />
                  <span className="text-xs text-gray-400">
                    {bus.totalComment} yorum
                  </span>
                </div>
                <span className="mt-2 text-gray-500">
                  {bus.foodTypes &&
                    splitItem(bus.foodTypes).map((food, i) => (
                      <span key={i}>
                        #{food.toLocaleLowerCase("tr")}
                        {splitItem(bus.foodTypes).length - 1 == i ? "" : ", "}
                      </span>
                    ))}
                </span>

                <div className="flex flex-wrap items-center text-xs">
                  {bus.businessServices &&
                    splitItem(bus.businessServices)
                      .slice(0, 8)
                      .map((service, i) => (
                        <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                          {service}
                        </span>
                      ))}

                  {bus.businessProps &&
                    splitItem(bus.businessProps)
                      .slice(0, 8)
                      .map((prop, i) => (
                        <span className="p-1 mr-2 mt-1 border rounded border-gray-400">
                          {prop}
                        </span>
                      ))}
                </div>
                <div className="mt-2 text-xs text-gray-400">
                  <div className="flex items-center ">
                    <BsFillChatLeftFill className="mr-1" />{" "}
                    {bus.searchCommentCount} yorumda bahsediliyor: {PARAMS.text}
                  </div>
                  <span>{bus.searchComment}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            {/* <Empty
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={"Sonuç Bulunamadı"}
            /> */}
            <Result
              status="404"
              title="İşletme bulunamadı"
              subTitle="Üzgünüz,bu bölgede aramak istediğiniz işletme mevcut değil."
              extra={
                <Link to={"/"}>
                  {/* <Button type="primary" danger>
                    Ana sayfaya dön
                  </Button> */}
                </Link>
              }
            />
          </div>
        )}

        <div className="flex justify-center py-5">
          <Pagination
            onChange={(e) => {
              setFormPagination({
                ...formPagination,
                page: e,
                currentPage: e,
              });
            }}
            defaultCurrent={1}
            current={formPagination.currentPage}
            total={
              businesses
                ? businesses.businessCount == 0
                  ? 1
                  : businesses.businessCount
                : 1
            }
            showSizeChanger={false}
            pageSize={10}
          />
        </div>
      </div>
    </div>
  );
};

export default Search;
