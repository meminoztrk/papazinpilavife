import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper";
import { Link } from "@remix-run/react";


const SwiperMenu = () => {
  return (
    <>
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
    </>
  );
};

export default SwiperMenu;
