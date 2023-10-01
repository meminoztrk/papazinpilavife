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

const SearchModal = ({ closeModal }) => {
  const links = [
    "https://s3-media0.fl.yelpcdn.com/bphoto/jMQZojTqKvu3zw7Ap2E_Kg/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/EYJoczvLzSXTWap54cTfPQ/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/jMQZojTqKvu3zw7Ap2E_Kg/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
    "https://s3-media0.fl.yelpcdn.com/bphoto/G4YvUfd8JvseK1mNTtXXEA/o.jpg",
  ];

  useEffect(async () => {
    let existLast = false;
    let c = 0;
    let index = 0;
    const div = document.getElementById("myDiv");
    const rect = div.getBoundingClientRect();
    const elements = document.querySelector(".slider");
    const activity = document.querySelector(".activity");
    const prevButton = document.querySelector(".prev");
    const nextButton = document.querySelector(".next");
    const nextImage = document.querySelector(".nextImage");
    const prevImage = document.querySelector(".prevImage");
    const image = document.querySelector(".currentImage"); // seçili resim
    image.src = links[index];
    elements.children[0].firstChild.style.border = "2px solid #B52100";

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
      } else {
      }
    };

    prevButton.addEventListener("click", prevArrow);
    nextButton.addEventListener("click", nextArrow);

    prevImage.addEventListener("click", prevImageHandle);
    nextImage.addEventListener("click", nextImageHandle);

    async function handleResize() {
      activity.style.pointerEvents = "none";
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
        <div className="group w-2/3 flex justify-center relative h-auto bg-black rounded-l-lg text-white">
          <div className="flex justify-center">
            <img
              className="object-contain w-full h-full currentImage"
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

          {/* <div className="">
            <div className="prev absolute rounded-full hover:bg-gray-700 left-1 hover:cursor-pointer top-[calc(50%-30px)] p-1">
              <BsArrowLeftShort size={35} />
            </div>
            <div className="next absolute rounded-full hover:bg-gray-700 right-1 hover:cursor-pointer top-[calc(50%-30px)] p-1">
              <BsArrowRightShort size={35} />
            </div>
          </div> */}

          {/* <div className="hidden group-hover:flex absolute bottom-2 justify-center items-center space-x-4 p-2 test"> */}
          <div className="flex items-center absolute bottom-0 left-0 right-0 justify-start bg-black activity select-none">
            <div className="prev bottom-0 rounded-full hover:bg-gray-700 left-1 hover:cursor-pointer p-1 select-none">
              <BsArrowLeftShort size={35} />
            </div>
            <div
              className="slider-wrapper w-full flex items-center bg-black py-2 select-none"
              id="myDiv"
              data-items={links.length}
            >
              <div className="slider select-none">
                {links.map((link, index) => (
                  <div
                    key={index}
                    className="hover:cursor-pointer item select-none"
                  >
                    <img
                      key={index}
                      data-id={index}
                      className="w-10 h-10 object-cover rounded select-none"
                      src={link}
                      alt={link}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="next rounded-full hover:bg-gray-700 bottom-0 right-1 hover:cursor-pointer p-1 select-none">
              <BsArrowRightShort size={35} />
            </div>
            {/* <div className="slider-wrapper" data-items="2">
              <div className="slider">
                <div className="item bg-yellow-500">Item 1</div>
                <div className="item bg-yellow-500">Item 2</div>
                <div className="item bg-yellow-500">Item 3</div>
                <div className="item bg-yellow-500">Item 4</div>
                <div className="item bg-yellow-500">Item 5</div>
                <div className="item bg-yellow-500">Item 6</div>
              </div>
              <button className="prev" type="button">
                &larr;
              </button>
              <button className="next" type="button">
                &rarr;
              </button>
            </div> */}
          </div>
        </div>

        <div className="w-1/3 h-auto rounded-r-lg">
          <div className="p-4">
            <div className="flex gap-x-3">
              <img
                className="w-16 h-16 rounded-lg"
                src="https://media-cdn.tripadvisor.com/media/photo-s/24/e8/fe/a3/oztat-kebap.jpg"
              />
              <div className="flex-col flex">
                <span className="text-blue-500">Yahyabey Kebap Pide</span>
                <span className="text-xs flex items-center">
                  <BsGeoAltFill className="text-gray-500 mr-1" /> Alanya,
                  Türkiye
                </span>
                <span className="text-xs pt-2 text-gray-400">
                  22.08.2023 tarihinde yorum yapıldı.
                </span>
              </div>
            </div>
            <div className="pt-2">
              <Rate
                className="text-[15px] text-red-500 font-bold"
                disabled
                defaultValue={4}
              />
            </div>
            <div className="pt-1">
              Ailece tatil için gittiğimiz alanyada bazı restorant ta yemek
              yedik turizm bölgesi olduğu için bildiğiniz gibi insanların önüne
              yemekleri koyduklarında hersey bitiyor bir arkadaşın tavsiyesi
              üzerine öz tat restorant ta gittik hem yemekleri hemde çalışanları
              o kadar samimi sanki kendi evinizdeymis gibi his ediyorsunuz hele
              bir tepsi kebabı yedik hayatımda yediğim en güzel tepsi kebabiydi
              sizde ailenizle birlikte güzel bir tatil geçirmek için mutlaka öz
              tat restorantti görmenizi öneririm
            </div>
          </div>
        </div>

        <button className="absolute right-0 top-0 p-3 hover:text-red-500">
          <BsXCircle size={24} />
        </button>
      </div>
    </div>
  );
};

export default SearchModal;
