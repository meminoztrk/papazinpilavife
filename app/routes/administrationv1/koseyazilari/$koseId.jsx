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
    const response = await fetch(process.env.REACT_APP_API + "/CBlog/" + params.koseId, {
        headers: {
            'ApiKey': process.env.REACT_APP_API_KEY,
            'Content-Type': 'application/json'
        },
        withCredentials: true,
    });
    const blog = await response.json();
    console.log(blog)
    const jwt = getJwt(request.headers.get("cookie"))
    const user = await getUser(jwt,process.env.REACT_APP_API,process.env.REACT_APP_API_KEY);

    if (!user.isAdmin && user.id != blog.userId) { return redirect("/admin/404") }

    const data = {
        API: process.env.REACT_APP_API,
        API_KEY: process.env.REACT_APP_API_KEY,
        API_IMAGES: process.env.REACT_APP_IMAGES,
        blog: blog.data,
        blogId: params.haberId,
    }
    if (blog.data && blog.data.title) { return data } else { return redirect("/admin/404") }
}

const editKose = () => {
    const [editorLoaded, setEditorLoaded] = useState(false);
    const [form] = Form.useForm();
    const [data, setData] = useState("");
    const [user] = useOutletContext();
    const { API, API_KEY, API_IMAGES, blog, blogId } = useLoaderData();

    const openNotificationWithIcon = (type) => {
        notification[type]({
            message: 'Bildirim',
            description:
                'Güncelleme işlemi başarılı',
        });
    };

    //#region API 

    const editBlog = async (data) => {
        await put(API + '/CBlog?id=' + blogId, data, {
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
        for (var key in blog) {
            blog[key] === "null" ? blog[key] = null : blog[key]
        }
        form.setFieldsValue({
            title: blog.title, content: blog.content, isActive: blog.isActive,
            seoTitle: blog.seoTitle, seoKeywords: blog.seoKeywords ? blog.seoKeywords.split(",") : [], seoDescription: blog.seoDescription
        })
        setEditorLoaded(true);
    }, []);

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
        async submit({ title, content, seoTitle, seoKeywords, seoDescription, isActive }) {
            seoKeywords ? seoKeywords = seoKeywords.join() : seoKeywords = null;
            await new Promise(r => setTimeout(r, 1000));
            const data = {
                title, content, seoTitle, seoKeywords, seoDescription, isActive, userId: user.id
            }
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

export default editKose
