import React from 'react'
import { Button, Input, Table, Space, Modal, Form, Switch, Spin, Empty, Upload, Select } from "antd";
import { useModalForm } from 'sunflower-antd';
import Highlighter from 'react-highlight-words';
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { AiOutlinePlus, AiFillEdit, AiOutlineDelete } from 'react-icons/ai';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { MdOutlineError } from 'react-icons/md';
import { useLoaderData } from '@remix-run/react';
import { post, put } from 'axios';
// import { redirect } from '@remix-run/node';
import { useOutletContext } from "react-router-dom";



const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });

function compareByAlph(a, b) {
  if (a > b) {
    return -1;
  }
  if (a < b) {
    return 1;
  }
  return 0;
}


export const loader = async ({ request }) => {
  const data = {
    API: process.env.REACT_APP_API,
    API_KEY: process.env.REACT_APP_API_KEY,
    API_IMAGES: process.env.REACT_APP_IMAGES
  }
  return data
}

export default function Writers() {
  const [fileList, setFileList] = useState([])
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [table, setTable] = useState({ data: [], loading: false })
  const [search, setSearch] = useState({ searchText: '', searchedColumn: '' })
  const [deleteForm, setDeleteForm] = useState({ visible: false, deleteId: 0 })
  const [ispost, setIsPost] = useState(true)
  const [editId, setEditId] = useState(0)
  const { API, API_KEY, API_IMAGES } = useLoaderData();
  const { Option } = Select;

  const [data,origin] = useOutletContext();

  //#region API 
  const getUser = async (id) => {
    form.resetFields();
    setIsPost(false)
    await fetch(API + "/User/" + id, {
      method: 'GET',
      headers: {
        'ApiKey': API_KEY,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        const user = data.data;
        setFileList([
          {
            uid: '-1',
            name: user.image,
            status: 'done',
            url: API_IMAGES + "user/" + user.image,
          }
        ])
        setEditId(data.data.id)
        form.setFieldsValue({
          name: user.name,
          surname: user.surname,
          username: user.username,
          phone: user.phone,
          email: user.email,
          password: "*********",
          isAdmin: user.isAdmin,
          isActive: user.isActive
        })
        show();
      })
  }
  const getUsers = async () => {
    setTable({ loading: true });
    setTimeout(() => {
      fetch(API + "/User", {
        method: 'GET',
        headers: {
          'ApiKey': API_KEY,
          'Content-Type': 'application/json'
        }
      })
        .then(res => res.json())
        .then(data => {
          // console.log(data)
          setTable({
            loading: false,
            data: data.data,
          });
        });
    }, 200);
  }
  const setActive = async (id, isActive) => {
    await fetch(API + `/User/${id}`, {
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
  const setDeleted = async (id) => {
    await fetch(API + `/User/${id}`, {
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
          getUsers();
        }
      })
      .catch(function (err) {
        console.info(err);
      });
  }
  const postUser = async (userdata) => {
    const formData = new FormData();
    for (var key in userdata) {
      formData.append(key, userdata[key]);
    }
    formData.append('userImage', fileList[0] ? fileList[0].originFileObj : null);

    await post(API + '/User/register', formData, {
      headers: {
        'ApiKey': API_KEY,
        'Content-Type': 'application/json'
      }
    })
      .then(resp => getUsers())
      .catch(function (error) {
        console.log(error);
      });
  }
  const editUser = async (userdata) => {
    const formData = new FormData();
    for (var key in userdata) {
      formData.append(key, userdata[key]);
    }
    formData.append('userImage', fileList[0] ? fileList[0].originFileObj : null);

    await put(API + '/User/' + editId, formData, {
      headers: {
        'ApiKey': API_KEY,
        'Content-Type': 'application/json'
      }
    })
      .then(resp => getUsers())
      .catch(function (error) {
        console.log(error);
      });
  }
  //#endregion

  useEffect(() => {
    getUsers()
    console.log(data,origin)
  }, [])

  //#region Table Search
  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearch({
      searchText: selectedKeys[0],
      searchedColumn: dataIndex,
    });
  };

  const handleReset = clearFilters => {
    clearFilters();
    setSearch({ searchText: '' });
  };

  const getColumnSearchProps = (dataIndex, placeName) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          placeholder={`${placeName} Ara `}
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={(e) => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            className='bg-blue-400 text-white'
            onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
            size="small"
            style={{ width: 90 }}
          >
            <div className='flex items-center justify-center space-x-2'>
              <span>Ara</span>
              <SearchOutlined />
            </div>

          </Button>
          <Button onClick={() => { handleReset(clearFilters); confirm({ closeDropdown: false }) }} size="small" style={{ width: 90 }}>
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
    filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex]
        ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
    render: text =>
      search.searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[search.searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });
  //#endregion 

  const columns = [
    {
      title: '',
      dataIndex: 'image',
      key: 'image',
      width: '5%',
      align: 'center',
      render: (text, record) => (
        <div className="w-12">
          <img src={API_IMAGES + "user/" + text} alt="..." className="w-12 h-12 object-cover  shadow rounded-full align-middle border-none" />
        </div>

      )
    },
    {
      title: 'Kullanıcı Adı',
      dataIndex: 'username',
      key: 'username',
      sorter: (a, b) => compareByAlph(a.username, b.username),
      ...getColumnSearchProps('username', 'Kullanıcı Adı'),
    },
    {
      title: 'Şifre',
      dataIndex: '',
      key: '',
      render: () => (
        <span>***********</span>
      )
    },
    {
      title: 'Ad',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => compareByAlph(a.name, b.name),
      ...getColumnSearchProps('name', 'Ad'),
    },
    {
      title: 'Soyad',
      dataIndex: 'surname',
      key: 'surname',
      sorter: (a, b) => compareByAlph(a.surname, b.surname),
      ...getColumnSearchProps('surname', 'Soyad'),
    },
    {
      title: 'E-Posta',
      dataIndex: 'email',
      key: 'email',
      sorter: (a, b) => compareByAlph(a.email, b.email),
      ...getColumnSearchProps('email', 'E-Posta'),
    },
    {
      title: 'Telefon',
      dataIndex: 'phone',
      key: 'phone',
      sorter: (a, b) => compareByAlph(a.phone, b.phone),
      ...getColumnSearchProps('phone', 'Telefon'),
    },
    {
      title: 'Rol',
      dataIndex: 'isAdmin',
      key: 'isAdmin',
      sorter: (a, b) => compareByAlph(a.isAdmin, b.isAdmin),
      align: 'center',
      render: (text, record) => (
        <span>{text ? "Admin" : "Yazar"}</span>
      )
    },
    {
      title: 'Aktif',
      dataIndex: 'isActive',
      key: 'isActive',
      align: 'center',
      render: (text, record) => (
        <Switch
          {...record.isActive ? { 'defaultChecked': true } : { 'defaultChecked': false }}
          onChange={(e) => setActive(record.id, e)}
          checkedChildren="Aktif"
          unCheckedChildren="Pasif"
        />
      )
    },
    {
      title: 'İşlem',
      dataIndex: 'address',
      key: 'address',
      render: (text, record) => (
        <div className='space-x-2'>
          <Button className='rounded-md p-2 hover:text-orange-500 hover:border-orange-500' onClick={() => getUser(record.id)} >
            <AiFillEdit />
          </Button>
          <Button className='rounded-md p-2 hover:text-red-500 hover:border-red-500' onClick={() => setDeleteForm({ visible: true, deleteId: record.id })} >
            <AiOutlineDelete />
          </Button>
        </div>


      )
    },
  ];

  //#region Image User
  useEffect(() => {
    console.log(fileList)
  }, [fileList])

  const getUserImage = async (path) => {

    const response = await fetch(API + "/User/GetImage?path=" + path, {
      headers: {
        'ApiKey': API_KEY,
        'Content-Type': 'application/json'
      }
    });
    const blob = await response.blob();
    const file = new File([blob], path, { type: blob.type });

  }


  const handleCancel = () => setPreviewVisible(false);

  const handleImagePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj);
    }

    setPreviewImage(file.url || file.preview);
    setPreviewVisible(true);
    setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
  };

  const handleImageChange = ({ fileList: newFileList }) => setFileList(newFileList);
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

  const [form] = Form.useForm();

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
    async submit({ name, surname, phone, email, username, password, isActive, isAdmin }) {
      console.log('submit');
      await new Promise(r => setTimeout(r, 1000));
      const userdata = {
        name,
        surname,
        phone,
        email,
        username,
        password,
        isActive,
        isAdmin
      }
      ispost ? postUser(userdata) : editUser(userdata);
      return 'ok';
    },
    form,
  });

  return (
    <div>
      <div className='flex items-center mb-4 space-x-4'>
        <button className='bg-blue-500 rounded-md hover:bg-blue-700 text-white p-2' onClick={() => { show(); form.resetFields(); setIsPost(true); setFileList([]) }} type='primary'><AiOutlinePlus size={20} /></button>
      </div>

      <Modal {...modalProps} forceRender getContainer={false} cancelText="İptal" okText="Kaydet" title={ispost ? "Kullanıcı Ekle" : "Kullanıcı Düzenle"} centered >
        <Spin spinning={formLoading}>
          <Form
            {...formProps}
            labelCol={{ span: 8 }}
            wrapperCol={{ span: 16 }}
            // className="space-y-3"
            autoComplete="off"
          >
            <Form.Item
              name="upload"
              label="Profil"
              valuePropName="file">
              <Upload
                name="logo"
                beforeUpload={() => false}
                onPreview={handleImagePreview}
                onChange={handleImageChange}
                fileList={fileList}
                accept='image/png, image/jpeg'
                listType="picture-card">
                {fileList.length > 0 ? null : uploadButton}
              </Upload>
            </Form.Item>
            <Form.Item
              label="Ad"
              name="name"
              rules={[{ required: true, message: 'Lütfen ad girin!' }]}
            >
              <Input placeholder="Ad girin" />
            </Form.Item>
            <Form.Item
              label="Soyad"
              name="surname"
              rules={[{ required: true, message: 'Lütfen soyad girin!' }]}
            >
              <Input placeholder="Soyad girin" />
            </Form.Item>
            <Form.Item
              label="Kullanıcı Adı"
              name="username"
              rules={[{ required: true, message: 'Lütfen kulalnıcı girin!' }]}
            >
              <Input placeholder="Kullanıcı adı girin" />
            </Form.Item>
            <Form.Item
              label="Şifre"
              name="password"
              rules={[{ required: true, message: 'Lütfen telefon girin!' }]}
            >
              <Input.Password placeholder="Şifre girin" />
            </Form.Item>
            <Form.Item
              label="E-Posta"
              name="email"
              rules={[{ required: true, message: 'Lütfen e-posta girin!' }]}
            >
              <Input placeholder="E-posta girin" />
            </Form.Item>
            <Form.Item
              label="Telefon"
              name="phone"
              rules={[{ required: true, message: 'Lütfen telefon girin!' }]}
            >
              <Input placeholder="Telefon girin" />
            </Form.Item>
            <Form.Item
              label="Rol"
              name="isAdmin"
              rules={[{ required: true, message: 'Lütfen rol seçin!' }]}
            >
              <Select
                // showSearch
                className='w-48'
                placeholder="Rol seçin"
                optionFilterProp="children"
              // filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
              >
                <Option className='font-poppins' value={true}>Admin</Option>
                <Option value={false}>Yazar</Option>
              </Select>
            </Form.Item>
            <Form.Item name="isActive" label="Aktif" valuePropName='checked' initialValue>
              <Switch
                checkedChildren="Aktif"
                unCheckedChildren="Pasif"
              />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>

      <Modal
        className='font-poppins'
        title='Silme İşlemi'
        visible={deleteForm.visible}
        onOk={() => setDeleted(deleteForm.deleteId)}
        onCancel={() => setDeleteForm({ visible: false })}
        okText="Evet"
        cancelText="Hayır"
        width={400}
      >
        <div className='flex flex-col justify-center items-center text-red-500 space-y-3'>
          <MdOutlineError size={50} />
          <span>Silmek istediğinize emin misiniz ?</span>
        </div>

      </Modal>

      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>

      <Table
        locale={{
          emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={"Veri Bulunamadı"} />,
          triggerDesc: 'Z-A ye Sıralama',
          triggerAsc: 'A-Z ye Sıralama',
          cancelSort: 'Standart Sıralama'
        }}
        rowKey="id"
        columns={columns}
        dataSource={table.data}
        loading={table.loading}
      />
    </div>
  );
}