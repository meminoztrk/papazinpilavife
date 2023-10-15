import { Empty, Skeleton } from "antd";
import { useEffect, useState } from "react";
import { useOutletContext } from "react-router-dom";
import ImageWithCommentModal from "~/components/ImageWithCommentModal";

const fotograflar = () => {
  const [existUser, handleChange, userProfile, API, API_KEY, API_IMAGES] =
    useOutletContext();
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openModal, setOpenModal] = useState({
    visible: false,
    data: { images: [] },
    currentIndex: 0,
  });

  useEffect(async () => {
    const fetchImages = async () => {
      setLoading(true);
      await fetch(
        `${API}/Business/GetPreviewImagesByUserId?userId=${userProfile.userId}`,
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
          console.log(data.data);
          setImages(data.data);
          setOpenModal({ ...openModal, data: { images: data.data } });
          setLoading(false);
        });
    };

    await fetchImages();
  }, []);

  useEffect(() => {
    openModal.visible
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
  }, [openModal]);

  return (
    <div>
      <div className="bg-white pb-20 p-4">
        <div className="flex items-center flex-wrap">
          {images.length > 0 ? (
            images.map((image, i) => (
              <div
                key={i}
                className="w-1/2 p-2 hover:cursor-pointer"
                onClick={() =>
                  setOpenModal({
                    visible: true,
                    data: { images: images },
                    currentIndex: i,
                  })
                }
              >
                <div className="relative">
                  <img
                    className="aspect-square w-full rounded object-cover"
                    src={`${API_IMAGES}/business/${image}`}
                    alt={image}
                  />
                  <div className="absolute rounded-lg bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,10%,16%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                </div>
              </div>
            ))
          ) : (
            <div className="mx-auto bg-white mt-14">
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={"Beğenilen Yorum Bulunamadı"}
              />
            </div>
          )}
        </div>
        {loading && (
          <div className="flex items-center flex-wrap">
            <div className="w-1/2 p-2">
              <Skeleton.Image className="w-full h-60" active={true} />
            </div>
            <div className="w-1/2 p-2">
              <Skeleton.Image className="w-full h-60" active={true} />
            </div>
          </div>
        )}
      </div>
      {openModal.visible && (
        <ImageWithCommentModal
          setModal={setOpenModal}
          imageData={openModal}
          IMAGES={API_IMAGES}
        />
      )}
    </div>
  );
};

export default fotograflar;
