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

const mybusinesses = () => {
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

  const getBusinesses = async () => {
    setTable({ loading: true });
    setTimeout(() => {
      fetch(
        API + `/Business/GetBusinessesByUserId?userId=${existUser.userId}`,
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
          console.log(data);
          setTable({
            loading: false,
            data: data.data,
          });
        });
    }, 200);
  };

  const getBusiness = async (id) => {
    form.resetFields();
    setIsPost(false);
    await fetch(API + `/Business/GetBusinessById?id=${id}`, {
      method: "GET",
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data.data);
        setTown(Province.filter((x) => x.ustID == data.data.city));
        getDistrict(data.data.cities);
        data.data.businessType == "Restoran" ? setFoodType(true) : setFoodType(false);
        setFileList(
          data.data.businessImages.map((x,index) => ({
            uid: index,
            name: x,
            status: "done",
            url: API_IMAGES + "business/" + x,
          }))
        );
        setLicense([
          {
            uid: "-1",
            name: data.data.businessLicense,
            status: "done",
            url: API_IMAGES + "license/" + data.data.businessLicense,
          },
        ]);
        
        setEditId(data.data.id);
        form.setFieldsValue({
          businessType: data.data.businessType,
          businessName: data.data.businessName,
          minHeader: data.data.minHeader,
          city: data.data.city,
          cities: data.data.cities,
          provinceId: data.data.provinceId,
          adress: data.data.adress,
          phone: data.data.phone,
          mapIframe: data.data.mapIframe,
          website: data.data.website,
          foodTypes: splitItem(data.data.foodTypes),
          businessProps: splitItem(data.data.businessProps),
          businessServices: splitItem(data.data.businessServices),
          commentTypes: splitItem(data.data.commentTypes),
          mo: stringToTime(data.data.mo),
          tu: stringToTime(data.data.tu),
          we: stringToTime(data.data.we),
          th: stringToTime(data.data.th),
          fr: stringToTime(data.data.fr),
          sa: stringToTime(data.data.sa),
          su: stringToTime(data.data.su),
          about: data.data.about,
          facebook: data.data.facebook,
          instagram: data.data.instagram,
          twitter: data.data.twitter
        });
        show();
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
      .then((resp) => getBusinesses())
      .catch(function (error) {
        console.log(error);
      });
  };

  const putBusiness = async (buss) => {
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


    await put(API + "/Business/?id=" + editId, formData, {
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
    })
      .then((resp) => getBusinesses())
      .catch(function (error) {
        console.log(error);
      });
  };

  const patchIsActive = async (id, isActive) => {
    await fetch(API + `/Business/${id}`, {
      method: 'PATCH',
      headers: {
        'ApiKey': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ path: "isActive", value: isActive }])
    }).catch(function (err) {
      console.info(err);
    });
  }

  const patchIsDeleted = async (id) => {
    await fetch(API + `/Business/${id}`, {
      method: 'PATCH',
      headers: {
        'ApiKey': API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify([{ path: "isDeleted", value: true }])
    })
      .then(response => {
        if (response.ok) {
          setDeleteForm({ visible: false })
          getBusinesses();
        }
      })
      .catch(function (err) {
        console.info(err);
      });
  }

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
    fetchUrlToImage(fileList, "business")
      .then(files=>setImages(files));
  }, [fileList]);

  useEffect(() => {
    fetchUrlToImage(license, "license")
      .then(files=>setLimage(files));
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

  //#region Table Search
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

  const columns = [
    {
      title: "",
      dataIndex: "businessImage",
      key: "businessImage",
      width: "5%",
      align: "center",
      render: (text, record) => (
        <div className="w-20">
          <img
            src={text == null ? API_IMAGES + "business/defaultbusiness.png" : API_IMAGES + "business/thumbnail" + text}
            alt="..."
            className="w-20 h-16 object-cover  shadow rounded-lg align-middle border-none"
          />
        </div>
      ),
    },
    {
      title: <span className="text-xs">İşletme Adı</span>,
      dataIndex: "businessName",
      key: "businessName",
      className: "font-medium",
      sorter: (a, b) => compareByAlph(a.businessName, b.businessName),
      ...getColumnSearchProps("businessName", "İşletme Adı"),
    },
    {
      title: "Tipi",
      dataIndex: "businessType",
      key: "businessType",
      sorter: (a, b) => compareByAlph(a.businessType, b.businessType),
      ...getColumnSearchProps("businessType", "İşletme Tipi"),
    },
    {
      title: "Lokasyon",
      dataIndex: "location",
      key: "location",
      className: "font-medium",
      sorter: (a, b) => compareByAlph(a.location, b.location),
      ...getColumnSearchProps("location", "Lokasyon"),
    },
    {
      title: "Süreç",
      dataIndex: "process",
      width: "15%",
      key: "process",
      className: "font-medium",
      sorter: (a, b) => compareByAlph(a.process, b.process),
      render: (text, record) => (
        <span
          className={`${
            text == "Onay Bekliyor" ? "text-orange-500" : "text-green-500"
          }`}
        >
          {text}
        </span>
      ),
    },
    {
      title: "İnceleme",
      dataIndex: "views",
      width: "5%",
      key: "views",
      align: "center",
      sorter: (a, b) => compareByAlph(a.views, b.views),
    },
    {
      title: "Aktif",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      render: (text, record) => (
        <Switch
          {...(record.isActive
            ? { defaultChecked: true }
            : { defaultChecked: false })}
          onChange={(e) => patchIsActive(record.id, e)}
          checkedChildren="Aktif"
          unCheckedChildren="Pasif"
        />
      ),
    },
    {
      title: "İşlem",
      dataIndex: "address",
      key: "address",
      render: (text, record) => (
        <div className="flex items-center space-x-2">
          <Button
            className="rounded-md p-2 hover:text-orange-500 hover:border-orange-500"
            onClick={() => getBusiness(record.id)}
          >
            <AiFillEdit />
          </Button>
          <Button
            className="rounded-md p-2 hover:text-red-500 hover:border-red-500"
            onClick={() =>
              setDeleteForm({ visible: true, deleteId: record.id })
            }
          >
            <AiOutlineDelete />
          </Button>
        </div>
      ),
    },
  ];

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

  const stringToTime = (time) => {
    if(!time){
      return null;
    }
    var array = time.split(" - ");
    return [moment(`01/01/2023 ${array[0]}`,"MM/DD/YYYY HH:mm"), moment(`01/01/2023 ${array[1]}`,"MM/DD/YYYY HH:mm")]
  };

  const splitItem = (text) => {
    return text != null ? text.split(",,") : [];
  };

  const joinItem = (text) => {
    return text != null && text != "" ? text.join(",,") : null;
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
    async submit(businessData) {
      businessData = {
        ...businessData,
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
      // setOkButton(true);

      ispost ? postBusiness(businessData) : putBusiness(businessData);
      // console.log(businessData);
      return "ok";
    },
    form,
  });

  useEffect(() => {
    getBusinesses(existUser.userId);
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">İşletmelerim</h1>
        <div>
          <button
            className="bg-red-500 rounded-md hover:bg-red-700 text-white p-2 flex items-center space-x-1"
            onClick={() => {
              setIsPost(true);
              show();
              form.resetFields();
              setFileList([]);
              setLicense([]);
              setTown([]);
              setDistrict([]);
              setFoodType(false);

            }}
            type="primary"
          >
            <span>İşletme Ekle</span>
            <PlusOutlined size={18} />
          </button>
          <Modal
            {...modalProps}
            maskClosable={false}
            forceRender
            width={1000}
            transitionName=""
            className="py-10"
            getContainer={false}
            cancelText="İptal"
            okText="Kaydet"
            okButtonProps={{ disabled: okButton }}
            title={
              <div className="relative">
                <div className="px-6 py-1 before:w-[4px] before:h-full before:bg-red-700 before:block before:rounded-lg before:absolute before:top-0 before:left-0 before:content-['']">
                  <div className="flex items-center space-x-2">
                    <span className="font-semibold text-xl block">
                      {ispost ? "İşletme Ekle" : "İşletme Düzenle"}
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
                      İşletme Lokasyonu (<span className="text-red-500">*</span>
                      )
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
                    <h2 className="font-medium my-1">
                      Telefon (<span className="text-red-500">*</span>)
                    </h2>
                    <Form.Item className="mb-0">
                      <PhoneOutlined
                        style={{ fontSize: "18px" }}
                        className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
                      />
                      <Form.Item
                        name="phone"
                        rules={[
                          {
                            validator(rule, value) {
                              return new Promise((resolve, reject) => {
                                if (
                                  value &&
                                  !value.includes("_") &&
                                  value.length > 0
                                ) {
                                  resolve();
                                  setMaskBorder(false);
                                } else {
                                  reject("Geçerli telefon numarası girin!");
                                  setMaskBorder(true);
                                }
                              });
                            },
                          },
                        ]}
                      >
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
                  <Form.Item
                    name="license"
                    valuePropName="file"
                    rules={[
                      {
                        validator(rule, value) {
                          return new Promise((resolve, reject) => {
                            if (license.length == 1) {
                              resolve();
                            } else {
                              reject("İşyeri Ruhsatı ekleyiniz!");
                            }
                          });
                        },
                      },
                    ]}
                  >
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
                      Çalışma Saatleri (<span className="text-red-500">*</span>)
                      <span className="text-xs font-light">
                        (İşletmenizin çalışma saat aralığını girin. Eğer o gün
                        kapalıysa 00:00 - 00:00 olarak seçin)
                      </span>
                    </h1>
                    <div className="flex items-center space-x-2 pickerInput">
                      <div>
                        <h2 className="font-medium my-1">Pazartesi</h2>
                        <Form.Item className="mb-0">
                          <Form.Item
                            name="mo"
                            rules={[
                              {
                                required: true,
                                message: "Çalışma saati girin!",
                              },
                            ]}
                          >
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
                          <Form.Item
                            name="tu"
                            rules={[
                              {
                                required: true,
                                message: "Çalışma saati girin!",
                              },
                            ]}
                          >
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
                          <Form.Item
                            name="we"
                            rules={[
                              {
                                required: true,
                                message: "Çalışma saati girin!",
                              },
                            ]}
                          >
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
                          <Form.Item
                            name="th"
                            rules={[
                              {
                                required: true,
                                message: "Çalışma saati girin!",
                              },
                            ]}
                          >
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
                          <Form.Item
                            name="fr"
                            rules={[
                              {
                                required: true,
                                message: "Çalışma saati girin!",
                              },
                            ]}
                          >
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
                          <Form.Item
                            name="sa"
                            rules={[
                              {
                                required: true,
                                message: "Çalışma saati girin!",
                              },
                            ]}
                          >
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
                          <Form.Item
                            name="su"
                            rules={[
                              {
                                required: true,
                                message: "Çalışma saati girin!",
                              },
                            ]}
                          >
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
              </Form>
            </Spin>
          </Modal>
        </div>
      </div>

      <div>
        <Modal
          className="font-poppins"
          title="Silme İşlemi"
          visible={deleteForm.visible}
          onOk={() => patchIsDeleted(deleteForm.deleteId)}
          onCancel={() => setDeleteForm({ visible: false })}
          okText="Evet"
          cancelText="Hayır"
          width={400}
        >
          <div className="flex flex-col justify-center items-center text-red-500 space-y-3">
            <MdOutlineError size={50} />
            <span>Silmek istediğinize emin misiniz ?</span>
          </div>
        </Modal>

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

        <Table
          locale={{
            emptyText: (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={"İşletme Bulunamadı"}
              />
            ),
            triggerDesc: "Z-A ye Sıralama",
            triggerAsc: "A-Z ye Sıralama",
            cancelSort: "Standart Sıralama",
          }}
          className="text-xs"
          rowKey="id"
          columns={columns}
          dataSource={table.data}
          loading={table.loading}
        />
      </div>
    </div>
  );
};

export default mybusinesses;
