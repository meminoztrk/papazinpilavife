import React, { useRef, useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import CommentSwiper from "./CommentSwiper";
import {
  BsGeoAltFill,
  BsXCircle,
  BsArrowRightShort,
  BsArrowLeftShort,
} from "react-icons/bs";
import { Rate } from "antd";
import { AiOutlineComment, AiOutlineLike } from "react-icons/ai";
import moment from "moment";



const ImageWithCommentModal = ({ setModal, imageData, IMAGES }) => {
  // const links = [
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/jMQZojTqKvu3zw7Ap2E_Kg/o.jpg",
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/EYJoczvLzSXTWap54cTfPQ/o.jpg",
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/jMQZojTqKvu3zw7Ap2E_Kg/o.jpg",
  //   "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  //   // "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  // ];

  useEffect(async () => {
    console.log(imageData);
    let existLast = false;
    let c = 0;
    let index = imageData.currentIndex;
    const div = document.getElementById("myDiv");
    const rect = div.getBoundingClientRect();
    const elements = document.querySelector(".slider");
    const activity = document.querySelector(".activity");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const nextImage = document.querySelector(".nextImage");
    const prevImage = document.querySelector(".prevImage");
    const image = document.querySelector(".currentImage"); // seçili resim
    image.src =
      IMAGES + "/business/" + imageData.data.images[imageData.currentIndex];
    elements.children[imageData.currentIndex].firstChild.style.border =
      "2px solid #B52100";

    const anim = () => (elements.style.transform = `translateX(-${c * 100}%)`);

    const prev = (e) => {
      handleImage(e);
      handleResize();
      c = c == 0 ? 0 : c - 1;
      anim();
    };

    const next = (e) => {
      handleImage(e);
      handleResize();
      c = existLast ? c : c + 1;
      anim();
    };

    const prevArrow = (e) => {
      handleResize();
      c = c == 0 ? 0 : c - 1;
      anim();
    };

    const nextArrow = (e) => {
      handleResize();
      c = existLast ? c : c + 1;
      anim();
    };

    const handleImage = (e) => {
      for (let item of elements.children) {
        item.firstChild.style.border = null;
      }
      if (e.target.tagName === "IMG") {
        image.src = e.target.src;
        index = parseInt(e.target.getAttribute("data-id"));
        e.target.style.border = "2px solid #B52100";
      } else {
        image.src = e.target.firstChild.src;
        e.target.firstChild.style.border = "2px solid #B52100";
        index = parseInt(e.target.firstChild.getAttribute("data-id"));
      }
    };

    const handleImageBorder = (e) => {
      for (let item of elements.children) {
        item.firstChild.style.border = null;
      }
      e.style.border = "2px solid #B52100";
    };

    const prevImageHandle = () => {
      for (let item of elements.children) {
        if (
          index != 0 &&
          item.firstChild.getAttribute("data-id") == index - 1
        ) {
          index -= 1;
          handleImageBorder(item.firstChild);
          image.src = item.firstChild.src;
          checkSliderImagePosition(item);
          break;
        }
      }
    };

    const nextImageHandle = () => {
      for (let item of elements.children) {
        if (item.firstChild.getAttribute("data-id") == index + 1) {
          index += 1;
          handleImageBorder(item.firstChild);
          image.src = item.firstChild.src;
          checkSliderImagePosition(item);
          break;
        }
      }
    };

    const checkSliderImagePosition = (item) => {
      const elrect = item.getBoundingClientRect();
      if (elrect.right > rect.right) {
        handleResize();
        c = existLast ? c : c + 1;
        anim();
      } else if (elrect.left < rect.left) {
        handleResize();
        c = c == 0 ? 0 : c - 1;
        anim();
      }
    };

    prevButton.addEventListener("click", prevArrow);
    nextButton.addEventListener("click", nextArrow);

    prevImage.addEventListener("click", prevImageHandle);
    nextImage.addEventListener("click", nextImageHandle);

    async function handleResize() {
      activity.style.pointerEvents = "none";
      console.log("İÇERDEYİZ");
      await setTimeout(() => {
        existLast = true;
        for (let item of elements.children) {
          const elrect = item.getBoundingClientRect();
          if (elrect.right > rect.right) {
            item.removeEventListener("click", prev);
            item.addEventListener("click", next);
            existLast = false;
          } else if (elrect.left < rect.left) {
            item.removeEventListener("click", next);
            item.addEventListener("click", prev);
          } else {
            var new_element = item.cloneNode(true);
            item.parentNode.replaceChild(new_element, item);
            new_element.addEventListener("click", handleImage);
          }
        }
        existLast
          ? (nextButton.style.pointerEvents = "none")
          : (nextButton.style.pointerEvents = "inherit");

        c == 0
          ? (prevButton.style.pointerEvents = "none")
          : (prevButton.style.pointerEvents = "inherit");

        activity.style.pointerEvents = "inherit";
      }, 550);
    }

    await handleResize();

    window.addEventListener("resize", handleResize);
    return window.addEventListener("resize", handleResize);
  }, []);

  return (
    <div className="z-50 fixed right-0 top-0 bottom-0 left-0 flex flex-col m-0 p-10 bg-black bg-opacity-80">
      <div className="relative bg-white h-full w-full flex rounded-lg">
        <div className="group w-2/3 flex justify-center relative h-auto bg-black rounded-l-lg text-white select-none">
          <div className="flex justify-center select-none">
            <img
              className="object-contain w-full h-full currentImage select-none"
              // src="https://dynamic-media-cdn.tripadvisor.com/media/photo-o/2a/63/75/fd/caption.jpg?w=1200&h=-1&s=1"
              alt=""
            />
          </div>

          <div className="hidden group-hover:block">
            <div className="absolute rounded-full hover:bg-gray-700 left-1 hover:cursor-pointer top-[calc(50%-30px)] p-1 select-none prevImage">
              <BsArrowLeftShort size={35} />
            </div>
            <div className="absolute rounded-full hover:bg-gray-700 right-1 hover:cursor-pointer top-[calc(50%-30px)] p-1 select-none nextImage">
              <BsArrowRightShort size={35} />
            </div>
          </div>

          {/* <div className="hidden group-hover:flex absolute bottom-2 justify-center items-center space-x-4 p-2 test"> */}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-500 ease-out flex items-center absolute bottom-0 left-0 right-0 justify-start bg-black activity select-none">
            <div className="prev bottom-0 rounded-full hover:bg-gray-700 left-1 hover:cursor-pointer p-1 select-none">
              <BsArrowLeftShort size={35} />
            </div>
            <div
              className="slider-wrapper w-full flex items-center bg-black py-2 select-none"
              id="myDiv"
            >
              <div className="slider select-none space-x-1">
                {imageData.data.images.map((link, index) => (
                  <div
                    key={index}
                    className="hover:cursor-pointer item select-none"
                  >
                    <img
                      key={index}
                      data-id={index}
                      className="w-10 h-10 object-cover rounded select-none"
                      src={IMAGES + "/business/" + link}
                      alt={link}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="next rounded-full hover:bg-gray-700 bottom-0 right-1 hover:cursor-pointer p-1 select-none">
              <BsArrowRightShort size={35} />
            </div>
          </div>
        </div>

        <div className="w-1/3 h-auto overflow-auto rounded-r-lg">
          {imageData.data.businessName ? (
            <div className="p-4">
              <div className="flex gap-x-3">
                <img
                  className="w-16 h-16 rounded-lg"
                  src={IMAGES + "/business/" + imageData.data.images[0]}
                />
                <div className="flex flex-col">
                  <div className="flex-col flex">
                    <span className="font-bold text-base">
                      {imageData.data.businessName}
                    </span>
                    <span className="text-xs flex items-center">
                      <BsGeoAltFill className="text-gray-500 mr-1" />
                      {imageData.data.neighborhood}, {imageData.data.district} /{" "}
                      {imageData.data.city}
                    </span>
                  </div>
                  <div className="mt-1">
                    <Rate
                      className="text-[13px] text-red-500 font-bold bg-white rounded-lg mr-2"
                      disabled
                      allowHalf
                      defaultValue={imageData.data.rate}
                    />
                    <span className="text-gray-600 font-extralight">
                      {imageData.data.rate} ({imageData.data.commentCount}{" "}
                      inceleme)
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-3 text-[15px]">{imageData.data.minHeader}</div>

              <div className="pt-3 italic">{imageData.data.about}</div>
            </div>
          ) : (
            <div className="p-4 flex flex-col overflow-auto">
              <div className="flex gap-x-3">
                <img
                  className="w-16 h-16 rounded-lg"
                  src={IMAGES + "/user/" + imageData.data.userImage}
                />
                <div className="flex flex-col">
                  <div className="flex-col flex">
                    <span className="font-semibold">
                      {imageData.data.name} {imageData.data.surname[0]}.
                    </span>
                    <span className="text-xs flex items-center">
                      {imageData.data.totalComment} yorum
                    </span>
                  </div>
                  <div className="mt-1">
                    <Rate
                      className="text-[13px] text-red-500 font-bold bg-white rounded-lg mr-2"
                      disabled
                      allowHalf
                      defaultValue={imageData.data.rate}
                    />
                    <span className="text-gray-600 font-extralight">
                      {imageData.data.rate} (puan)
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <div className="mt-3 text-xs font-light">{moment(imageData.data.created).format("DD.MM.yyyy")} tarihinde yorum yapıldı.</div>
                <div className="pt-4 space-x-2">
                  {imageData.data.commentType.split(",,").map((x, i) => (
                    <span className="rounded-lg border p-1" key={i}>
                      {x}
                    </span>
                  ))}
                </div>

                <div className="pt-5 text-[15px]">
                  {imageData.data.comment} 
                </div>
              </div>
              <div className="flex items-center justify-start space-x-2 mt-2">
                <button className="border flex items-center space-x-1 py-1 px-2 rounded-lg text-xs hover:text-red-500 hover:border-red-500">
                  <AiOutlineLike className="text-base" />
                  <span>Beğen</span>
                </button>
                {/* <button className="border flex items-center space-x-1 py-1 px-2 rounded-lg text-xs hover:text-red-500 hover:border-red-500">
                  <AiOutlineComment className="text-base" />
                  <span>Yorum Yap</span>
                </button> */}
              </div>
            </div>
          )}
        </div>

        <button
          onClick={() =>
            setModal({ visible: false, data: null, currentIndex: 0 })
          }
          className="absolute right-0 top-0 p-3 hover:text-red-500"
        >
          <BsXCircle size={24} />
        </button>
      </div>
    </div>
  );
};

export default ImageWithCommentModal;
