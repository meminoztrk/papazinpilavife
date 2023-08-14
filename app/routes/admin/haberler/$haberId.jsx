import React, { useState, useEffect } from 'react'
import { Button, Input, Form, Modal, Switch, Spin, notification, Upload, Select } from "antd";
import { useForm } from 'sunflower-antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { useLoaderData } from '@remix-run/react';
import { put } from 'axios';
import { redirect } from '@remix-run/node';
import { useOutletContext } from "react-router-dom";
import CKEditor from './../../../components/CKEditor';
import { getUser, getJwt } from '../../../hooks/cookie';

const { Option } = Select;


export const loader = async ({ request, params }) => {
    const response = await fetch(process.env.REACT_APP_API +"/Blog/" + params.haberId, {
        headers: {
            'ApiKey': process.env.REACT_APP_API_KEY,
            'Content-Type': 'application/json'
        },
        withCredentials: true,
    });
    const blog = await response.json();

    const jwt = getJwt(request.headers.get("cookie"))
    const user = await getUser(jwt,process.env.REACT_APP_API,process.env.REACT_APP_API_KEY);

    if(!user.isAdmin && user.id != blog.userId){return redirect("/admin/404")}

    const data = {
        API: process.env.REACT_APP_API,
        API_KEY: process.env.REACT_APP_API_KEY,
        API_IMAGES: process.env.REACT_APP_IMAGES,
        blog: blog.data,
        blogId: params.haberId,
    }
    if (blog.data && blog.data.userId) { return data }
    else { return redirect("/admin/404") }
}

const getBase64 = (file) =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = () => resolve(reader.result);

        reader.onerror = (error) => reject(error);
    });


const editHaber = ({ route }) => {
    const [fileList, setFileList] = useState([])
    const [categories, setCategories] = useState([]);
    const [previewVisible, setPreviewVisible] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [form] = Form.useForm();
    const [data, setData] = useState("");
    const [user, origin] = useOutletContext();
    const { API, API_KEY, API_IMAGES, blog, blogId } = useLoaderData();

    const openNotificationWithIcon = (type) => {
        notification[type]({
            message: 'Bildirim',
            description:
                'Güncelleme işlemi başarılı',
        });
    };

    //#region API 
    const getCategories = async () => {
        fetch(API + "/Categories", {
            method: 'GET',
            headers: {
                'ApiKey': API_KEY,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => setCategories(data.data));
    };


    const editBlog = async (data) => {
        const formData = new FormData();
        for (var key in data) {
            formData.append(key, data[key]);
        }
        formData.append('uploadImage', fileList[0] ? fileList[0].originFileObj : null);

        await put(API + '/Blog?id=' + blogId, formData, {
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
        getCategories()
        setFileList([
            {
                uid: '-1',
                name: blog.image,
                status: 'done',
                url: API_IMAGES + "blog/" + blog.image,
            }
        ])
        console.log(blog)
        for (var key in blog) {
            blog[key] === "null" || blog[key] === "undefined" ? blog[key] = null : blog[key]
        }
        form.setFieldsValue({
            title: blog.title, categoryId: blog.categoryId, content: blog.content, isActive: blog.isActive, isHeadline: blog.isHeadline,
            source: blog.source, seoTitle: blog.seoTitle, seoKeywords: blog.seoKeywords ? blog.seoKeywords.split(",") : [], seoDescription: blog.seoDescription
        })
        setEditorLoaded(true);
    }, []);

    //#region Site Image
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
        async submit({ title, isHeadline, categoryId, content, source, seoTitle, seoKeywords, seoDescription, isActive }) {
            seoKeywords ? seoKeywords = seoKeywords.join() : seoKeywords = null;
            await new Promise(r => setTimeout(r, 1000));
            const data = {
                title, isHeadline, categoryId, content, source, seoTitle, seoKeywords, seoDescription, isActive, userId: user.id
            }
            console.log(data)
            editBlog(data)
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
                        label="Haber Başlığı"
                        name="title"
                        rules={[{ required: true, message: 'Lütfen haber başlığı girin!' }]}
                    >
                        <Input placeholder="Haber başlığı girin" />
                    </Form.Item>

                    <Form.Item name="isHeadline" label="Manşet" valuePropName='checked' initialValue>
                        <Switch
                            checkedChildren="Evet"
                            unCheckedChildren="Hayır"
                        />
                    </Form.Item>

                    <Form.Item
                        name="upload"
                        label="Haber Resmi"
                        rules={[{
                            validator: (_, value) =>
                                fileList.length > 0
                                    ? Promise.resolve()
                                    : Promise.reject("Lütfen haber resmi seçin!"),
                        }]}
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
                        label="Kategori"
                        name="categoryId"
                        rules={[{ required: true, message: 'Lütfen kategori seçin!' }]}
                    >
                        <Select
                            showSearch
                            style={{ width: "75%" }}
                            placeholder="Kategori seçiniz"
                            optionFilterProp="children"
                            filterOption={(input, option) => option.children.toLowerCase().includes(input.toLowerCase())}
                        >
                            {categories.map(cat => <Option className='font-poppins' key={cat.id} value={cat.id}>{cat.name}</Option>)}
                        </Select>
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
                        label="Kaynak"
                        name="source"
                    >
                        <Input placeholder="Kaynak girin" />
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

export default editHaber
