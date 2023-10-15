import React, { useState, useEffect } from 'react'
import { Button, Input, Form, Modal, Spin, notification, Upload, Select } from "antd";
import { useForm } from 'sunflower-antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLoaderData } from '@remix-run/react';
import { post, put } from 'axios';
// import { redirect } from '@remix-run/node';
import { useOutletContext } from "react-router-dom";
import CKEditor from './../../components/CKEditor';
const { Option } = Select;


export const loader = async ({ request }) => {
  const data = {
    API: process.env.REACT_APP_API,
    API_KEY: process.env.REACT_APP_API_KEY,
    API_IMAGES: process.env.REACT_APP_IMAGES
  }
  return data
}

const getBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);

    reader.onload = () => resolve(reader.result);

    reader.onerror = (error) => reject(error);
  });


const kimlik = () => {
  const [fileList, setFileList] = useState([])
  const [previewVisible, setPreviewVisible] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [previewTitle, setPreviewTitle] = useState('');
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState("");
  const { API, API_KEY, API_IMAGES } = useLoaderData();

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: 'Bildirim',
      description:
        'Güncelleme işlemi başarılı',
    });
  };

  //#region API 
  const getAbout = async (id) => {
    await fetch(API + "/About/", {
      method: 'GET',
      headers: {
        'ApiKey': API_KEY,
        'Content-Type': 'application/json'
      }
    })
      .then(res => res.json())
      .then(data => {
        const about = data.data;   
        for (var key in about) {
          about[key] === "null" ? about[key] = null : about[key]
        }
        about.logo != null && setFileList([
          {
            uid: '-1',
            name: about.logo,
            status: 'done',
            url: API_IMAGES + "about/" + about.logo,
          }
        ])
        form.setFieldsValue({
          name: about.name, mail: about.mail,
          phone: about.phone, regard: about.regard === "undefined" ? "" : about.regard,
          facebook: about.facebook, twitter: about.twitter,
          instagram: about.instagram, youtube: about.youtube,
          seoKeywords: about.seoKeywords ? about.seoKeywords.split(",") : [],
          seoDescription: about.seoDescription
        })
        openNotificationWithIcon
      })
  }

  const editAbout = async (data) => {
    const formData = new FormData();
    for (var key in data) {
      formData.append(key, data[key]);
    }
    formData.append('uploadImage', fileList[0] ? fileList[0].originFileObj : null);

    await put(API + '/About/', formData, {
      headers: {
        'ApiKey': API_KEY,
        'Content-Type': 'application/json'
      }
    })
      .then(resp => openNotificationWithIcon("success"))
      .catch(function (error) {
        console.log(error);
      });
  }
  //#endregion

  useEffect(() => {
    getAbout()
    setEditorLoaded(true);
  }, []);

  //#region Site Image
  useEffect(() => {
    console.log(fileList)
  }, [fileList])

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

  const { formProps, formLoading } = useForm({
    form,
    async submit({ name,phone,mail,regard,facebook,twitter,instagram,youtube,seoKeywords,seoDescription }) {
      seoKeywords ? seoKeywords = seoKeywords.join() : seoKeywords = null;
      await new Promise(r => setTimeout(r, 1000));
      const data = {
        name,phone,mail,regard,facebook,twitter,instagram,youtube,seoKeywords,seoDescription
      }
      editAbout(data)
      return 'ok';
    },
  });

  return (
    <div>
      <Spin spinning={formLoading}>
        <Form
          {...formProps}
          labelCol={{ span: 3 }}
          wrapperCol={{ span: 16 }}
          // className="space-y-3"
          autoComplete="off"
        >
          <Form.Item
            name="upload"
            label="Logo"
            valuePropName="file">
            <Upload
              name="logo"
              beforeUpload={() => false}
              onPreview={handleImagePreview}
              onChange={handleImageChange}
              fileList={fileList}
              accept='image/png, image/jpeg, image/svg'
              listType="picture-card">
              {fileList.length > 0 ? null : uploadButton}
            </Upload>
          </Form.Item>

          <Form.Item
            label="Marka Adı"
            name="name"
            rules={[{ required: true, message: 'Lütfen marka adı girin!' }]}
          >
            <Input placeholder="Marka adı girin" />
          </Form.Item>

          <Form.Item
            label="Telefon"
            name="phone"
            rules={[{ required: true, message: 'Lütfen iletişim numarası girin!' }]}
          >
            <Input placeholder="İletişim numarası girin" />
          </Form.Item>

          <Form.Item
            label="E-Posta"
            name="mail"
            rules={[{ required: true, message: 'Lütfen e-posta girin!' }]}
          >
            <Input placeholder="E-Posta adresi girin" />
          </Form.Item>

          <Form.Item
            label='Hakkımızda'
            name="regard"
          >
            <CKEditor
              endPoint={"About/AddImage"}
              name="regard"
              onChange={(data) => {
                setData(data);
              }}
              editorLoaded={editorLoaded}
            />
            {/* {JSON.stringify(data)} */}
          </Form.Item>

          <Form.Item
            label="Facebook"
            name="facebook"
          >
            <Input placeholder="Facebook adresi girin" />
          </Form.Item>
          <Form.Item
            label="Instagram"
            name="instagram"
          >
            <Input placeholder="Instagram adresi girin" />
          </Form.Item>
          <Form.Item
            label="Twitter"
            name="twitter"
          >
            <Input placeholder="Twitter adresi girin" />
          </Form.Item>
          <Form.Item
            label="Youtube"
            name="youtube"
          >
            <Input placeholder="Youtube adresi girin" />
          </Form.Item>

          <Form.Item
            label="Seo Kelimeler"
            name="seoKeywords"
          >
            <Select
              mode="tags"
              style={{ width: '100%' }}
              open={false}
              placeholder="Seo anahtar kelimeleri girin" 
            >
            </Select>
          </Form.Item>

          <Form.Item
            label="Seo Açıklama"
            name="seoDescription"
          >
            <Input placeholder="Seo açıklaması girin" />
          </Form.Item>

          




          <Form.Item
            wrapperCol={{
              offset: 3,
              span: 16,
            }}
          >
            <Button type="primary" htmlType="submit">
              Kaydet
            </Button>
          </Form.Item>
        </Form>

      </Spin>

      <Modal visible={previewVisible} title={previewTitle} footer={null} onCancel={handleCancel}>
        <img
          alt="example"
          style={{
            width: '100%',
          }}
          src={previewImage}
        />
      </Modal>
    </div>
  )
}

export default kimlik
