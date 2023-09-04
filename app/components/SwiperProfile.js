import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { Link } from "@remix-run/react";

const SwiperProfile = () => {

  return (
    <>
      <Swiper
        pagination={{
          type: "fraction",
        }}       
        navigation={true}
        modules={[Navigation, Pagination]}
        className="profileSwiper bg-black"
      >
        <SwiperSlide key={1}>
          <Link to="/">
            <img
              className="w-full aspect-square object-cover"
              src="https://s3-media0.fl.yelpcdn.com/bphoto/UT9Aryi6x-UPKa8oHJR3tA/o.jpg"
              alt=""
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide key={2}>
          <Link to="/">
            <img
              className="w-full aspect-square object-cover"
              src="https://s3-media0.fl.yelpcdn.com/bphoto/c-bXSP131v68zxoEn_fCXA/o.jpg"
              alt=""
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide key={3}>
          <Link to="/">
            <img
              className="w-full aspect-square object-cover"
              src="https://s3-media0.fl.yelpcdn.com/bphoto/g2Io35QbsmlycPstkewxhg/o.jpg"
              alt=""
            />
          </Link>
        </SwiperSlide>
      </Swiper>
    </>
  );
};

export default SwiperProfile;
