import {
  Breadcrumb,
  Rate,
  Select,
  Input,
  Progress,
  Form,
  Modal,
  Spin,
  Upload,
  Pagination,
  notification,
} from "antd";
import { LoadingOutlined, PlusOutlined } from "@ant-design/icons";
import {
  AiOutlineAlert,
  AiOutlineBug,
  AiOutlineBell,
  AiOutlineStar,
  AiOutlineShareAlt,
  AiOutlineHeart,
  AiOutlineDelete,
  AiOutlineSearch,
  AiOutlineLike,
  AiOutlineComment,
} from "react-icons/ai";
import { BsPinMap, BsTelephone, BsLink, BsThreeDots } from "react-icons/bs";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";
import Comment from "~/components/Comment";
import LoginModal from "~/components/LoginModal";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
  useOutletContext,
} from "@remix-run/react";
import SwiperMenu from "~/components/SwiperMenu";
import { redirect } from "@remix-run/node";
import { useEffect, useState } from "react";
import moment from "moment";
import { useModalForm } from "sunflower-antd";
import { post, put } from "axios";
import ImageWithCommentModal from "~/components/ImageWithCommentModal";
const { Search } = Input;
const { TextArea } = Input;
const { Option } = Select;

export const loader = async ({ request, params }) => {
  // const param = new URL(request.url).searchParams.get("name").split("-").pop();
  const param = params.name.split("-").pop();
  isNaN(parseInt(param)) && redirect("404");
  const req = await fetch(
    process.env.REACT_APP_API +
      `/Business/GetBusinessesWithCommentById?id=${param}`,
    {
      method: "GET",
      headers: {
        ApiKey: process.env.REACT_APP_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  const data = await req.json();
  data.API = process.env.REACT_APP_API;
  data.API_KEY = process.env.REACT_APP_API_KEY;
  data.IMAGES = process.env.REACT_APP_IMAGES;

  return data.data ? data : redirect("/404");
};

const Business = () => {
  const [existUser, handleChange] = useOutletContext();
  const { data, API, API_KEY, IMAGES } = useLoaderData();
  const location = useLocation();
  const [validIframe, setValidIframe] = useState(false);
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const [openModal, setOpenModal] = useState({
    visible: false,
    data: null,
    currentIndex: 0,
  });
  const [okButton, setOkButton] = useState(false);
  const [loginModal, setLoginModal] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [images, setImages] = useState([]);
  const [comments, setComments] = useState([]);
  const [allSelected, setAllSelected] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [paginationLoading, setPaginationLoading] = useState(false);
  const [searching, setSearching] = useState("");
  const [formPagination, setFormPagination] = useState({
    order: false,
    type: "",
    rate: 0,
    page: 1,
    search: "",
    currentPage: 1,
  });

  const postComment = async (comment) => {
    console.log(comment);
    const formData = new FormData();
    for (var key in comment) {
      formData.append(key, comment[key] == null ? "" : comment[key]);
    }
    images[0] &&
      images.forEach((item) => {
        formData.append("uploadedImages", item);
      });

    await post(API + "/Business/AddComment", formData, {
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
    })
      .then((resp) => {
        openCommentNotification(true);
        close();
      })
      .catch(function (error) {
        openCommentNotification(false);
      });
  };

  const getPaginationComment = async (ent) => {
    await fetch(
      API +
        `/Business/GetCommentWithPagination?id=${data.id}&page=${
          ent.currentPage
        }&take=${15}&isAsc=${ent.order}&commentType=${ent.type}&rate=${
          ent.rate
        }&search=${ent.search}`,
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
        setComments(data.data);
        setPaginationLoading(false);
      });
  };

  useEffect(() => {
    setPaginationLoading(true);
    console.log("geldi mi");
    const timer = setTimeout(
      async () => await getPaginationComment(formPagination),
      500
    );
    return () => clearTimeout(timer);
  }, [formPagination, location]);

  useEffect(() => {
    console.log(data);
    console.log("yenilendi");
    isIframeValidHTML(data.mapIframe);
  }, []);

  useEffect(() => {
    openModal.visible
      ? (document.body.style.overflow = "hidden")
      : (document.body.style.overflow = "unset");
  }, [openModal]);

  //#region Functions

  const joinItem = (text) => {
    return text != null ? text.join(",,") : null;
  };

  const splitItem = (text) => {
    return text != null ? text.split(",,") : null;
  };

  const isOpen = (rangeString) => {
    var range = rangeString.split(" - ");
    var openTime = range[0].split(":").join("");
    var closeTime = range[1].split(":").join("");
    var nowTime = moment().format("HH:mm").split(":").join("");
    var result = false;
    result =
      parseInt(openTime) < parseInt(nowTime) &&
      parseInt(closeTime) > parseInt(nowTime) &&
      true;
    return result;
  };

  const renderNowDate = () => {
    switch (moment().day()) {
      case 1:
        return (
          <p>
            <span
              className={`${
                isOpen(data.mo) ? "text-green-500" : "text-red-500"
              }  font-light`}
            >
              {isOpen(data.mo) ? "Şuanda açık" : "Kapalı"}
            </span>{" "}
            - {isOpen(data.mo) && data.mo} (Bugün)
          </p>
        );
        break;
      case 2:
        return (
          <p>
            <span
              className={`${
                isOpen(data.tu) ? "text-green-500" : "text-red-500"
              }  font-light`}
            >
              {isOpen(data.tu) ? "Şuanda açık" : "Kapalı"}
            </span>{" "}
            - {isOpen(data.tu) && data.tu} (Bugün)
          </p>
        );
        break;
      case 3:
        return (
          <p>
            <span
              className={`${
                isOpen(data.we) ? "text-green-500" : "text-red-500"
              }  font-light`}
            >
              {isOpen(data.we) ? "Şuanda açık" : "Kapalı"}
            </span>{" "}
            - {isOpen(data.we) && data.we} (Bugün)
          </p>
        );
        break;
      case 4:
        return (
          <p>
            <span
              className={`${
                isOpen(data.th) ? "text-green-500" : "text-red-500"
              }  font-light`}
            >
              {isOpen(data.th) ? "Şuanda açık" : "Kapalı"}
            </span>{" "}
            - {isOpen(data.th) && data.th} (Bugün)
          </p>
        );
        break;
      case 5:
        return (
          <p>
            <span
              className={`${
                isOpen(data.fr) ? "text-green-500" : "text-red-500"
              }  font-light`}
            >
              {isOpen(data.fr) ? "Şuanda açık" : "Kapalı"}
            </span>{" "}
            - {isOpen(data.fr) && data.fr} (Bugün)
          </p>
        );
        break;
      case 6:
        return (
          <p>
            <span
              className={`${
                isOpen(data.sa) ? "text-green-500" : "text-red-500"
              }  font-light`}
            >
              {isOpen(data.sa) ? "Şuanda açık" : "Kapalı"}
            </span>{" "}
            - {isOpen(data.sa) && data.sa} (Bugün)
          </p>
        );
        break;
      case 0:
        return (
          <p>
            <span
              className={`${
                isOpen(data.su) ? "text-green-500" : "text-red-500"
              }  font-light`}
            >
              {isOpen(data.su) ? "Şuanda açık" : "Kapalı"}
            </span>{" "}
            - {isOpen(data.su) && data.su} (Bugün)
          </p>
        );
    }
  };

  function isIframeValidHTML(html) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, "text/xml");
    if (
      !html.startsWith("<iframe") ||
      !html.endsWith("</iframe>") ||
      doc.documentElement.querySelector("parsererror")
    ) {
      setValidIframe(false);
    } else {
      setValidIframe(true);
    }
  }

  const openCommentNotification = (isOk) => {
    isOk
      ? notification.open({
          message: (
            <span className="flex items-center space-x-2">
              <AiOutlineBell className=" text-green-500 text-lg" size={24} />
              <span>Yorumunuz İletildi</span>
            </span>
          ),
          description:
            "Görüşlerinizi bizimle paylaştığınız için teşekkür ederiz.",
        })
      : notification.open({
          message: (
            <span className="flex items-center space-x-2">
              <AiOutlineBug className=" text-red-500 text-lg" size={24} />
              <span>Yorumunuz iletilemedi.</span>
            </span>
          ),
          description: "Yorumunuz iletilirken bir hata oluştu.",
        });
  };

  const handleLoginModal = (state) => {
    setLoginModal(state);
  };

  //#endregion

  //#region Image Business

  async function fetchUrlToImage(imageList, path) {
    const symbols = [];
    console.log("filelist", imageList);
    for await (let file of imageList) {
      if (file.status === "done") {
        const response = await fetch(
          API + `/Business/GetImage?path=${path}&name=${file.name}`,
          {
            headers: {
              ApiKey: API_KEY,
              "Content-Type": "application/json",
            },
          }
        );
        const blob = await response.blob();
        const filel = new File([blob], file.name, { type: blob.type });
        symbols.push(filel);
      } else {
        symbols.push(file.originFileObj);
      }
    }
    console.log("resimler", symbols);
    return symbols;
  }

  useEffect(() => {
    fetchUrlToImage(fileList, "business").then((files) => setImages(files));
  }, [fileList]);

  const handleCancel = () => setPreviewVisible(false);

  const getBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = () => resolve(reader.result);

      reader.onerror = (error) => reject(error);
    });

  const handleImagePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(
      file.name || file.url.substring(file.url.lastIndexOf("/") + 1)
    );
  };

  const handleImageChange = ({ fileList: newFileList }) =>
    setFileList(newFileList);
  const uploadButton = (
    <div>
      <PlusOutlined />
      <div
        style={{
          marginTop: 8,
        }}
      >
        Upload
      </div>
    </div>
  );
  //#endregion

  const handleSelectChange = (value) => {
    if (value.includes("") && !allSelected) {
      setAllSelected(!allSelected);
      form.setFieldsValue({
        commentTypes: [
          "Kalite",
          "Fiyat",
          "Lezzet",
          "Konum",
          "Hizmet",
          "Servis",
          "Atmosfer",
        ],
      });
    } else if (value.includes("") && allSelected && value.length > 0) {
      setAllSelected(!allSelected);
      form.setFieldsValue({
        commentTypes: [],
      });
    } else {
      value.length == 0 && setAllSelected(false);
      value.length == 7 && setAllSelected(true);
      form.setFieldsValue({
        commentTypes: value,
      });
    }
  };

  const { modalProps, formProps, show, close, formLoading } = useModalForm({
    defaultVisible: false,
    autoSubmitClose: true,
    autoResetForm: true,
    async submit({ rate, comment, commentTypes }) {
      console.log("ok");
      await new Promise((r) => setTimeout(r, 500));
      const commentData = {
        guidId: existUser.userId,
        businessId: data.id,
        rate,
        comment,
        commentType: joinItem(commentTypes),
      };
      await postComment(commentData);
      return "ok";
    },
    form,
  });

  return (
    <div className="font-inter mt-32">
      <div className="text-xs">
        <Breadcrumb style={{ fontSize: "12px" }}>
          <Breadcrumb.Item href="">Anasayfa</Breadcrumb.Item>
          <Breadcrumb.Item href="">{data.city}</Breadcrumb.Item>
          <Breadcrumb.Item href="">{data.district}</Breadcrumb.Item>
          <Breadcrumb.Item href="">{data.neighborhood}</Breadcrumb.Item>
          <Breadcrumb.Item>{data.businessName}</Breadcrumb.Item>
        </Breadcrumb>
      </div>
      {
        //#region Image Gallery
      }
      {data.businessImages.length > 0 ? (
        <div className="mt-2">
          <div className="flex space-x-1 w-full bg-white rounded-lg">
            {data.businessImages.length > 3 ? (
              <>
                <div
                  onClick={() =>
                    setOpenModal({
                      visible: true,
                      data: {images: data.businessImages,...data},
                      currentIndex: 0,
                    })
                  }
                  className="w-3/5 relative cursor-pointer"
                >
                  <img
                    alt="gallery"
                    className="block h-full w-full aspect-[16/9] rounded-l-lg object-cover object-center"
                    src={`${IMAGES}/business/${data.businessImages[0]}`}
                  />
                  <div className="absolute rounded-lg bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,10%,16%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                </div>

                <div className="w-1/5 flex flex-col gap-y-1">
                  <div
                    onClick={() =>
                      setOpenModal({
                        visible: true,
                        data: {images: data.businessImages,...data},
                        currentIndex: 1,
                      })
                    }
                    className="h-1/2 relative cursor-pointer"
                  >
                    <img
                      alt="gallery"
                      className="block h-full w-full object-cover object-center"
                      src={`${IMAGES}/business/${data.businessImages[1]}`}
                    />
                    <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,10%,16%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                  </div>
                  <div
                    onClick={() =>
                      setOpenModal({
                        visible: true,
                        data: {images: data.businessImages,...data},
                        currentIndex: 2,
                      })
                    }
                    className="h-1/2 relative cursor-pointer"
                  >
                    <img
                      alt="gallery"
                      className="block h-full w-full object-cover object-center"
                      src={`${IMAGES}/business/${data.businessImages[2]}`}
                    />
                    <div className="absolute bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,10%,16%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                  </div>
                </div>

                <div
                  onClick={() =>
                    setOpenModal({
                      visible: true,
                      data: {images: data.businessImages,...data},
                      currentIndex: 3,
                    })
                  }
                  className="w-1/5 flex relative cursor-pointer"
                >
                  <img
                    alt="gallery"
                    className="block h-full w-full aspect-[9/16] rounded-r-lg object-cover object-center"
                    src={`${IMAGES}/business/${data.businessImages[3]}`}
                  />
                  <div className="absolute rounded-lg bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,10%,16%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
                </div>
              </>
            ) : (
              <div
                onClick={() =>
                  setOpenModal({
                    visible: true,
                    data: {images: data.businessImages,...data},
                    currentIndex: 0,
                  })
                }
                className="w-full relative cursor-pointer bg-white rounded-lg"
              >
                <img
                  alt="gallery"
                  className="block h-full w-full aspect-[16/6] rounded-lg object-cover object-center"
                  src={`${IMAGES}/business/${data.businessImages[0]}`}
                />
                <div className="absolute rounded-lg bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,10%,16%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="mt-2">
          <div className="flex space-x-1 w-full">
            <div className="w-full relative cursor-pointer bg-white rounded-lg">
              <img
                alt="gallery"
                className="block h-full w-full aspect-[16/6] rounded-lg object-cover object-center"
                src={`${IMAGES}/business/defaultbusiness.png`}
              />
              <div className="absolute rounded-lg bottom-0 left-0 right-0 top-0 h-full w-full overflow-hidden bg-[hsla(0,10%,16%,0.2)] bg-fixed opacity-0 transition duration-300 ease-in-out hover:opacity-100"></div>
            </div>
          </div>
        </div>
      )}

      {
        //#endregion
      }
      <div className="bg-white -mt-3 rounded-b-lg py-6 px-6">
        {
          //#region Business Header
        }
        <div>
          <div>
            <div className="flex md:flex-row flex-col md:items-center pt-2">
              <h1 className="md:text-2xl text-lg font-extrabold md:pr-4">
                {data.businessName}
              </h1>
              <Rate
                className="text-[13px] text-red-500 font-bold bg-white py-1 px-2 rounded-lg mr-2"
                disabled
                allowHalf
                defaultValue={data.rate}
              />
              <span className="text-gray-600 font-extralight">
                {data.rate} ({data.commentCount} inceleme)
              </span>
              <div className="ml-auto flex items-center space-x-3">
                {/* {!data.userId && ( */}
                <div className="rounded-lg cursor-pointer pb-1 hover:text-red-500">
                  <AiOutlineAlert className="text-[25px]" />
                </div>
                {/* // )} */}
                <div className="rounded-lg cursor-pointer py-1 hover:text-red-500">
                  <BsThreeDots className="text-[25px]" />
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <p className="pt-1 px-1 text-gray-600 font-extralight">
                {data.minHeader}
              </p>
              {renderNowDate()}
            </div>
            <span className="px-1 text-gray-600 font-extralight">
              {data.neighborhood}, {data.district}, {data.city}
            </span>
          </div>
          <div className="pt-4 flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => {
                  if (existUser && !existUser.isBusiness) {
                    show();
                    form.resetFields();
                    setAllSelected(false);
                    setOkButton(false);
                  } else if (existUser && existUser.isBusiness) {
                    notification.open({
                      message: (
                        <span className="flex items-center space-x-2">
                          <AiOutlineBell
                            className=" text-red-500 text-lg"
                            size={24}
                          />
                          <span>Uyarı</span>
                        </span>
                      ),
                      description:
                        "İşletme hesapları yorum yapamaz, sadece kendi işletmelerinin yorumlarına cevap verebilir.",
                    });
                  } else {
                    setLoginModal(true);
                  }
                }}
                className=" text-white bg-red-500 hover:bg-red-700 mr-3 pl-2 pr-3 py-1 rounded-lg flex items-center gap-x-1 text-base"
              >
                <AiOutlineStar className="text-[20px]" />{" "}
                <span className="text-[13px]">Yorum Yap</span>
              </button>
              <LoginModal
                loginModal={loginModal}
                handleLoginModal={handleLoginModal}
              />
              <Modal
                {...modalProps}
                maskClosable={false}
                forceRender
                transitionName=""
                footer=""
                getContainer={false}
                okButtonProps={{ disabled: okButton }}
                title={
                  <div className="relative">
                    <div className="px-6 py-1 before:w-[4px] before:h-full before:bg-red-700 before:block before:rounded-lg before:absolute before:top-0 before:left-0 before:content-['']">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold text-xl block">
                          Görüşlerinizi bildirin
                        </span>
                      </div>
                    </div>
                  </div>
                }
                centered
              >
                <Spin
                  spinning={formLoading}
                  indicator={<LoadingOutlined spin />}
                >
                  <Form
                    {...formProps}
                    // initialValues={{

                    // }}
                    autoComplete="off"
                  >
                    <h1 className="text-xl font-semibold mb-8">
                      {data.businessName}
                    </h1>
                    <Upload
                      name="upload"
                      beforeUpload={() => false}
                      onPreview={handleImagePreview}
                      onChange={handleImageChange}
                      fileList={fileList}
                      accept="image/png, image/jpeg"
                      listType="picture-card"
                    >
                      {fileList.length > 3 ? null : uploadButton}
                    </Upload>

                    <div className="flex items-center space-x-3">
                      <Form.Item
                        name="rate"
                        rules={[
                          {
                            required: true,
                            message: "Lütfen puanlama girin!",
                          },
                        ]}
                      >
                        <Rate className="text-[32px] text-red-500 font-bold bg-white rounded-lg" />
                      </Form.Item>
                      <span className="pb-4 font-light">(Puanınızı seçin)</span>
                    </div>

                    <Form.Item className="mb-0">
                      <Form.Item
                        name="commentTypes"
                        rules={[
                          {
                            required: true,
                            message: "Lütfen yorum başlıklarını seçin!",
                          },
                        ]}
                      >
                        <Select
                          mode="multiple"
                          onChange={(e) => handleSelectChange(e)}
                          getPopupContainer={(trigger) => trigger.parentNode}
                          className="shadow text-gray-700 leading-tight"
                          placeholder="Yorum başlıklarını seçin"
                        >
                          <Option value="">
                            {allSelected ? "Tümünü Sil" : "Tümünü Seç"}
                          </Option>
                          <Option value="Kalite">Kalite</Option>
                          <Option value="Fiyat">Fiyat</Option>
                          <Option value="Lezzet">Lezzet</Option>
                          <Option value="Konum">Konum</Option>
                          <Option value="Hizmet">Hizmet</Option>
                          <Option value="Servis">Servis</Option>
                          <Option value="Atmosfer">Atmosfer</Option>
                        </Select>
                      </Form.Item>
                    </Form.Item>

                    <Form.Item
                      name="comment"
                      rules={[
                        {
                          required: true,
                          message: "Lütfen görüşlerinizi bildirin!",
                        },
                        {
                          min: 15,
                          message: "Minimum 15 karakter olmalı!",
                        },
                      ]}
                    >
                      <TextArea
                        rows={10}
                        placeholder="İşletmeyle ilgili yaşadığınız deneyimlerden bahsedin."
                        maxLength={500}
                        className="relative shadow z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </Form.Item>
                    <Form.Item>
                      <div className="flex items-center justify-start w-full">
                        <button
                          {...(formLoading && { disabled: true })}
                          className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-900 text-white font-semibold"
                          type="sumbit"
                        >
                          <div className="flex items-center justify-center">
                            <svg
                              className={
                                formLoading
                                  ? "inline mr-2 w-4 h-4 text-red-200 animate-spin  fill-white"
                                  : "hidden"
                              }
                              viewBox="0 0 100 101"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                fill="currentColor"
                              />
                              <path
                                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                fill="currentFill"
                              />
                            </svg>
                            <span>GÖNDER</span>
                          </div>
                        </button>
                      </div>
                    </Form.Item>
                  </Form>
                </Spin>
              </Modal>
              <button className=" text-white bg-red-500 hover:bg-red-700 mr-3 pl-2 pr-3 py-1 rounded-lg flex items-center gap-x-1 text-base">
                <AiOutlineHeart className="text-[20px]" />{" "}
                <span className="text-[13px]">Kaydet</span>
              </button>
              <button className=" text-white bg-red-500 hover:bg-red-700 mr-3 pl-2 pr-3 py-1 rounded-lg flex items-center gap-x-1 text-base">
                <AiOutlineShareAlt className="text-[20px]" />{" "}
                <span className="text-[13px]">Paylaş</span>
              </button>
            </div>
            <div>
              <ul className="flex items-center text-[18px] text-red-500">
                {data.facebook && (
                  <a
                    Link={data.instagram}
                    target="_blank"
                    className="cursor-pointer hover:text-gray-500 p-1 rounded-full"
                  >
                    <FaInstagram />
                  </a>
                )}

                {data.facebook && (
                  <a
                    href={data.facebook}
                    target="_blank"
                    className="cursor-pointer hover:text-gray-500 p-1 rounded-full"
                  >
                    <FaFacebookF />
                  </a>
                )}

                {data.twitter && (
                  <a
                    href={data.twitter}
                    target="_blank"
                    className="cursor-pointer hover:text-gray-500 p-1 rounded-full"
                  >
                    <FaTwitter />
                  </a>
                )}
              </ul>
            </div>
          </div>
        </div>
        {
          //#endregion
        }
        <hr className="mt-10" />
        <div className="grid grid-cols-6">
          {
            //#region Business Body
          }
          <div className="md:col-span-4 col-span-6 pr-5 divide-y">
            {data.menu && (
              <div className="py-10">
                <h1 className="text-xl font-bold pb-4">Menü</h1>
                <h2 className="-mb-4">En Çok Tercih Edilenler</h2>
                <div className={"pt-4 flex items-center container"}>
                  <SwiperMenu />
                </div>
              </div>
            )}

            <div className="py-10">
              <h1 className="text-xl font-bold">İşletme Hakkında</h1>
              <div className="flex md:flex-row flex-col pt-2 md:space-x-6">
                <div className="flex md:w-2/3 w-full flex-col flex-wrap divide-y">
                  {data.foodTypes != null && (
                    <div className="py-4">
                      <h2 className="text-base py-2 font-semibold">
                        Yemek Çeşitleri
                      </h2>
                      <div className="flex flex-wrap">
                        {splitItem(data.foodTypes).map((item, index) => (
                          <span
                            key={index}
                            className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.businessProps != null && (
                    <div className="py-4">
                      <h2 className="text-base py-2 font-semibold">
                        İşletme Özellikleri
                      </h2>
                      <div className="flex flex-wrap">
                        {splitItem(data.businessProps).map((item, index) => (
                          <span
                            key={index}
                            className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.businessServices != null && (
                    <div className="py-4">
                      <h2 className="text-base py-2 font-semibold">
                        İşletme Hizmetleri
                      </h2>
                      <div className="flex flex-wrap">
                        {splitItem(data.businessServices).map((item, index) => (
                          <span
                            key={index}
                            className="p-2 mr-2 my-1 border rounded-xl border-gray-400 text-red-400"
                          >
                            {item}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {data.about != null && (
                    <div className="py-4">
                      <h2 className="text-base py-2 font-semibold">Hakkında</h2>
                      <div className="flex flex-wrap">
                        <span>{data.about}</span>
                      </div>
                    </div>
                  )}
                </div>
                <div className="md:w-1/3 w-full justify-center">
                  <div className="flex flex-wrap flex-col text-center rounded-2xl">
                    <p className="p-1 font-semibold bg-red-500 text-white rounded-t-2xl">
                      ÇALIŞMA SAATLERİ
                    </p>
                    <div
                      className={`flex items-center justify-between px-4 p-1 font-extralight ${
                        moment().day() === 1 && "text-red-500"
                      }`}
                    >
                      <span>PAZARTESİ</span>
                      <span>
                        {data.mo == "00:00 - 00:00" ? "Kapalı" : data.mo}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between px-4 p-1 font-extralight ${
                        moment().day() === 2 && "text-red-500"
                      }`}
                    >
                      <span>SALI</span>
                      <span>
                        {data.tu == "00:00 - 00:00" ? "Kapalı" : data.tu}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between px-4 p-1 font-extralight ${
                        moment().day() === 3 && "text-red-500"
                      }`}
                    >
                      <span>ÇARŞAMBA</span>
                      <span>
                        {data.we == "00:00 - 00:00" ? "Kapalı" : data.we}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between px-4 p-1 font-extralight ${
                        moment().day() === 4 && "text-red-500"
                      }`}
                    >
                      <span>PERŞEMBE</span>
                      <span>
                        {data.th == "00:00 - 00:00" ? "Kapalı" : data.th}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between px-4 p-1 font-extralight ${
                        moment().day() === 5 && "text-red-500"
                      }`}
                    >
                      <span>CUMA</span>
                      <span>
                        {data.fr == "00:00 - 00:00" ? "Kapalı" : data.fr}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between px-4 p-1 font-extralight ${
                        moment().day() === 0 && "text-red-500"
                      }`}
                    >
                      <span>CUMARTESİ</span>
                      <span>
                        {data.sa == "00:00 - 00:00" ? "Kapalı" : data.sa}
                      </span>
                    </div>
                    <div
                      className={`flex items-center justify-between px-4 p-1 font-extralight ${
                        moment().day() === "Sunday" && "text-red-500"
                      }`}
                    >
                      <span>PAZAR</span>
                      {data.su == "00:00 - 00:00" ? "Kapalı" : data.su}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {data.courier && (
              <div className="py-10">
                <h1 className="text-xl font-bold">Kuryeler</h1>
                <div className="flex flex-wrap justify-start text-center pt-4">
                  <div className="w-1/4 pt-4">
                    <img
                      className="w-32 h-32 mx-auto"
                      src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                    />
                    <div className="flex flex-col text-center mt-2">
                      <p>Ahmet B.</p>
                    </div>
                  </div>

                  <div className="w-1/4 pt-4">
                    <img
                      className="w-32 h-32 mx-auto"
                      src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                    />
                    <div className="flex flex-col text-center mt-2">
                      <p>Ahmet B.</p>
                    </div>
                  </div>

                  <div className="w-1/4 pt-4">
                    <img
                      className="w-32 h-32 mx-auto"
                      src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                    />
                    <div className="flex flex-col text-center mt-2">
                      <p>Ahmet B.</p>
                    </div>
                  </div>

                  <div className="w-1/4 pt-4">
                    <img
                      className="w-32 h-32 mx-auto"
                      src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                    />
                    <div className="flex flex-col text-center mt-2">
                      <p>Ahmet B.</p>
                    </div>
                  </div>

                  <div className="w-1/4 pt-4">
                    <img
                      className="w-32 h-32 mx-auto"
                      src="https://img.freepik.com/free-icon/user_318-563642.jpg"
                    />
                    <div className="flex flex-col text-center mt-2">
                      <p>Ahmet B.</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="py-10">
              <div>
                <h1 className="text-xl font-bold">Yorumlar</h1>
                <div className="grid grid-cols-3 py-4">
                  <div className="col-span-1 flex items-center justify-center">
                    <div className="flex flex-col flex-wrap">
                      <span className="text-left font-semibold">
                        Tüm Yorumlar
                      </span>
                      <Rate
                        className="text-[32px] text-red-500 font-bold bg-white rounded-lg"
                        disabled
                        defaultValue={data.rate}
                        allowHalf
                      />
                      <span className="text-left font-light">
                        {data.commentCount} İnceleme
                      </span>
                    </div>
                  </div>
                  <div className="col-span-2 px-4 space-y-2">
                    <div className="flex items-center gap-x-1">
                      <span className="w-20">5 Yıldız</span>
                      <Progress
                        percent={data.fivePercent}
                        strokeColor={"#FB503C"}
                        showInfo={false}
                      />
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="w-20">4 Yıldız</span>
                      <Progress
                        percent={data.fourPercent}
                        strokeColor={"#FF643D"}
                        showInfo={false}
                      />
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="w-20">3 Yıldız</span>
                      <Progress
                        percent={data.threePercent}
                        strokeColor={"#FF8742"}
                        showInfo={false}
                      />
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="w-20">2 Yıldız</span>
                      <Progress
                        percent={data.twoPercent}
                        strokeColor={"#FFAD48"}
                        showInfo={false}
                      />
                    </div>
                    <div className="flex items-center gap-x-1">
                      <span className="w-20">1 Yıldız</span>
                      <Progress
                        percent={data.onePercent}
                        strokeColor={"#FFCC4B"}
                        showInfo={false}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <Spin
                spinning={paginationLoading}
                indicator={<LoadingOutlined spin />}
              >
                <div>
                  <div className="flex items-center justify-between pt-6">
                    <div className="space-x-4">
                      <Select
                        className="w-28"
                        onChange={(e) => {
                          setFormPagination({
                            ...formPagination,
                            order: e,
                            currentPage: 1,
                          });
                        }}
                        defaultValue={false}
                        options={[
                          {
                            value: false,
                            label: "En Yeni",
                          },
                          {
                            value: true,
                            label: "En Eski",
                          },
                        ]}
                      />

                      <Select
                        className="w-28"
                        onChange={(e) => {
                          setFormPagination({
                            ...formPagination,
                            type: e,
                            currentPage: 1,
                          });
                        }}
                        defaultValue=""
                        options={[
                          {
                            value: "",
                            label: "Tümü",
                          },
                          {
                            value: "Kalite",
                            label: "Kalite",
                          },
                          {
                            value: "Fiyat",
                            label: "Fiyat",
                          },
                          {
                            value: "Konum",
                            label: "Konum",
                          },
                          {
                            value: "Hizmet",
                            label: "Hizmet",
                          },
                          {
                            value: "Servis",
                            label: "Servis",
                          },
                          {
                            value: "Atmosfer",
                            label: "Atmosfer",
                          },
                        ]}
                      />

                      <Select
                        className="w-28"
                        onChange={(e) => {
                          setFormPagination({
                            ...formPagination,
                            rate: e,
                            currentPage: 1,
                          });
                        }}
                        defaultValue={0}
                        options={[
                          {
                            value: 0,
                            label: "Tümü",
                          },
                          {
                            value: 5,
                            label: "5 Yıldız",
                          },
                          {
                            value: 4,
                            label: "4 Yıldız",
                          },
                          {
                            value: 3,
                            label: "3 Yıldız",
                          },
                          {
                            value: 2,
                            label: "2 Yıldız",
                          },
                          {
                            value: 1,
                            label: "1 Yıldız",
                          },
                        ]}
                      />
                    </div>
                    <div className="flex items-center">
                      <Search
                        onSearch={(e) => {
                          setFormPagination({
                            ...formPagination,
                            search: e.trim(),
                            currentPage: 1,
                          });
                          setSearching(e.trim());
                        }}
                        onChange={(e) => setSearching(e.target.value)}
                        value={searching}
                        placeholder="Yorumlarda ara..."
                        className="w-60"
                      />
                    </div>
                  </div>
                  {formPagination.search !== "" && (
                    <div className="flex items-center mt-4 ">
                      <span className="text-gray-400 font-light mr-2">
                        aranan:
                      </span>
                      <div className="flex items-center px-2 py-1 space-x-2 border rounded-lg">
                        <span className="">{formPagination.search}</span>
                        <button
                          onClick={(e) => {
                            setFormPagination({
                              ...formPagination,
                              search: "",
                              currentPage: 1,
                            });
                            setSearching("");
                          }}
                          className="hover:text-red-500 mt-[2px]"
                        >
                          <AiOutlineDelete />{" "}
                        </button>
                      </div>
                    </div>
                  )}

                  {comments.businessComments &&
                  comments.businessComments.length > 0 ? (
                    <div className="col-span-1 grid grid-cols-1 justify-center content-center bg-white pt-8 pb-32">
                      {comments.businessComments.map((x, i) => (
                        <Comment
                          key={i}
                          data={x}
                          busName={data.businessName}
                          imageModal={setOpenModal}
                          imagePath={IMAGES}
                          cAvaible={true}
                          border={false}
                          content="Ailece tatil için gittiğimiz alanyada bazı restorant ta yemek yedik turizm bölgesi olduğu için bildiğiniz gibi insanların önüne yemekleri koyduklarında hersey bitiyor bir arkadaşın tavsiyesi üzerine öz tat restorant ta gittik hem yemekleri hemde çalışanları o kadar samimi sanki kendi evinizdeymis gibi his ediyorsunuz hele bir tepsi kebabı yedik hayatımda yediğim en güzel tepsi kebabiydi sizde ailenizle birlikte güzel bir tatil geçirmek için mutlaka öz tat restorantti görmenizi öneririm."
                        />
                      ))}
                      {data.commentCount && (
                        <div className="flex justify-center py-10">
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
                            total={comments.commentCount}
                            showSizeChanger={false}
                            pageSize={15}
                          />
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="flex justify-center items-center text-center p-10">
                      Yorum Bulunamadı!
                    </div>
                  )}
                </div>
              </Spin>
            </div>
          </div>
          {
            //#endregion
          }
          {
            //#region Sticky Menu
          }
          <div className="md:col-span-2 col-span-6">
            <div className="sticky top-16 mt-10 rounded-lg border shadow-lg pb-10">
              {validIframe && (
                <div
                  className="flex w-full map"
                  dangerouslySetInnerHTML={{ __html: data.mapIframe }}
                ></div>
              )}

              <div className="pr-2">
                {data.adress && (
                  <div className="flex items-center text-[13.5px] pt-4 mr-1 font-light">
                    <span className="mx-4 text-lg text-blue-500">
                      <BsPinMap
                        style={{ strokeWidth: "0.5", height: "1.5rem" }}
                      />
                    </span>
                    <span>{data.adress}</span>
                  </div>
                )}

                {data.phone && (
                  <div className="flex items-center text-[13.5px] pt-2 mr-1 font-light">
                    <span className="mx-4 text-lg text-blue-500">
                      <BsTelephone
                        style={{ strokeWidth: "0.5", height: "1.5rem" }}
                      />
                    </span>
                    <span>{data.phone}</span>
                  </div>
                )}

                {data.website && (
                  <div className="flex items-center text-[13.5px] pt-2 mr-1 font-light">
                    <span className="mx-4 text-lg text-blue-500">
                      <BsLink
                        style={{ strokeWidth: "0.5", height: "1.5rem" }}
                      />
                    </span>
                    <a
                      href={data.website}
                      className="text-blue-500 hover:underline"
                      target="_blank"
                    >
                      {data.website}
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
          {
            //#endregion
          }
        </div>
      </div>
      <Modal
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        onCancel={handleCancel}
      >
        <img
          alt="example"
          style={{
            width: "100%",
          }}
          src={previewImage}
        />
      </Modal>

      {openModal.visible && (
        <ImageWithCommentModal
          setModal={setOpenModal}
          imageData={openModal}
          IMAGES={IMAGES}
        />
      )}
    </div>
  );
};

export default Business;
