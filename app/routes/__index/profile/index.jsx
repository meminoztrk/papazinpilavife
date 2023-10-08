import { useCallback, useEffect, useRef, useState } from "react";
import { useModalForm } from "sunflower-antd";
import {
  Button,
  DatePicker,
  Empty,
  Form,
  Input,
  Modal,
  Rate,
  Select,
  Skeleton,
  Spin,
  Switch,
  Upload,
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  HomeOutlined,
  PlusOutlined,
} from "@ant-design/icons";
import { useLoaderData, useNavigate, useOutletContext } from "@remix-run/react";
import { getJwt, getUser, userPrefs } from "~/hooks/cookie";
import {
  BsGeoAltFill,
  BsFillPencilFill,
  BsThreeDots,
  BsHeart,
  BsShopWindow,
  BsLayoutTextSidebarReverse,
  BsBookmark,
  BsCalendar,
  BsArrowBarRight,
  BsAspectRatio,
  BsGear,
} from "react-icons/bs";
import SwiperProfile from "~/components/SwiperProfile";
import useCommentSearch from "~/components/useCommentSearch";
import Province from "~/data/Province.json";
import { redirect } from "@remix-run/node";
const { Option } = Select;
const { TextArea } = Input;
import { put } from "axios";
import moment from "moment";
import seoHelp from "~/hooks/seoHelp";
import { Link } from "react-router-dom";

export const loader = async ({ request }) => {
  const param = new URL(request.url).searchParams.get("userid");
  const jwt = getJwt(request.headers.get("cookie"));

  const user = await getUser(
    jwt,
    process.env.REACT_APP_API,
    process.env.REACT_APP_API_KEY
  );

  const req = await fetch(
    process.env.REACT_APP_API + `/User/UserProfile?userid=${param}`,
    {
      method: "GET",
      headers: {
        ApiKey: process.env.REACT_APP_API_KEY,
        "Content-Type": "application/json",
      },
    }
  );
  const userProfile = await req.json();
  console.log("aha burda",userProfile);

  if (
    userProfile.data == null ||
    (userProfile.data.isAdmin && userProfile.data.isBusiness)
  ) {
    return redirect("/uyelik");
  }
  if (!param) {
    return redirect(`/profile?userid=${user.userId}`);
  }

  const data = {
    currentUser: user,
    userProfile: userProfile.data,
    API: process.env.REACT_APP_API,
    API_KEY: process.env.REACT_APP_API_KEY,
    API_IMAGES: process.env.REACT_APP_IMAGES,
  };
  return !userProfile.data.userId ? redirect("/uyelik") : data;
};

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

