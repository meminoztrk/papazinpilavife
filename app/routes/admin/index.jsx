import { Navigation, Pagination, Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from "swiper/react";

export default function JokesIndexRoute() {

  const handleChange = (value) => {
    console.log(`selected ${value}`);
  };

  return (
    <div>
      <p>Here's a random joke:</p>
      <p className="text-yellow-500">
        I was wondering why the frisbee was getting bigger,
        then it hit me.
      </p>
    </div>
  );
}