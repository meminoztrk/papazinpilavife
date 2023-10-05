
import { useLoaderData } from "@remix-run/react";
import { useEffect, useState } from 'react'
import { AiOutlineMenu, AiOutlineCalendar, AiOutlineComment, AiOutlineEye } from 'react-icons/ai';
import { LoadingOutlined, UserOutlined, FormOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { Link } from '@remix-run/react';
import seoHelp from './../../../hooks/seoHelp';
import { redirect } from '@remix-run/node';
import StickyMenu from './../../../components/StickyMenu';



// export const loader = async ({ params }) => {
//     const blogId = params.blogId.split("-").pop()
//     const req = await fetch(process.env.REACT_APP_API + `/Blog/GetWithCatById?id=${blogId}&category=${params.catname}`, {
//         headers: {
//             'ApiKey': process.env.REACT_APP_API_KEY,
//             'Content-Type': 'application/json'
//         }
//     })
//     const blog = await req.json();
//     const data = {
//         data: blog.data,
//         API: process.env.REACT_APP_API,
//         API_KEY: process.env.REACT_APP_API_KEY,
//         IMAGES: process.env.REACT_APP_IMAGES
//     }
//     if (data.data) { return data } else { return redirect("/404") }
// }

// export const meta = ({ data }) => {
//     const title = data.data.title
//     const description = data.data.seoDescription
//     const keywords = data.data.seoKeywords
//     const categoryName = data.data.categoryName
//     return {
//         description,
//         keywords,
//         title,
//         "og:site_name": "Diyanet Gönüllüleri",
//         "og:title":title,
//         "og:description":description,
//         "og:image":data.IMAGES + "blog/" + data.data.image,
//         "og:url":"https://www.diyanetgonulluleri.com/"+"kategoriler/"+seoHelp(categoryName)+"/"+seoHelp(title)+"-"+data.data.id,
//         "og:type": "article",
//         "og:image": data.IMAGES + "blog/" + data.data.image,
//         "og:image:width": 1280,
//         "og:image:heigth": 720,
//         "twitter:card":"summary_large_image",
//         "twitter:url":"https://www.diyanetgonulluleri.com/"+"kategoriler/"+seoHelp(categoryName)+"/"+seoHelp(title)+"-"+data.data.id,
//         "twitter:domain":"https://www.diyanetgonulluleri.com",
//         "twitter:site":"Diyanet Gönüllüleri",
//         "twitter:title":title,
//         "twitter:description":description,
//         "twitter:image:src":data.IMAGES + "blog/" + data.data.image,
//     }
// }

const kategori = () => {
    // const { data, IMAGES, API, API_KEY } = useLoaderData();

    return (
        <div className='mt-8'>
            {/* <div className="grid md:grid-cols-7 md:space-x-4">
                <div className="md:col-span-5">
                    <div className="bg-white shadow">
                        <div className='p-8'>
                            <div className='relative'>
                                <div className="px-6 py-1 before:w-[4px] before:h-full before:bg-red-700 before:block before:rounded-lg before:absolute before:top-0 before:left-0 before:content-['']">
                                    <div>
                                        <div className="flex items-center space-x-2">
                                            <h1 className="font-semibold md:text-3xl text-xl block">{data.title}</h1>
                                        </div>
                                        <span className="text-xs">
                                            <Link className="hover:text-red-500 px-1" to={"/"}>Anasayfa</Link>{">"}
                                            <Link className="hover:text-red-500 px-1" to={`/kategoriler/${seoHelp(data.categoryName)}`}>{data.categoryName}</Link>{">"} {data.title}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-8 pb-12">
                            <div>
                                <div>
                                    <div className="thumbn shadow-inner">
                                        <div className="imgbox">
                                            <img className="shadow rounded-t object-cover md:h-[26rem] h-60 w-full" src={`${IMAGES}/blog/${data.image}`} />
                                        </div>
                                    </div>
                                    <div className="h-9 md:text-xs text-[10px] font-semibold  text-gray-400 px-4 bg-gray-100 rounded-b flex items-center md:space-x-8 space-x-0">
                                        <div className="md:flex hidden items-center space-x-2">
                                            <AiOutlineMenu size={16} />
                                            <span>{data.categoryName}</span>
                                        </div>
                                        <div className="flex items-center space-x-1">
                                            <AiOutlineCalendar size={16} />
                                            <span>{data.createdDate}</span>
                                        </div>
                                        <div className="md:flex hidden items-center space-x-1 ">
                                            <AiOutlineComment size={16} />
                                            <span>0</span>
                                        </div>
                                        <div className="md:flex hidden items-center space-x-1">
                                            <AiOutlineEye size={16} />
                                            <span>21</span>
                                        </div>
                                    </div>
                                    <article className="ck-content mt-6" dangerouslySetInnerHTML={{ __html: data.content }} />
                                </div>

                            </div>
                        </div>
                    </div>


                    <div className="bg-white shadow mt-5">
                        <div className="flex items-center bg-gray-50 justify-between relative p-4 after:h-[2px] after:w-full after:bg-red-700 after:block after:absolute after:bottom-0 after:left-0 after:content-['']">
                            <div className="flex items-center space-x-2">
                                <span className="font-bold text-[15px] block">YORUMLAR</span>
                            </div>
                        </div>
                        <div className="px-7 py-5">
                            <div>
                                <div className="relative">
                                    <FormOutlined style={{ fontSize: "18px" }} className='pointer-events-none w-5 h-5 absolute top-[16px] transform left-3 text-gray-400' />
                                    <textarea rows={5} className="shadow pl-10 appearance-none border rounded w-full p-4 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline" type={"text"} placeholder="Siz de yorum ve düşüncelerinizi bizimle paylaşın." tabIndex="0" />
                                </div>
                                <div className="pt-2 flex items-center space-x-4">
                                    <div className="relative w-full">
                                        <UserOutlined style={{ fontSize: "18px" }} className='pointer-events-none w-5 h-5 absolute top-[16px] transform left-3 text-gray-400' />
                                        <input className="shadow pl-10 h-12 appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline" type={"text"} placeholder="Adınızı girin." tabIndex="0" />
                                    </div>

                                    <button className="bg-red-500 h-12 rounded text-white font-semibold px-6">GÖNDER</button>
                                </div>

                            </div>

                        </div>
                        <div className='h-16'></div>

                    </div>
                </div>
                <StickyMenu API={{API,API_KEY}} />

            </div> */}


        </div>
    )
}

export default kategori