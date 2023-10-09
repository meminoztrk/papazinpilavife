import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import ImageWithCommentModal from "./ImageWithCommentModal";
import { useEffect, useState } from "react";

const SwiperProfile = ({ comment, user, API_IMAGES }) => {
  const [openModal, setOpenModal] = useState({
    visible: false,
    data: { images: comment.images },
    currentIndex: 0,
  });

  useEffect(() => {
    openModal.visible
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
  }, [openModal]);

  return (
    <>
      {comment.images && comment.images.length > 0 ? (
        <Swiper
          pagination={{
            type: "fraction",
          }}
          navigation={true}
          modules={[Navigation, Pagination]}
          className="profileSwiper bg-black cursor-pointer"
        >
          {comment.images.map((image, index) => (
            <SwiperSlide key={index}>
              <div
                onClick={() =>
                  setOpenModal({
                    visible: true,
                    data: {
                      images: comment.images,
                      name: user.name,
                      surname: user.surname,
                      userImage: user.userPhoto,
                      rate: comment.rate,
                      totalComment: user.totalComment,
                      comment: comment.comment,
                      commentType: comment.commentType,
                      created: comment.created
                    },
                    currentIndex: index,
                  })
                }
              >
                <img
                  className="w-full aspect-square object-cover"
                  src={`${API_IMAGES}/business/${image}`}
                  alt={image}
                  placeholder="blur"
                  blurdataurl={
                    "https://s3-media0.fl.yelpcdn.com/bphoto/UT9Aryi6x-UPKa8oHJR3tA/o.jpg"
                  }
                />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <div></div>
      )}
      {openModal.visible && (
        <ImageWithCommentModal
          setModal={setOpenModal}
          imageData={openModal}
          IMAGES={API_IMAGES}
        />
      )}
    </>
  );
};

export default SwiperProfile;
