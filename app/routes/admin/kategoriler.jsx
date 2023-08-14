import React from 'react'
import { Button, Input, Table, Space, Modal, Form, Switch, Spin, Empty, Upload, Select } from "antd";
import { useModalForm } from 'sunflower-antd';
import Highlighter from 'react-highlight-words';
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import { AiOutlinePlus, AiFillEdit, AiOutlineDelete } from 'react-icons/ai';
import { MdOutlineError } from 'react-icons/md';
import { useLoaderData } from '@remix-run/react';
import { post, put } from 'axios';
// import { redirect } from '@remix-run/node';
import { useOutletContext } from "react-router-dom";



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
    const [table, setTable] = useState({ data: [], loading: false })
    const [search, setSearch] = useState({ searchText: '', searchedColumn: '' })
    const [deleteForm, setDeleteForm] = useState({ visible: false, deleteId: 0 })
    const [ispost, setIsPost] = useState(true)
    const [editId, setEditId] = useState(0)
    const { API, API_KEY } = useLoaderData();
    const { Option } = Select;

    const [data, origin] = useOutletContext();

    //#region API 
    const getCategory = async (id) => {
        form.resetFields();
        setIsPost(false)
        await fetch(API + "/Categories/" + id, {
            method: 'GET',
            headers: {
                'ApiKey': API_KEY,
                'Content-Type': 'application/json'
            }
        })
            .then(res => res.json())
            .then(data => {
                const user = data.data;
                setEditId(data.data.id)
                form.setFieldsValue({
                    name: user.name,
                    isActive: user.isActive
                })
                show();
            })
    }
    const getCategories = async () => {
        setTable({ loading: true });
        setTimeout(() => {
            fetch(API + "/Categories", {
                method: 'GET',
                headers: {
                    'ApiKey': API_KEY,
                    'Content-Type': 'application/json'
                }
            })
                .then(res => res.json())
                .then(data => {
                    setTable({
                        loading: false,
                        data: data.data,
                    });
                });
        }, 200);
    }
    const setActive = async (id, isActive) => {
        await fetch(API + `/Categories/${id}`, {
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
        await fetch(API + `/Categories/${id}`, {
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
                    getCategories();
                }
            })
            .catch(function (err) {
                console.info(err);
            });
    }
    const postCategory = async (userdata) => {
        await fetch(API + `/Categories/`, {
            method: 'POST',
            headers: {
                'ApiKey': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: userdata.name, isActive: userdata.isActive })
        }).then(response => {
            response.ok && getCategories()
        }).catch(function (err) {
            console.info(err);
        });
    }
    const editCategory = async (userdata) => {
        await fetch(API + `/Categories/${editId}`, {
            method: 'PATCH',
            headers: {
                'ApiKey': API_KEY,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify([
                { path: "name", value: userdata.name },
                { path: "isActive", value: userdata.isActive }
            ])
        }).then(response => {
            response.ok && getCategories()
        }).catch(function (err) {
            console.info(err);
        });
    }
    //#endregion

    useEffect(() => {
        getCategories()
        console.log(data, origin)
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
            title: 'Kategori Adı',
            dataIndex: 'name',
            key: 'name',
            width: '20%',
            sorter: (a, b) => compareByAlph(a.name, b.name),
            ...getColumnSearchProps('name', 'Kategori Adı'),
        },
        {
            title: 'Aktif',
            dataIndex: 'isActive',
            key: 'isActive',
            width: '20%',
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
                    <Button className='rounded-md p-2 hover:text-orange-500 hover:border-orange-500' onClick={() => getCategory(record.id)} >
                        <AiFillEdit />
                    </Button>
                    {!record.disable &&
                        <Button className='rounded-md p-2 hover:text-red-500 hover:border-red-500' onClick={() => setDeleteForm({ visible: true, deleteId: record.id })} >
                            <AiOutlineDelete />
                        </Button>}

                </div>


            )
        },
    ];

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
        async submit({ name, isActive }) {
            console.log('submit');
            await new Promise(r => setTimeout(r, 1000));
            const userdata = {
                name,
                isActive
            }
            ispost ? postCategory(userdata) : editCategory(userdata);
            return 'ok';
        },
        form,
    });

    return (
        <div>
            <div className='flex items-center mb-4 space-x-4'>
                <button className='bg-blue-500 rounded-md hover:bg-blue-700 text-white p-2' onClick={() => { show(); form.resetFields(); setIsPost(true); }} type='primary'><AiOutlinePlus size={20} /></button>
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
                            label="Kategori Adı"
                            name="name"
                            rules={[{ required: true, message: 'Lütfen kategori adı girin!' }]}
                        >
                            <Input placeholder="Kategori adı girin" />
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