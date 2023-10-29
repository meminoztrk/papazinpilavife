import React, { useState, useEffect } from "react";
import { useModalForm } from "sunflower-antd";
import {
  Button,
  Input,
  Table,
  Space,
  Modal,
  Form,
  Switch,
  Spin,
  Empty,
  Upload,
  Select,
  TimePicker,
  Popover,
} from "antd";
import {
  CalendarOutlined,
  LinkOutlined,
  UserOutlined,
  ProfileOutlined,
  HomeOutlined,
  PlusOutlined,
  PhoneOutlined,
  Html5Outlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  SearchOutlined,
  ShopOutlined,
} from "@ant-design/icons";
import { AiFillEdit, AiOutlineDelete } from "react-icons/ai";
import Highlighter from "react-highlight-words";
import { MdOutlineError } from "react-icons/md";
import { useLoaderData } from "@remix-run/react";
import Province from "~/data/Province.json";
import { post, put } from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import ReactInputMask from "react-input-mask";
import mapgif from "public/googleIframe.gif";
import moment from "moment";
const { TextArea } = Input;
const { Option } = Select;

function compareByAlph(a, b) {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

export const loader = async ({ request }) => {
  const data = {
    API: process.env.REACT_APP_API,
    API_KEY: process.env.REACT_APP_API_KEY,
    API_IMAGES: process.env.REACT_APP_IMAGES,
  };
  return data;
};

const yeniisletme = () => {
  const [existUser, handleChange] = useOutletContext();
  const [town, setTown] = useState([]);
  const [district, setDistrict] = useState([]);
  const [foodType, setFoodType] = useState(false);
  const [maskBorder, setMaskBorder] = useState(false);
  const [ispost, setIsPost] = useState(true);
  const [editId, setEditId] = useState(0);
  const [table, setTable] = useState({ data: [], loading: false });
  const [search, setSearch] = useState({ searchText: "", searchedColumn: "" });
  const [deleteForm, setDeleteForm] = useState({ visible: false, deleteId: 0 });
  const { API, API_KEY, API_IMAGES } = useLoaderData();
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [limage, setLimage] = useState([]);
  const [license, setLicense] = useState([]);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [okButton, setOkButton] = useState(false);
  let navigate = useNavigate();

  const getDistrict = async (id) => {
    await fetch(API + "/Generic/GetProvinces?id=" + id, {
      method: "GET",
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setDistrict(data);
      });
  };

  const postBusiness = async (buss) => {
    const formData = new FormData();
    for (var key in buss) {
      formData.append(key, buss[key] == null ? "" : buss[key]);
    }
    images[0] &&
      images.forEach((item) => {
        formData.append("uploadedImages", item);
      });

    limage[0] &&
      limage.forEach((item) => {
        formData.append("uploadedLicense", item);
      });

    await post(API + "/Business/", formData, {
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
    })
      .then((resp) => navigate("/administrationv1/isletmeler"))
      .catch(function (error) {
        console.log(error);
      });
  };

  const content = (
    <div className="flex justify-center w-[1000px]">
      <img className="w-[calc(100%)]" src={mapgif} alt="" />
    </div>
  );

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

  useEffect(() => {
    fetchUrlToImage(license, "license").then((files) => setLimage(files));
  }, [license]);

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

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearch({ searchText: "" });
  };

  const getColumnSearchProps = (dataIndex, placeName) => ({
    filterDropdown: ({
      setSelectedKeys,
      selectedKeys,
      confirm,
      clearFilters,
    }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`${placeName} Ara `}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={(e) => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            className="bg-blue-400 text-white"
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            <div className="flex items-center justify-center space-x-2">
              <span>Ara</span>
              <SearchOutlined />
            </div>
          </Button>
          <Button
            onClick={() => {
              handleReset(clearFilters);
              confirm({ closeDropdown: false });
            }}
            size="small"
            style={{ width: 90 }}
          >
            Sıfırla
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearch({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
              });
            }}
          >
            Filtre
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex]
            .toString()
            .toLowerCase()
            .includes(value.toLowerCase())
        : "",
    render: (text) =>
      search.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[search.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ""}
        />
      ) : (
        text
      ),
  });
  //#endregion

  const fupper = (label) => {
    return label.substring(0, 1) + label.substring(1).toLocaleLowerCase("tr");
  };

  const timeToString = (time) => {
    return time.length > 0
      ? moment(time[0]).format("HH:mm") +
          " - " +
          moment(time[1]).format("HH:mm")
      : "";
  };

  const joinItem = (text) => {
    return text != null && text != "" ? text.join(",,") : null;
  };

  const {
    formProps,
    show,
    formLoading,
    // formValues,
    // formResult,
  } = useModalForm({
    defaultVisible: false,
    autoSubmitClose: true,
    autoResetForm: true,
    async submit(businessData) {
      businessData = {
        ...businessData,
        phone: businessData.phone.includes("_") ? null : businessData.phone,
        foodTypes: joinItem(businessData.foodTypes),
        businessProps: joinItem(businessData.businessProps),
        businessServices: joinItem(businessData.businessServices),
        commentTypes: joinItem(businessData.commentTypes),
        mo: timeToString(businessData.mo),
        tu: timeToString(businessData.tu),
        we: timeToString(businessData.we),
        th: timeToString(businessData.th),
        fr: timeToString(businessData.fr),
        sa: timeToString(businessData.sa),
        su: timeToString(businessData.mo),
        guidId: existUser.userId,
      };
      setOkButton(true);

      postBusiness(businessData);
      // console.log(businessData);
      return "ok";
    },
    form,
  });

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div>
          <Spin spinning={formLoading}>
            <Form
              {...formProps}
              initialValues={{
                phone: "",
                foodTypes: [],
                businessProps: [],
                businessServices: [],
                commentTypes: [],
                mo: [],
                tu: [],
                we: [],
                th: [],
                fr: [],
                sa: [],
                su: [],
              }}
            >
              {
                //#region Business Images
              }
              <div>
                <h2 className="font-medium my-1">İşletme Fotoğrafları</h2>
                <Form.Item name="upload" valuePropName="file">
                  <Upload
                    name="imagesOfBusiness"
                    beforeUpload={() => false}
                    onPreview={handleImagePreview}
                    onChange={handleImageChange}
                    fileList={fileList}
                    accept="image/png, image/jpeg"
                    listType="picture-card"
                  >
                    {fileList.length > 9 ? null : uploadButton}
                  </Upload>
                </Form.Item>
              </div>
              {
                //#endregion
              }
              {
                //#region BusinessTypes
              }
              <div className="flex items-center space-x-4 profileSelect">
                <div className="w-1/2 pr-2">
                  <h2 className="font-medium my-1">
                    İşletme Türü (<span className="text-red-500">*</span>)
                  </h2>
                  <Form.Item className="mb-0">
                    <ProfileOutlined
                      style={{ fontSize: "18px" }}
                      className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
                    />
                    <Form.Item
                      name="businessType"
                      rules={[
                        {
                          required: true,
                          message: "Lütfen işletme türünü seçin!",
                        },
                      ]}
                    >
                      <Select
                        className="shadow z-60   text-gray-700 leading-tight"
                        placeholder="İşletme türünüzü seçin"
                        getPopupContainer={(trigger) => trigger.parentNode}
                        onSelect={(e) => {
                          e == "Restoran"
                            ? setFoodType(true)
                            : setFoodType(false);
                        }}
                      >
                        <Option value="Restoran">Restoran (yemek vs.)</Option>
                        <Option value="Ev Hizmetleri">Ev Hizmetleri</Option>
                        <Option value="Araba Servisleri">
                          Araba Servisleri
                        </Option>
                        <Option value="Eğlence">Eğlence</Option>
                        <Option value="Spor">Spor</Option>
                        <Option value="Teknoloji">Teknoloji</Option>
                        <Option value="Alışveriş">Alışveriş</Option>
                        <Option value="Fabrika">Fabrika</Option>
                        <Option value="Diğer">Diğer</Option>
                      </Select>
                    </Form.Item>
                  </Form.Item>
                </div>
              </div>
              {
                //#endregion
              }
              {
                //#region BusinessName & BusinessMinHeader
              }
              <div className="flex items-center gap-x-4">
                <div className="w-full">
                  <h2 className="font-medium my-1">
                    İşletme Adı (<span className="text-red-500">*</span>)
                  </h2>
                  <Form.Item className="mb-0">
                    <ShopOutlined
                      style={{ fontSize: "18px" }}
                      className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
                    />
                    <Form.Item
                      name="businessName"
                      rules={[
                        {
                          required: true,
                          message: "Lütfen işletme adını girin!",
                        },
                        {
                          min: 2,
                          message: "Minimum 2 karakter olmalı!",
                        },
                      ]}
                    >
                      <Input
                        className="shadow pl-10 h-12 z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type={"text"}
                        placeholder="İşletme adınızı girin"
                        tabIndex="0"
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="w-full">
                  <h2 className="font-medium my-1">
                    İşletme Kısa Açıklama (
                    <span className="text-red-500">*</span>)
                  </h2>
                  <Form.Item className="mb-0">
                    <ShopOutlined
                      style={{ fontSize: "18px" }}
                      className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
                    />
                    <Form.Item
                      name="minHeader"
                      rules={[
                        {
                          required: true,
                          message: "Lütfen kısa açıklama girin!",
                        },
                        {
                          min: 2,
                          message: "Minimum 2 karakter olmalı!",
                        },
                      ]}
                    >
                      <Input
                        className="shadow pl-10 h-12 z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type={"text"}
                        placeholder="Kısa açıklama (hatay mutfağı, teknik servis vs.)"
                        tabIndex="0"
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
              </div>
              {
                //#endregion
              }
              {
                //#region BusinessLocationSelect
              }
              <div className="flex items-center gap-x-4 profileSelect">
                <div className="w-full">
                  <h2 className="font-medium my-1">
                    İşletme Lokasyonu (<span className="text-red-500">*</span>)
                  </h2>
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
                        getPopupContainer={(trigger) => trigger.parentNode}
                        notFoundContent={
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={"İl Bulunamadı"}
                          />
                        }
                        className="shadow text-gray-700 leading-tight"
                        placeholder="İl seçin"
                        onSelect={(e) => {
                          setTown(Province.filter((x) => x.ustID == e));
                          form.setFieldsValue({
                            cities: null,
                            provinceId: null,
                          });
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
                              (optionB?.label ?? "").toLocaleLowerCase("tr")
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
                </div>

                <div className="w-full">
                  <h2 className="font-medium my-1">
                    (<span className="text-red-500">*</span>)
                  </h2>
                  <Form.Item className="mb-0 w-full">
                    <HomeOutlined
                      style={{ fontSize: "18px" }}
                      className="pointer-events-none w-5 h-5 z-10 absolute top-[14px] transform left-3 text-gray-400"
                    />
                    <Form.Item
                      name="cities"
                      rules={[
                        {
                          required: true,
                          message: "Lütfen bir ilçe seçin!",
                        },
                      ]}
                    >
                      <Select
                        showSearch
                        getPopupContainer={(trigger) => trigger.parentNode}
                        notFoundContent={
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={"İlçe Bulunamadı"}
                          />
                        }
                        className="shadow text-gray-700 leading-tight"
                        placeholder="İlçe seçin"
                        onSelect={(e) => {
                          form.setFieldsValue({ provinceId: null });
                          getDistrict(e);
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
                              (optionB?.label ?? "").toLocaleLowerCase("tr")
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

                <div className="w-full">
                  <h2 className="font-medium my-1">
                    (<span className="text-red-500">*</span>)
                  </h2>
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
                        getPopupContainer={(trigger) => trigger.parentNode}
                        notFoundContent={
                          <Empty
                            image={Empty.PRESENTED_IMAGE_SIMPLE}
                            description={"Mahalle Bulunamadı"}
                          />
                        }
                        className="shadow text-gray-700 leading-tight"
                        placeholder="Mahalle seçin"
                        filterOption={(input, option) =>
                          (
                            option?.label.toLocaleLowerCase("tr") ?? ""
                          ).includes(input.toLocaleLowerCase("tr"))
                        }
                        filterSort={(optionA, optionB) =>
                          (optionA?.label ?? "")
                            .toLocaleLowerCase("tr")
                            .localeCompare(
                              (optionB?.label ?? "").toLocaleLowerCase("tr")
                            )
                        }
                      >
                        {district.map((district, i) => (
                          <Option
                            key={district.id}
                            label={district.sehirIlceMahalleAdi}
                            value={district.id}
                          >
                            {fupper(district.sehirIlceMahalleAdi)}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Form.Item>
                </div>
              </div>
              {
                //#endregion
              }
              {
                //#region BusinessAdress & BusinessPhone
              }
              <div className="flex items-center gap-x-4">
                <div className="w-full">
                  <h2 className="font-medium my-1">
                    Açık Adres (<span className="text-red-500">*</span>)
                  </h2>
                  <Form.Item className="mb-0">
                    <HomeOutlined
                      style={{ fontSize: "18px" }}
                      className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
                    />
                    <Form.Item
                      name="adress"
                      rules={[
                        {
                          required: true,
                          message: "Lütfen açık adres girin!",
                        },
                        {
                          min: 10,
                          message: "Adres minimum 10 karakter olmalı!",
                        },
                      ]}
                    >
                      <Input
                        className="shadow pl-10 h-12 z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type={"text"}
                        placeholder="İşletmenin açık adresini girin"
                        tabIndex="0"
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="w-full">
                  <h2 className="font-medium my-1">Telefon</h2>
                  <Form.Item className="mb-0">
                    <PhoneOutlined
                      style={{ fontSize: "18px" }}
                      className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
                    />
                    <Form.Item name="phone">
                      <ReactInputMask
                        className={`shadow pl-10 h-12 z-0 ${
                          maskBorder ? "border-red-500" : ""
                        } appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-transparent leading-tight focus:outline-none focus:shadow-outline`}
                        type={"text"}
                        placeholder="Telefon"
                        tabIndex="0"
                        mask="(999) 999 99 99"
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
              </div>
              {
                //#endregion
              }
              {
                //#region BusinessIFrame & BusinessWebsite
              }
              <div className="flex items-center gap-x-4">
                <div className="w-full">
                  <h2 className="font-medium my-1">
                    Google Maps IFrame{" "}
                    <span className="text-xs font-light">
                      (İşletmenizin daha kolay bulunması için{" "}
                      <Popover
                        content={content}
                        trigger="click"
                        title="Google IFrame nasıl bulurum ?"
                        getPopupContainer={(trigger) => trigger.parentNode}
                      >
                        <button className=" underline text-red-500 cursor-pointer">
                          iframe
                        </button>
                      </Popover>{" "}
                      girin)
                    </span>
                  </h2>

                  <Form.Item className="mb-0">
                    <Html5Outlined
                      style={{ fontSize: "18px" }}
                      className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
                    />
                    <Form.Item name="mapIframe">
                      <Input
                        className="shadow pl-10 h-12 z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type={"text"}
                        placeholder="İşletmenizin lokasyonu için google iframe girin"
                        tabIndex="0"
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="w-full">
                  <h2 className="font-medium my-1">İşletme Web Sayfası</h2>
                  <Form.Item className="mb-0">
                    <LinkOutlined
                      style={{ fontSize: "18px" }}
                      className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
                    />
                    <Form.Item name="website">
                      <Input
                        className="shadow pl-10 h-12 z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type={"text"}
                        placeholder="Varsa işletmenin web sayfasını girin"
                        tabIndex="0"
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
              </div>
              {
                //#endregion
              }
              {
                //#region BusinessLicense
              }
              <div>
                <h2 className="font-medium my-1">
                  İşyeri Ruhsatı{" "}
                  <span className="text-xs font-light">
                    (İşyerinin size ait olduğunu kanıtlamak için ruhsat vb.
                    ekleyin)
                  </span>
                </h2>
                <Form.Item name="license" valuePropName="file">
                  <Upload
                    name="businessLicense"
                    beforeUpload={() => false}
                    onPreview={handleImagePreview}
                    onChange={(e) => setLicense(e.fileList)}
                    fileList={license}
                    accept="image/png, image/jpeg"
                    listType="picture-card"
                  >
                    {license.length > 0 ? null : uploadButton}
                  </Upload>
                </Form.Item>
              </div>
              {
                //#endregion
              }
              <hr className="my-4"></hr>
              {
                //#region BusinessAbout
              }
              <div>
                <h2 className="text-base font-medium mb-4">
                  <span className="underline">İşletme Hakkında</span>{" "}
                  <span className="text-xs font-light">
                    (Kullanıcıların sizi daha kolay arayıp bulması için
                    doldurun. Birden fazla özellik girebilirsiniz)
                  </span>
                </h2>
                {
                  //#region BusinessFoodTypes
                }
                <div
                  className={`w-full tagsInput ${
                    foodType ? "block" : "hidden"
                  }`}
                >
                  <h2 className="font-medium my-1">Yemek Çeşitleri</h2>
                  <Form.Item className="mb-0">
                    <Form.Item name="foodTypes">
                      <Select
                        mode="tags"
                        open={false}
                        className="shadow z-0 text-gray-700 leading-tight"
                        placeholder="Yemek çeşitlerinizi girin (çorba, döner, pizza vs.)"
                      ></Select>
                    </Form.Item>
                  </Form.Item>
                </div>
                {
                  //#endregion
                }
                {
                  //#region BusinessProps
                }
                <div className="w-full tagsInput">
                  <h2 className="font-medium my-1">İşletme Özellikleri</h2>
                  <Form.Item className="mb-0">
                    <Form.Item name="businessProps">
                      <Select
                        mode="tags"
                        open={false}
                        className="shadow z-0 text-gray-700 leading-tight"
                        placeholder="İşletme özelliklerini girin (otopark, bahçe, aile, tv vs.)"
                      ></Select>
                    </Form.Item>
                  </Form.Item>
                </div>
                {
                  //#endregion
                }
                {
                  //#region BusinessServices
                }
                <div className="w-full tagsInput">
                  <h2 className="font-medium my-1">Verilen Hizmetler</h2>
                  <Form.Item className="mb-0">
                    <Form.Item name="businessServices">
                      <Select
                        mode="tags"
                        open={false}
                        className="shadow z-0 text-gray-700 leading-tight"
                        placeholder="İşletmenizin verdiği hizmetleri girin (gel al, paket servis, ücretsiz wifi, telefon tamiri vs.)"
                      ></Select>
                    </Form.Item>
                  </Form.Item>
                </div>
                {
                  //#endregion
                }
                {
                  //#region CommentTypes
                }
                <div className="w-full tagsInput">
                  <h2 className="font-medium my-1">
                    İşletme İçeriği{" "}
                    <span className="text-xs font-light">
                      (Kullanıcıların işletmenizi hangi başlık altında
                      yorumlayacağını belirtir.)
                    </span>
                  </h2>
                  <Form.Item className="mb-0">
                    <Form.Item name="commentTypes">
                      <Select
                        mode="multiple"
                        getPopupContainer={(trigger) => trigger.parentNode}
                        className="shadow text-gray-700 leading-tight"
                        placeholder="Yorum başlıklarını seçin"
                      >
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
                </div>
                {
                  //#endregion
                }
                {
                  //#region BusinessTime
                }
                <div className="w-full">
                  <h1 className="font-medium my-1">
                    Çalışma Saatleri
                    <span className="text-xs font-light">
                      (İşletmenin çalışma saat aralığını girin. Eğer o gün
                      kapalıysa 00:00 - 00:00 olarak seçin)
                    </span>
                  </h1>
                  <div className="flex items-center space-x-2 pickerInput">
                    <div>
                      <h2 className="font-medium my-1">Pazartesi</h2>
                      <Form.Item className="mb-0">
                        <Form.Item name="mo">
                          <TimePicker.RangePicker
                            className="text-center"
                            clearIcon
                            placeholder=""
                            suffixIcon=""
                            format="HH:mm"
                          />
                        </Form.Item>
                      </Form.Item>
                    </div>
                    <div>
                      <h2 className="font-medium my-1">Salı</h2>
                      <Form.Item className="mb-0">
                        <Form.Item name="tu">
                          <TimePicker.RangePicker
                            className="text-center"
                            clearIcon
                            placeholder=""
                            suffixIcon=""
                            format="HH:mm"
                          />
                        </Form.Item>
                      </Form.Item>
                    </div>
                    <div>
                      <h2 className="font-medium my-1">Çarşamba</h2>
                      <Form.Item className="mb-0">
                        <Form.Item name="we">
                          <TimePicker.RangePicker
                            className="text-center"
                            clearIcon
                            placeholder=""
                            suffixIcon=""
                            format="HH:mm"
                          />
                        </Form.Item>
                      </Form.Item>
                    </div>
                    <div>
                      <h2 className="font-medium my-1">Perşembe</h2>
                      <Form.Item className="mb-0">
                        <Form.Item name="th">
                          <TimePicker.RangePicker
                            className="text-center"
                            clearIcon
                            placeholder=""
                            suffixIcon=""
                            format="HH:mm"
                          />
                        </Form.Item>
                      </Form.Item>
                    </div>
                    <div>
                      <h2 className="font-medium my-1">Cuma</h2>
                      <Form.Item className="mb-0">
                        <Form.Item name="fr">
                          <TimePicker.RangePicker
                            className="text-center"
                            clearIcon
                            placeholder=""
                            suffixIcon=""
                            format="HH:mm"
                          />
                        </Form.Item>
                      </Form.Item>
                    </div>
                    <div>
                      <h2 className="font-medium my-1">Cumartesi</h2>
                      <Form.Item className="mb-0">
                        <Form.Item name="sa">
                          <TimePicker.RangePicker
                            className="text-center"
                            clearIcon
                            placeholder=""
                            suffixIcon=""
                            format="HH:mm"
                          />
                        </Form.Item>
                      </Form.Item>
                    </div>
                    <div>
                      <h2 className="font-medium my-1">Pazar</h2>
                      <Form.Item className="mb-0">
                        <Form.Item name="su">
                          <TimePicker.RangePicker
                            className="text-center"
                            clearIcon
                            placeholder=""
                            suffixIcon=""
                            format="HH:mm"
                          />
                        </Form.Item>
                      </Form.Item>
                    </div>
                  </div>
                </div>
                {
                  //#endregion
                }
                {
                  //#region BusinessAboutText
                }
                <div className="w-full tagsInput">
                  <h2 className="font-medium my-1">İşletme Hakkında</h2>
                  <Form.Item className="mb-0">
                    <Form.Item name="about">
                      <TextArea
                        rows={4}
                        placeholder="İşletme hakkında bilgi verin"
                        maxLength={240}
                        className="relative shadow z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
                {
                  //#endregion
                }
              </div>
              {
                //#endregion
              }
              <hr className="mb-4"></hr>
              {
                //#region BusinessSocial
              }
              <div className="flex items-center gap-x-4">
                <div className="w-full">
                  <h2 className="font-medium my-1">Instagram</h2>
                  <Form.Item className="mb-0">
                    <InstagramOutlined
                      style={{ fontSize: "18px" }}
                      className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
                    />
                    <Form.Item name="instagram">
                      <Input
                        className="shadow pl-10 h-12 z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type={"text"}
                        placeholder="Instagram hesabı linki"
                        tabIndex="0"
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="w-full">
                  <h2 className="font-medium my-1">Twitter</h2>
                  <Form.Item className="mb-0">
                    <TwitterOutlined
                      style={{ fontSize: "18px" }}
                      className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
                    />
                    <Form.Item name="twitter">
                      <Input
                        className="shadow pl-10 h-12 z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type={"text"}
                        placeholder="Twitter hesabı linki"
                        tabIndex="0"
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
                <div className="w-full">
                  <h2 className="font-medium my-1">Facebook</h2>
                  <Form.Item className="mb-0">
                    <FacebookOutlined
                      style={{ fontSize: "18px" }}
                      className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
                    />
                    <Form.Item name="facebook">
                      <Input
                        className="shadow pl-10 h-12 z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type={"text"}
                        placeholder="Facebook hesabı linki"
                        tabIndex="0"
                      />
                    </Form.Item>
                  </Form.Item>
                </div>
              </div>
              {
                //#endregion
              }

              <div className="w-full">
                <Form.Item>
                  <div className="flex items-center justify-end">
                    <button
                      {...(formLoading && { disabled: true })}
                      className="px-10 py-2 rounded bg-red-700 hover:bg-red-900 text-white font-semibold"
                      type="sumbit"
                    >
                      <div className="flex items-center">
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
                        <span>KAYDET</span>
                      </div>
                    </button>
                  </div>
                </Form.Item>
              </div>
            </Form>
          </Spin>
        </div>
      </div>

      <div>
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
    </div>
  );
};

export default yeniisletme;