const profile = () => {
  const [existUser, handleChange] = useOutletContext();
  const [town, setTown] = useState([]);
  const [location, setLocation] = useState("");
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const { API, API_KEY, API_IMAGES, userProfile, currentUser } =
    useLoaderData();
  const [okButton, setOkButton] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [images, setImages] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");

  //buradan
  const [pageNumber, setPageNumber] = useState(1);

  const { comments, hasMore, loading, error } = useCommentSearch(
    userProfile.userId,
    pageNumber,
    API,
    API_KEY
  );

  const observer = useRef();
  const lastCommentElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber) => prevPageNumber + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  //buraya

  useEffect(() => {
    existUser &&
      existUser.provinceId &&
      (setTown(
        Province.filter(
          (x) =>
            x.ustID ===
            Province.find((y) => y.id === existUser.provinceId).ustID
        )
      ),
      setLocation(
        fupper(
          Province.find((y) => y.id === existUser.provinceId)
            .sehirIlceMahalleAdi
        ) +
          ", " +
          fupper(
            Province.find(
              (y) =>
                y.id ===
                Province.find((y) => y.id === existUser.provinceId).ustID
            ).sehirIlceMahalleAdi
          )
      ));

      console.log("profile tarafında",existUser)

    existUser && existUser.userPhoto != "defaultuser.png" &&
      setFileList([
        {
          uid: "-1",
          name: existUser.userPhoto,
          status: "done",
          url: API_IMAGES + "user/" + existUser.userPhoto,
        },
      ]);
  }, []);

  const empty = (text) => {
    return text == null ? "" : text;
  };

  useEffect(() => {
    existUser &&
      existUser.provinceId &&
      setLocation(
        fupper(
          Province.find((y) => y.id === existUser.provinceId)
            .sehirIlceMahalleAdi
        ) +
          ", " +
          fupper(
            Province.find(
              (y) =>
                y.id ===
                Province.find((y) => y.id === existUser.provinceId).ustID
            ).sehirIlceMahalleAdi
          )
      );
  }, [existUser]);

  const editUser = async (userdata) => {
    const formData = new FormData();
    for (var key in userdata) {
      formData.append(key, userdata[key]);
    }

    images[0] &&
    images.forEach((item) => {
        formData.append("uploadImage", item);
      });

    await put(API + "/User?id=" + existUser.userId, formData, {
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
    })
      .then((resp) => handleChange(resp.data.data))
      .catch(function (error) {
        console.log(error);
      });
  };

  //#region Image User

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
    fetchUrlToImage(fileList, "user")
      .then(files=>setImages(files));
  }, [fileList]);

  const handleCancel = () => setPreviewVisible(false);

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

  const fupper = (label) => {
    return label.substring(0, 1) + label.substring(1).toLocaleLowerCase("tr");
  };

  const {
    modalProps,
    formProps,
    show,
    formLoading,
    // formValues,
    // formResult,
  } = useModalForm({
    defaultVisible: false,
    autoSubmitClose: true,
    autoResetForm: true,
    async submit({ name, surname, provinceId, dateOfBirth }) {
      setOkButton(true);
      await new Promise((r) => setTimeout(r, 1000));
      const userdata = {
        name,
        surname,
        provinceId,
        dateOfBirth: new Date(dateOfBirth).toUTCString(),
      };
      editUser(userdata);
      return "ok";
    },
    form,
  });

  return (
    <div className="mt-36 relative">
      <div className="bg-white rounded p-6">
        {currentUser.userId && currentUser.userId === userProfile.userId ? (
          <div className="flex gap-x-4">
            <div className="">
              <img
                className="rounded-full h-32 w-32"
                src={`${API_IMAGES}user/${existUser && existUser.userPhoto}`}
              />
            </div>
            <div className="flex flex-col">
              <span className=" font-black text-2xl">
                {existUser &&
                  empty(existUser.name) + " " + empty(existUser.surname)}
              </span>
              {location != "" && (
                <span className="flex items-center">
                  <BsGeoAltFill className="text-gray-500 mr-1" />
                  {location}
                </span>
              )}
              <div className="flex space-x-6 pt-4">
                <div className="flex flex-col">
                  <span className="font-semibold text-base tracking-tight">
                    Yorum
                  </span>
                  <span className="tracking-tight text-[17px]">
                    {userProfile.totalComment}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-base tracking-tight">
                    Fotoğraf
                  </span>
                  <span className="tracking-tight text-[17px]">
                    {userProfile.totalImage}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-base tracking-tight">
                    Takipçi
                  </span>
                  <span className="tracking-tight text-[17px]">2</span>
                </div>
              </div>
            </div>
            <div className="ml-auto mr-2 flex gap-x-4">
              <div>
                <BsFillPencilFill
                  onClick={() => {
                    show();
                    form.resetFields();
                    setOkButton(false);
                    existUser.userPhoto != "defaultuser.png" && setFileList([
                      {
                        uid: "-1",
                        name: existUser.userPhoto,
                        status: "done",
                        url: API_IMAGES + "user/" + existUser.userPhoto,
                      },
                    ]);
                  }}
                  className="text-xl hover:text-gray-500 cursor-pointer"
                />
                <Modal
                  {...modalProps}
                  forceRender
                  transitionName=""
                  getContainer={false}
                  cancelText="İptal"
                  okText="Kaydet"
                  okButtonProps={{ disabled: okButton }}
                  title={
                    <div className="relative">
                      <div className="px-6 py-1 before:w-[4px] before:h-full before:bg-red-700 before:block before:rounded-lg before:absolute before:top-0 before:left-0 before:content-['']">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold text-xl block">
                            Profili Güncelle
                          </span>
                        </div>
                      </div>
                    </div>
                  }
                  centered
                >
                  <Spin spinning={formLoading}>
                    <Form
                      {...formProps}
                      // labelCol={{ span: 5 }}
                      // wrapperCol={{ span: 19 }}
                      // className="space-y-3"
                      initialValues={{
                        name: existUser && existUser.name,
                        surname: existUser && existUser.surname,
                        city:
                          existUser &&
                          existUser.provinceId &&
                          Province.find(
                            (x) =>
                              x.id ===
                              Province.find(
                                (y) => y.id === existUser.provinceId
                              ).ustID
                          ).id,
                        provinceId: existUser && existUser.provinceId,
                        dateOfBirth:
                          existUser &&
                          existUser.dateOfBirth &&
                          moment(existUser.dateOfBirth),
                      }}
                      autoComplete="off"
                    >
                      <Form.Item name="upload" valuePropName="file">
                        <Upload
                          name="logo"
                          beforeUpload={() => false}
                          onPreview={handleImagePreview}
                          onChange={handleImageChange}
                          fileList={fileList}
                          accept="image/png, image/jpeg"
                          listType="picture-card"
                        >
                          {fileList.length > 0 ? null : uploadButton}
                        </Upload>
                      </Form.Item>
                      <div className="flex items-center gap-x-4">
                        <Form.Item className="mb-0">
                          <UserOutlined
                            style={{ fontSize: "18px" }}
                            className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
                          />
                          <Form.Item
                            name="name"
                            rules={[
                              {
                                required: true,
                                message: "Lütfen adınızı girin!",
                              },
                              {
                                min: 2,
                                message: "Adınız minimum 2 karakter olmalı!",
                              },
                            ]}
                            // className="mb-0"
                          >
                            <Input
                              className="shadow pl-10 h-12 z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              type={"text"}
                              placeholder="Ad"
                              tabIndex="0"
                            />
                          </Form.Item>
                        </Form.Item>
                        <Form.Item className="mb-0">
                          <UserOutlined
                            style={{ fontSize: "18px" }}
                            className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
                          />
                          <Form.Item
                            name="surname"
                            rules={[
                              {
                                required: true,
                                message: "Lütfen soyadınızı girin!",
                              },
                              {
                                min: 2,
                                message: "Soyadınız minimum 2 karakter olmalı!",
                              },
                            ]}
                            // className="mb-0"
                          >
                            <Input
                              className="shadow pl-10 h-12 z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                              type={"text"}
                              placeholder="Soyad"
                              tabIndex="0"
                            />
                          </Form.Item>
                        </Form.Item>
                      </div>

                      <div className="flex items-center gap-x-4 profileSelect">
                        <Form.Item className="mb-0 w-full">
                          <HomeOutlined
                            style={{ fontSize: "18px" }}
                            className="pointer-events-none w-5 h-5 z-10 absolute top-[14px] transform left-3 text-gray-400"
                          />
                          <Form.Item
                            name="city"
                            rules={[
                              {
                                required: true,
                                message: "Lütfen bir il seçin!",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              notFoundContent={
                                <Empty
                                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                                  description={"İl Bulunamadı"}
                                />
                              }
                              className="shadow z-60 text-gray-700 leading-tight"
                              placeholder="İl seçin"
                              onSelect={(e) => {
                                setTown(Province.filter((x) => x.ustID == e));
                                form.setFieldsValue({ provinceId: null });
                              }}
                              filterOption={(input, option) =>
                                (
                                  option?.label.toLocaleLowerCase("tr") ?? ""
                                ).includes(input.toLocaleLowerCase("tr"))
                              }
                              filterSort={(optionA, optionB) =>
                                (optionA?.label ?? "")
                                  .toLocaleLowerCase("tr")
                                  .localeCompare(
                                    (optionB?.label ?? "").toLocaleLowerCase(
                                      "tr"
                                    )
                                  )
                              }
                            >
                              {Province.slice(0, 81)
                                .sort()
                                .map((province, i) => (
                                  <Option
                                    key={province.id}
                                    label={province.sehirIlceMahalleAdi}
                                    value={province.id}
                                  >
                                    {fupper(province.sehirIlceMahalleAdi)}
                                  </Option>
                                ))}
                            </Select>
                          </Form.Item>
                        </Form.Item>

                        <Form.Item className="mb-0 w-full">
                          <HomeOutlined
                            style={{ fontSize: "18px" }}
                            className="pointer-events-none w-5 h-5 z-10 absolute top-[14px] transform left-3 text-gray-400"
                          />
                          <Form.Item
                            name="provinceId"
                            rules={[
                              {
                                required: true,
                                message: "Lütfen bir ilçe seçin!",
                              },
                            ]}
                          >
                            <Select
                              showSearch
                              getPopupContainer={(trigger) =>
                                trigger.parentNode
                              }
                              notFoundContent={
                                <Empty
                                  image={Empty.PRESENTED_IMAGE_SIMPLE}
                                  description={"İlçe Bulunamadı"}
                                />
                              }
                              className="shadow z-60 text-gray-700 leading-tight"
                              placeholder="İlçe seçin"
                              filterOption={(input, option) =>
                                (
                                  option?.label.toLocaleLowerCase("tr") ?? ""
                                ).includes(input.toLocaleLowerCase("tr"))
                              }
                              filterSort={(optionA, optionB) =>
                                (optionA?.label ?? "")
                                  .toLocaleLowerCase("tr")
                                  .localeCompare(
                                    (optionB?.label ?? "").toLocaleLowerCase(
                                      "tr"
                                    )
                                  )
                              }
                            >
                              {town.map((town, i) => (
                                <Option
                                  key={town.id}
                                  label={town.sehirIlceMahalleAdi}
                                  value={town.id}
                                >
                                  {fupper(town.sehirIlceMahalleAdi)}
                                </Option>
                              ))}
                            </Select>
                          </Form.Item>
                        </Form.Item>
                      </div>

                      <Form.Item className="mb-0">
                        <CalendarOutlined
                          style={{ fontSize: "18px" }}
                          className="pointer-events-none w-5 h-5 z-10 absolute top-[15px] transform left-3 text-gray-400"
                        />
                        <Form.Item
                          name="dateOfBirth"
                          rules={[
                            {
                              required: true,
                              message: "Lütfen doğum tarihinizi girin!",
                            },
                          ]}
                        >
                          <DatePicker
                            suffixIcon={""}
                            placeholder="Doğum tarihiniz"
                            transitionName=""
                            format={"DD/MM/YYYY"}
                            className="relative shadow pl-10 h-12 z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700  leading-tight focus:outline-none focus:shadow-outline"
                          />
                        </Form.Item>
                      </Form.Item>

                      <Form.Item name="about">
                        <TextArea
                          rows={4}
                          placeholder="Kısaca kendiniz ile ilgili bilgi verin"
                          maxLength={120}
                          className="relative shadow z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        />
                      </Form.Item>
                    </Form>
                  </Spin>
                </Modal>
              </div>
              <div>
                <BsThreeDots className="text-2xl hover:text-gray-500 cursor-pointer" />
              </div>
            </div>
          </div>
        ) : (
          <div className="flex gap-x-4">
            <div className="">
              <img
                className="rounded-full h-32 w-32"
                src={`${API_IMAGES}user/${userProfile.userPhoto}`}
              />
            </div>
            <div className="flex flex-col">
              <span className=" font-black text-2xl">
                {empty(userProfile.name) + " " + empty(userProfile.surname)}
              </span>
              {userProfile.location != null && (
                <span className="flex items-center">
                  <BsGeoAltFill className="text-gray-500 mr-1" />
                  {userProfile.location}
                </span>
              )}

              <div className="flex space-x-6 pt-6">
                <div className="flex flex-col">
                  <span className="font-semibold text-base tracking-tight">
                    Yorum
                  </span>
                  <span className="tracking-tight text-[17px]">
                    {userProfile.totalComment}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-base tracking-tight">
                    Fotoğraf
                  </span>
                  <span className="tracking-tight text-[17px]">
                    {userProfile.totalImage}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="font-semibold text-base tracking-tight">
                    Takipçi
                  </span>
                  <span className="tracking-tight text-[17px]">2</span>
                </div>
              </div>
            </div>
            <div className="ml-auto mr-2 flex gap-x-4">
              <div>
                <BsThreeDots className="text-2xl hover:text-gray-500 cursor-pointer" />
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="flex mt-5 space-x-5">
        <div className="w-1/4">
          <div className="p-4 bg-white">
            <div className="pt-2 font-semibold text-gray-500 space-y-2">
              <span className="flex items-center bg-gray-100 p-2 rounded-lg">
                <BsLayoutTextSidebarReverse className="text-gray-500 mr-2 text-lg" />
                İncelemeler
              </span>
              <span className="flex items-center p-2 rounded-lg">
                <BsAspectRatio className="text-gray-500 mr-2 text-lg" />
                Fotoğraflar
              </span>
              <span className="flex items-center p-2 rounded-lg">
                <BsHeart className="text-gray-500 mr-2 text-lg" />
                Beğenilen Yorumlar
              </span>
              <span className="flex items-center p-2 rounded-lg">
                <BsShopWindow className="text-gray-500 mr-2 text-lg" />
                Kaydedilen İşletmeler
              </span>
              <span className="flex items-center p-2 rounded-lg">
                <BsGear className="text-gray-500 mr-2 text-lg" />
                Ayarlar
              </span>
              <span className="flex items-center p-2 rounded-lg">
                <BsArrowBarRight className="text-gray-500 mr-2 text-lg" />
                Çıkış Yap
              </span>
            </div>
          </div>
        </div>

        <div className="w-2/4 space-y-4">
          {comments.map((comment, index) => {
            if (comments.length === index + 1) {
              return (
                <div
                  ref={lastCommentElementRef}
                  key={index}
                  className="bg-white w-full"
                >
                  <div className="p-4">
                    <div className="flex gap-x-3">
                      <img
                        className="w-16 h-16 rounded"
                        src={`${API_IMAGES}business/thumbnail${comment.businessImage}`}
                      />
                      <div className="flex-col flex">
                        <div>
                          <span>
                            <Link
                              target="_blank"
                              to={`/isletme/${
                                seoHelp(comment.businessName) +
                                "-" +
                                comment.businessId
                              }`}
                              className="hover:text-red-500 font-bold text-[15px]"
                            >
                              {comment.businessName}
                            </Link>
                          </span>
                        </div>
                        <span className="text-xs flex items-center">
                          <BsGeoAltFill className="text-gray-500 mr-1" />{" "}
                          {comment.location}
                        </span>
                        <span className="text-xs pt-2 text-gray-400">
                          {moment(comment.created).format("DD.MM.yyyy")}{" "}
                          tarihinde yorum yapıldı.
                        </span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Rate
                        className="text-[15px] text-red-500 font-bold"
                        disabled
                        defaultValue={comment.rate}
                      />
                    </div>
                    <div className="pt-1">{comment.comment}</div>
                  </div>
                  <div className="relative">
                    <SwiperProfile
                      comment={comment}
                      user={userProfile}
                      API_IMAGES={API_IMAGES}
                    />
                  </div>
                  <div className="p-4 flex items-center gap-x-3 text-xs">
                    <button className="flex items-center gap-x-1 hover:text-red-500">
                      <BsHeart />
                      Beğen
                    </button>
                    <button className="flex items-center gap-x-1 hover:text-red-500">
                      <BsBookmark />
                      Kaydet
                    </button>
                  </div>
                </div>
              );
            } else {
              return (
                <div key={index} className="bg-white w-full">
                  <div className="p-4">
                    <div className="flex gap-x-3">
                      <img
                        className="w-16 h-16 rounded"
                        src={`${API_IMAGES}business/thumbnail${comment.businessImage}`}
                      />
                      <div className="flex-col flex">
                        <div>
                          <span>
                            <Link
                              target="_blank"
                              to={`/isletme/${
                                seoHelp(comment.businessName) +
                                "-" +
                                comment.businessId
                              }`}
                              className="hover:text-red-500 font-bold text-[15px]"
                            >
                              {comment.businessName}
                            </Link>
                          </span>
                        </div>
                        <span className="text-xs flex items-center">
                          <BsGeoAltFill className="text-gray-500 mr-1" />{" "}
                          {comment.location}
                        </span>
                        <span className="text-xs pt-2 text-gray-400">
                          {moment(comment.created).format("DD.MM.yyyy")}{" "}
                          tarihinde yorum yapıldı.
                        </span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <Rate
                        className="text-[15px] text-red-500 font-bold"
                        disabled
                        defaultValue={comment.rate}
                      />
                    </div>
                    <div className="pt-1">{comment.comment}</div>
                  </div>
                  <div className="relative">
                    <SwiperProfile
                      comment={comment}
                      user={userProfile}
                      API_IMAGES={API_IMAGES}
                    />
                  </div>
                  <div className="p-4 flex items-center gap-x-3 text-xs">
                    <button className="flex items-center gap-x-1 hover:text-red-500">
                      <BsHeart />
                      Beğen
                    </button>
                    <button className="flex items-center gap-x-1 hover:text-red-500">
                      <BsBookmark />
                      Kaydet
                    </button>
                  </div>
                </div>
              );
            }
          })}
          <div>{loading && <Skeleton active />}</div>
          <div>{error && "Error"}</div>
        </div>

        <div className="w-1/4">
          <div className="p-4 bg-white h-40">
            <div className="text-xs text-gray-500 space-y-2">
              <span className="flex items-center">
                <BsCalendar className="text-gray-500 mr-1" />
                {moment(userProfile.created).format("DD.MM.yyyy")} tarihinde
                katıldı.
              </span>
              <span className="flex items-center">
                <BsGeoAltFill className="text-gray-500 mr-1" />
                {location}
              </span>
            </div>
          </div>
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
    </div>
  );
};

export default profile;
