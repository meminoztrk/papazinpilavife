import React, { useState, useEffect, useRef } from "react";

const index = () => {
  const [text, setText] = useState("");
  const textref = useRef();

  const area =
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptas, reiciendis natus dolores officia itaque soluta sunt nesciunt minus cum";
  useEffect(() => {
    setText(area);
  }, []);

  const handleMouseUp = () => {
    var sel = window.getSelection();
    var range = sel.getRangeAt(0);
    var newNode = document.createElement("span");
    newNode.setAttribute("class", "text-red-500");

    console.log(range.startContainer.parentElement.className == "text-red-500");
    console.log(range.endContainer.parentElement.className == "text-red-500");
    console.log(range.startContainer.parentElement);

    try {
      range.surroundContents(newNode);
    } catch (e) {
      if (range.startContainer.parentElement.className == "text-red-500") {
        var exist = range.startContainer.parentElement;
        exist.replaceWith(exist.innerText);
        sel.removeAllRanges();
        range.surroundContents(newNode);
      } else {
        var exist = range.endContainer.parentElement;
        exist.replaceWith(exist.innerText);
        sel.removeAllRanges();
        range.surroundContents(newNode);
      }
    }
  };
  return (
    <div className="flex flex-col">
      <button
        onClick={() => handleMouseUp("text-red-500")}
        className="italic p-1 border mx-2"
      >
        RENKLİ YAP
      </button>
      <button
        onClick={() => handleMouseUp("italic")}
        className="italic p-1 border mx-2"
      >
        ITALIC YAP
      </button>
      <span
        className="m-10"
        ref={textref}
        dangerouslySetInnerHTML={{ __html: text }}
      >
        {/* {text} */}
        {/* <div>
        <h1 className="text-lg font-semibold">Özet</h1>
      </div> */}
      </span>
    </div>
  );
};

export default index;
