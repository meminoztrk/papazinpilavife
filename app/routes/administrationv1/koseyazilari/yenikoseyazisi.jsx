import React, { useState, useEffect } from 'react'
import { Button, Input, Form, Modal, Switch, Spin, notification, Upload, Select } from "antd";
import { useForm } from 'sunflower-antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLoaderData } from '@remix-run/react';
import { post } from 'axios';
// import { redirect } from '@remix-run/node';
import { useOutletContext } from "react-router-dom";
import CKEditor from './../../../components/CKEditor';
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


const yeniyazi = () => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const [form] = Form.useForm();
  const [data, setData] = useState("");
  const [user] = useOutletContext();
  const { API, API_KEY } = useLoaderData();

  const openNotificationWithIcon = (type) => {
    notification[type]({
      message: 'Bildirim',
      description:
        'Köşe yazısı eklendi.',
    });
  };

  //#region API 

  const postBlog = async (data) => {
    await post(API + '/CBlog/', data, {
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
    setEditorLoaded(true);
  }, []);


  const { formProps, formLoading } = useForm({
    form,
    async submit({ title,content,seoTitle,seoKeywords,seoDescription,isActive }) {
      seoKeywords ? seoKeywords = seoKeywords.join() : seoKeywords = null;
      await new Promise(r => setTimeout(r, 1000));
      const data = {
        title,content, seoTitle, seoKeywords, seoDescription,isActive,userId:user.id
      }
      console.log(data)
      postBlog(data)
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
            label="Yazı Başlığı"
            name="title"
            rules={[{ required: true, message: 'Lütfen yazı başlığı girin!' }]}
          >
            <Input placeholder="Yazı başlığı girin" />
          </Form.Item>


          <Form.Item
            label='İçerik'
            name="content"
          >
            <CKEditor
              endPoint={"Blog/AddImage"}
              name="content"
              onChange={(data) => {
                setData(data);
              }}
              editorLoaded={editorLoaded}
            />
            {/* {JSON.stringify(data)} */}
          </Form.Item>

          <Form.Item
            label="Seo Başlık"
            name="seoTitle"
          >
            <Input placeholder="Seo başlığı girin" />
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

          <Form.Item name="isActive" label="Durum" valuePropName='checked' initialValue>
            <Switch
              checkedChildren="Aktif"
              unCheckedChildren="Pasif"
            />
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

    </div>
  )
}

export default yeniyazi
