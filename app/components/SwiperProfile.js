import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { useCallback, useEffect, useRef, useState } from "react";
import { Link } from "@remix-run/react";

const SwiperProfile = ({}) => {
  const [nexthide, setNexthide] = useState(false);
  const [prevhide, setPrevhide] = useState(true);
  const sliderRef = useRef(null);
 
  const handlePrev = useCallback(() => {
    if (!sliderRef.current) return;
    setNexthide(false)
    const swRef = sliderRef.current.swiper;
    swRef.activeIndex == 0 && setPrevhide(true);
  }, []);

  const handleNext = useCallback(() => {
    if (!sliderRef.current) return;
    setPrevhide(false)
    const swRef = sliderRef.current.swiper;
    swRef.imagesLoaded - swRef.activeIndex == 1 && setNexthide(true);
  }, []);

  useEffect(() => {
    if(sliderRef.current.swiper.imagesLoaded == 1){
        setNexthide(true)
        setPrevhide(true)
    }
  }, []);

  return (
    <>
      <div
        className={`swiper-button-prev-un cursor-pointer ${prevhide ? 'hidden' : ''}`}
        onClick={handlePrev}
      ></div>
      <Swiper
        ref={sliderRef}
        pagination={{
          type: "fraction",
        }}
        modules={[Navigation, Pagination]}
        navigation={{
          nextEl: ".swiper-button-next-un",
          prevEl: ".swiper-button-prev-un",
        }}
        // navigation={true}
        className="profileSwiper"
      >
        <SwiperSlide>
          <Link to={`#`}>
            <img
              className="w-full aspect-square object-cover "
              src="https://s3-media0.fl.yelpcdn.com/bphoto/UT9Aryi6x-UPKa8oHJR3tA/o.jpg"
              alt=""
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to={`#`}>
            <img
              className="w-full aspect-square object-cover "
              src="https://s3-media0.fl.yelpcdn.com/bphoto/UT9Aryi6x-UPKa8oHJR3tA/o.jpg"
              alt=""
            />
          </Link>
        </SwiperSlide>
        <SwiperSlide>
          <Link to={`#`}>
            <img
              className="w-full aspect-square object-cover "
              src="https://s3-media0.fl.yelpcdn.com/bphoto/UT9Aryi6x-UPKa8oHJR3tA/o.jpg"
              alt=""
            />
          </Link>
        </SwiperSlide>
      </Swiper>
      <div
        className={`swiper-button-next-un cursor-pointer ${nexthide ? 'hidden' : ''}`}
        onClick={handleNext}
      ></div>
    </>
  );
};

export default SwiperProfile;
