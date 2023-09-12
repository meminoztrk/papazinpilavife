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
} from "antd";
import {
  CalendarOutlined,
  UserOutlined,
  ProfileOutlined,
  HomeOutlined,
  PlusOutlined,
  DeleteOutlined,
  FacebookOutlined,
  TwitterOutlined,
  InstagramOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { AiOutlinePlus, AiFillEdit, AiOutlineShop } from "react-icons/ai";
import { BsPinMap } from "react-icons/bs";
import { MdOutlineError } from "react-icons/md";
import { useLoaderData } from "@remix-run/react";
import Province from "~/data/Province.json";
import { post, put } from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
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
  const [town, setTown] = useState([]);
  const [district, setDistrict] = useState([]);
  const [foodType, setFoodType] = useState(false);
  const [table, setTable] = useState({ data: [], loading: false });
  const [search, setSearch] = useState({ searchText: "", searchedColumn: "" });
  const [deleteForm, setDeleteForm] = useState({ visible: false, deleteId: 0 });
  const { API, API_KEY, API_IMAGES } = useLoaderData();
  const [form] = Form.useForm();
  const [fileList, setFileList] = useState([]);
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

  //#region Image User

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
      title: "Resim",
      dataIndex: "title",
      key: "title",
      className: "font-medium",
    },
    {
      title: "İşletme Adı",
      dataIndex: "title",
      key: "title",
      className: "font-medium",
      sorter: (a, b) => compareByAlph(a.title, b.title),
      ...getColumnSearchProps("title", "Başlık"),
    },
    {
      title: "İşletme Tipi",
      dataIndex: "categoryName",
      key: "categoryName",
      sorter: (a, b) => compareByAlph(a.categoryName, b.categoryName),
      ...getColumnSearchProps("categoryName", "Kategori"),
    },
    {
      title: "Lokasyon",
      dataIndex: "title",
      key: "title",
      className: "font-medium",
      sorter: (a, b) => compareByAlph(a.title, b.title),
      ...getColumnSearchProps("title", "Başlık"),
    },
    {
      title: "Onay",
      dataIndex: "title",
      key: "title",
      className: "font-medium",
      sorter: (a, b) => compareByAlph(a.title, b.title),
    },
    {
      title: "Görüntülenme",
      dataIndex: "views",
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
          onChange={(e) => setActive(record.id, e)}
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
        <div className="space-x-2">
          <Button
            className="rounded-md p-2 hover:text-orange-500 hover:border-orange-500"
            onClick={() => navigate(`/admin/haberler/${record.id}`)}
          >
            <AiFillEdit />
          </Button>
          {/* <Button className='rounded-md p-2 hover:text-red-500 hover:border-red-500' onClick={() => setDeleteForm({ visible: true, deleteId: record.id })} >
            <AiOutlineDelete />
          </Button> */}
        </div>
      ),
    },
  ];

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

  useEffect(() => {
    show();
  }, []);

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-lg font-semibold">İşletmelerim</h1>
        <div>
          <button
            className="bg-red-500 rounded-md hover:bg-red-700 text-white p-2 flex items-center space-x-1"
            onClick={() => {
              show();
              form.resetFields();
            }}
            type="primary"
          >
            <span>İşletme Ekle</span>
            <AiOutlinePlus size={18} />
          </button>
          <Modal
            {...modalProps}
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
                      İşletme Ekle
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
                autoComplete="off"
              >
                <div>
                  <h2 className="font-medium my-1">İşletme Fotoğrafları</h2>
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
                      {fileList.length > 9 ? null : uploadButton}
                    </Upload>
                  </Form.Item>
                </div>

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
                            message: "Lütfen adınızı girin!",
                          },
                          {
                            min: 2,
                            message: "Adınız minimum 2 karakter olmalı!",
                          },
                        ]}
                      >
                        <Select
                          className="shadow z-60   text-gray-700 leading-tight"
                          placeholder="İşletme türünüzü seçin"
                          getPopupContainer={trigger => trigger.parentNode}
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

                <div className="flex items-center gap-x-4">
                  <div className="w-full">
                    <h2 className="font-medium my-1">
                      İşletme Adı (<span className="text-red-500">*</span>)
                    </h2>
                    <Form.Item className="mb-0">
                      <AiOutlineShop
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
                  </div>
                  <div className="w-full">
                    <h2 className="font-medium my-1">
                      İşletme Kısa Açıklama (
                      <span className="text-red-500">*</span>)
                    </h2>
                    <Form.Item className="mb-0">
                      <AiOutlineShop
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
                  </div>
                </div>

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
                          getPopupContainer={trigger => trigger.parentNode}
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
                          getPopupContainer={trigger => trigger.parentNode}
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
                          getPopupContainer={trigger => trigger.parentNode}
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
                      name="Adress"
                      rules={[
                        {
                          required: true,
                          message: "Lütfen adres girin!",
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
                <hr className="my-4"></hr>
                <div>
                  <h2 className="text-base font-medium mb-4">
                    <span className="underline">İşletme Hakkında</span>{" "}
                    <span className="text-xs font-light">
                      (Kullanıcıların sizi daha kolay arayıp bulması için
                      doldurun. Birden fazla özellik girebilirsiniz)
                    </span>
                  </h2>
                  <div
                    className={`w-full tagsInput ${
                      foodType ? "block" : "hidden"
                    }`}
                  >
                    <h2 className="font-medium my-1">Yemek Çeşitleri</h2>
                    <Form.Item className="mb-0">
                      <Form.Item name="businessProp">
                        <Select
                          mode="tags"
                          open={false}
                          className="shadow z-0 text-gray-700 leading-tight"
                          placeholder="Yemek çeşitlerinizi girin (çorba, döner, pizza vs.)"
                        ></Select>
                      </Form.Item>
                    </Form.Item>
                  </div>

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

                  <div className="w-full tagsInput">
                    <h2 className="font-medium my-1">
                      İşletme İçeriği{" "}
                      <span className="text-xs font-light">
                        (Kullanıcıların işletmenizi hangi başlık altında yorumlayacağını belirtir.)
                      </span>
                    </h2>
                    <Form.Item className="mb-0">
                      <Form.Item name="commentType">
                        <Select
                          mode="multiple"
                          getPopupContainer={trigger => trigger.parentNode}
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
                </div>
                <hr className="mb-4"></hr>
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
          // onOk={() => setDeleted(deleteForm.deleteId)}
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
          rowKey="id"
          columns={columns}
          // dataSource={table.data}
          // loading={table.loading}
        />
      </div>
    </div>
  );
};

export default mybusinesses;
