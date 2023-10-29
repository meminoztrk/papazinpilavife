import React from "react";
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
  Rate,
} from "antd";
import { useModalForm } from "sunflower-antd";
import Highlighter from "react-highlight-words";
import { useState, useEffect } from "react";
import {
  AiFillEye,
  AiOutlineArrowRight,
  AiOutlineDelete,
} from "react-icons/ai";
import { PlusOutlined, SearchOutlined } from "@ant-design/icons";
import { MdOutlineError } from "react-icons/md";
import { useLoaderData } from "@remix-run/react";
import { post, put } from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import mapgif from "public/googleIframe.gif";
import moment from "moment";
const { TextArea } = Input;
const { Option } = Select;

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

export default function index() {
  const { API, API_KEY, API_IMAGES } = useLoaderData();
  const data = useOutletContext();
  const [table, setTable] = useState({ data: [], loading: false, count: 0 });
  const [deleteForm, setDeleteForm] = useState({ visible: false, deleteId: 0 });
  const [town, setTown] = useState([]);
  const [district, setDistrict] = useState([]);
  const [foodType, setFoodType] = useState(false);
  const [maskBorder, setMaskBorder] = useState(false);
  const [form] = Form.useForm();
  const [images, setImages] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [limage, setLimage] = useState([]);
  const [modal, setModal] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [previewTitle, setPreviewTitle] = useState("");
  const [editId, setEditId] = useState(0);
  const [okButton, setOkButton] = useState(false);

  let navigate = useNavigate();
  const [filterPagination, setFilterPagination] = useState({
    pagination: {
      current: 1,
      pageSize: 10,
    },
    filters: [],
    sorter: {},
  });

  //#region API

  const getUsers = async () => {
    setTable({ loading: true });

    fetch(API + `/Admin/GetUsers`, {
      method: "POST",
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(filterPagination),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setTable({
          loading: false,
          data: data.data.items,
          count: data.data.itemCount,
        });
      });
  };

  const getComment = async (id) => {
    form.resetFields();
    await fetch(API + `/Business/GetCommentById?id=${id}`, {
      method: "GET",
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        setFileList(
          data.data.images.map((x, index) => ({
            uid: index,
            name: x,
            status: "done",
            url: API_IMAGES + "business/" + x,
          }))
        );
        data.data.commentType = splitItem(data.data.commentType);
        form.setFieldsValue(data.data);
        setModal(true);
      });
  };

  const setColumn = async (id, column, value) => {
    await fetch(API + `/Admin/UpdateUserPatch?id=${id}`, {
      method: "PATCH",
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ path: column, value: value }]),
    }).catch(function (err) {
      console.info(err);
    });
  };

  const setDeleted = async (id) => {
    await fetch(API + `/Admin/UpdateUserPatch?id=${id}`, {
      method: "PATCH",
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify([{ path: "isDeleted", value: true }]),
    })
      .then((response) => {
        if (response.ok) {
          setDeleteForm({ visible: false });
          getUsers();
        }
      })
      .catch(function (err) {
        console.info(err);
      });
  };

  //#endregion

  useEffect(() => {
    getUsers();
  }, [filterPagination]);

  //#region Image

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
  const handleSearch = (selectedKeys, dataIndex) => {
    setFilterPagination({
      ...filterPagination,
      filters: [
        ...filterPagination.filters.filter((x) => x.columnName != dataIndex),
        { columnName: dataIndex, columnValue: selectedKeys[0] },
      ],
    });
  };

  const handleReset = (dataIndex) => {
    setFilterPagination({
      ...filterPagination,
      filters: [
        ...filterPagination.filters.filter((x) => x.columnName != dataIndex),
      ],
    });
  };

  const getColumnSearchProps = (dataIndex, placeName) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`${placeName} Ara `}
          value={selectedKeys[0]}
          onChange={(e) =>
            setSelectedKeys(e.target.value ? [e.target.value] : [])
          }
          onPressEnter={(e) => handleSearch(selectedKeys, dataIndex)}
          style={{ marginBottom: 8, display: "block" }}
        />
        <Space>
          <Button
            className="bg-blue-400 text-white"
            onClick={() => handleSearch(selectedKeys, dataIndex)}
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
              handleReset(dataIndex);
              setSelectedKeys([]);
              clearFilters({ closeDropdown: true });
            }}
            size="small"
            style={{ width: 90 }}
          >
            Sıfırla
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered) => (
      <SearchOutlined style={{ color: filtered ? "#1890ff" : undefined }} />
    ),
    render: (text) =>
      filterPagination.filters.some((x) => x.columnName === dataIndex) ? (
        <Highlighter
          highlightStyle={{ backgroundColor: "#ffc069", padding: 0 }}
          searchWords={[
            filterPagination.filters.find((x) => x.columnName === dataIndex)
              .columnValue,
          ]}
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
      dataIndex: "userPhoto",
      key: "userPhoto",
      width: "5%",
      align: "center",
      render: (text, record) => (
        <div className="w-12">
          <img
            src={
              text == null
                ? API_IMAGES + "user/defaultuser.png"
                : API_IMAGES + "user/thumbnail" + text
            }
            alt="..."
            className="w-12 h-12 object-cover  shadow rounded-full align-middle border-none"
          />
        </div>
      ),
    },
    {
      title: "Ad Soyad",
      dataIndex: "fullName",
      key: "fullName",
      sorter: true,
      ...getColumnSearchProps("fullName", "Ad Soyad"),
    },
    {
      title: "E-Posta",
      dataIndex: "email",
      key: "email",
      align: "center",
      sorter: true,
      ...getColumnSearchProps("email", "E-Posta"),
    },
    {
      title: "Telefon",
      dataIndex: "phone",
      key: "phone",
      sorter: true,
      ...getColumnSearchProps("phone", "Telefon"),
    },
    {
      title: "Lokasyon",
      dataIndex: "location",
      key: "location",
      sorter: true,
      ...getColumnSearchProps("location", "Lokasyon"),
    },
    {
      title: "Doğum Tarihi",
      dataIndex: "dateOfBirth",
      key: "dateOfBirth",
      align: "center",
      render: (text, record) =>
        text != null ? moment(text).format("DD/MM/yyyy") : null,
      sorter: true,
    },
    {
      title: "Oluşturma Tarihi",
      dataIndex: "created",
      key: "created",
      align: "center",
      render: (text, record) => moment(text).format("DD/MM/yyyy hh:mm"),
      sorter: true,
    },
    {
      title: "Admin",
      dataIndex: "isAdmin",
      key: "isAdmin",
      align: "center",
      sorter: true,
      render: (text, record) => (
        <Switch
          {...(record.isAdmin
            ? { defaultChecked: true }
            : { defaultChecked: false })}
          onChange={(e) => setColumn(record.id, "isAdmin", e)}
          checkedChildren="Aktif"
          unCheckedChildren="Pasif"
        />
      ),
    },
    {
      title: "Kullanıcı",
      dataIndex: "isUser",
      key: "isUser",
      align: "center",
      sorter: true,
      render: (text, record) => (
        <Switch
          {...(record.isUser
            ? { defaultChecked: true }
            : { defaultChecked: false })}
          onChange={(e) => setColumn(record.id, "isUser", e)}
          checkedChildren="Aktif"
          unCheckedChildren="Pasif"
        />
      ),
    },
    {
      title: "Google",
      dataIndex: "isGoogle",
      key: "isGoogle",
      align: "center",
      sorter: true,
      render: (text, record) => (
        <Switch
          {...(record.isGoogle
            ? { defaultChecked: true }
            : { defaultChecked: false })}
          onChange={(e) => setColumn(record.id, "isGoogle", e)}
          checkedChildren="Aktif"
          unCheckedChildren="Pasif"
        />
      ),
    },
    {
      title: "İşletme",
      dataIndex: "isBusiness",
      key: "isBusiness",
      align: "center",
      sorter: true,
      render: (text, record) => (
        <Switch
          {...(record.isBusiness
            ? { defaultChecked: true }
            : { defaultChecked: false })}
          onChange={(e) => setColumn(record.id, "isBusiness", e)}
          checkedChildren="Aktif"
          unCheckedChildren="Pasif"
        />
      ),
    },
    {
      title: "Aktif",
      dataIndex: "isActive",
      key: "isActive",
      align: "center",
      sorter: true,
      render: (text, record) => (
        <Switch
          {...(record.isActive
            ? { defaultChecked: true }
            : { defaultChecked: false })}
          onChange={(e) => setColumn(record.id, "isActive", e)}
          checkedChildren="Aktif"
          unCheckedChildren="Pasif"
        />
      ),
    },
    {
      title: "İşlem",
      dataIndex: "edit",
      key: "edit",
      width: "105px",
      render: (text, record) => (
        <div className="space-x-2">
          {/* <Button
            className="rounded-md p-2 hover:text-orange-500 hover:border-orange-500"
            onClick={() => getComment(record.id)}
          >
            <AiFillEye />
          </Button> */}
          {!record.isBusiness && record.isUser && (
            <Button className="rounded-md p-2 hover:text-orange-500 hover:border-orange-500">
              <a
                href={`/profile?userid=${record.guidId}`}
                className="transition-none"
                target="blank"
              >
                <AiOutlineArrowRight />
              </a>
            </Button>
          )}

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
    if (!time) {
      return null;
    }
    return time.length > 0
      ? moment(time[0]).format("HH:mm") +
          " - " +
          moment(time[1]).format("HH:mm")
      : "";
  };

  const splitItem = (text) => {
    return text != null ? text.split(",,") : [];
  };

  const handleTableChange = (pagination, filters, sorter) => {
    const sorted = sorter.column
      ? { field: sorter.field, order: sorter.order }
      : {};

    setFilterPagination({
      pagination: {
        current: pagination.current,
        pageSize: pagination.pageSize,
      },
      filters: [...filterPagination.filters],
      sorter: sorted,
    });
  };

  return (
    <div>
      <Modal
        className="font-poppins"
        title="Silme İşlemi"
        visible={deleteForm.visible}
        onOk={() => setDeleted(deleteForm.deleteId)}
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
        visible={modal}
        title={"Yorum İncele"}
        footer={null}
        onCancel={() => setModal(false)}
      >
        <Form
          name="basic"
          form={form}
          labelCol={{
            span: 4,
          }}
          wrapperCol={{
            span: 20,
          }}
        >
          {fileList.length > 0 && (
            <Form.Item name="upload" label="Görseller" valuePropName="file">
              <Upload
                name="imagesOfBusiness"
                className="preview"
                beforeUpload={() => false}
                showUploadList
                onPreview={handleImagePreview}
                fileList={fileList}
                accept="image/png, image/jpeg"
                listType="picture-card"
              ></Upload>
            </Form.Item>
          )}
          <Form.Item name="rate" label="Puan">
            <Rate
              disabled
              className="text-[15px] text-red-500 font-bold bg-white rounded-lg"
            />
          </Form.Item>
          <Form.Item name="commentType" label="Yorum Tipi">
            <Select
              mode="multiple"
              disabled
              className="shadow text-gray-700 leading-tight"
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
          <Form.Item name="comment" label="Yorum">
            <TextArea
              rows={10}
              disabled
              maxLength={500}
              className="relative shadow z-0 appearance-none border rounded-[2px] w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            />
          </Form.Item>
        </Form>
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
              description={"Veri Bulunamadı"}
            />
          ),
          triggerDesc: "Z-A ye Sıralama",
          triggerAsc: "A-Z ye Sıralama",
          cancelSort: "Standart Sıralama",
        }}
        onChange={handleTableChange}
        rowKey="id"
        pagination={{
          total: table.count,
          defaultPageSize: 10,
          showSizeChanger: true,
          pageSizeOptions: ["10", "25", "50"],
        }}
        columns={columns}
        dataSource={table.data}
        loading={table.loading}
        key={1}
      />
    </div>
  );
}
