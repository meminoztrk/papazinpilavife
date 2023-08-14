
import { useLoaderData } from "@remix-run/react";
import { LoadingOutlined, UserOutlined, FormOutlined } from '@ant-design/icons';
import { Link } from '@remix-run/react';
import seoHelp from './../../../hooks/seoHelp';
import { redirect } from '@remix-run/node';
import StickyMenu from './../../../components/StickyMenu';


export const loader = async ({ params }) => {
    const cblogId = params.cblogId.split("-").pop()
    const req = await fetch(process.env.REACT_APP_API + "/CBlog/GetUserWithCBlog?id=" + cblogId, {
        headers: {
            'ApiKey': process.env.REACT_APP_API_KEY,
            'Content-Type': 'application/json'
        }
    })
    const blogs = await req.json();
    const data = {
        data: blogs.data,
        API: process.env.REACT_APP_API,
        API_KEY: process.env.REACT_APP_API_KEY,
        IMAGES: process.env.REACT_APP_IMAGES
    }
    if(data.data && data.data.id > 0) { return data } else { return redirect("/404")}
}

export const meta = ({ data }) => {
    const title = data.data.title
    const description = data.data.seoDescription
    const keywords = data.data.seoKeywords
    return {
        description,
        keywords,
        title,
        "og:type": "article",
        "og:image": data.IMAGES + "user/" + data.data.image
    }
}

const author = () => {
    const { data, API, API_KEY, IMAGES } = useLoaderData();

    return (
        <div className='mt-8'>
            <div className="grid md:grid-cols-7 space-x-4">
                <div className="col-span-5">
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
                                            <Link className="hover:text-red-500 px-1" to={`/yazarlar/${seoHelp(data.author)}`}>{data.author}</Link>{">"} {data.title}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <hr></hr>

                        <div className="px-8 pt-4">

                            <div className='float-left flex items-center flex-col shadow p-4 px-6 mr-6 mb-4'>
                                <div className='min-w-fit'>
                                    <img className='md:w-60 md:h-60 w-28 h-28 object-cover  rounded-full align-middle ' src={`${IMAGES}user/${data.image}`} alt="" />
                                </div>
                                <div className='flex flex-col items-center justify-center mt-4'>
                                    <p className='font-semibold xl:text-[16px] text-[10px] text-gray-500 uppercase'>{data.author}</p>
                                    <p className='font-semibold xl:text-[15px] text-[10px] text-red-600'>Tüm Yazıları</p>
                                </div>
                            </div>
                            <article className="ck-content" dangerouslySetInnerHTML={{ __html: data.content }} />
                        </div>

                        <div className="h-16"></div>

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
                <StickyMenu API={{API,API_KEY}}  />


            </div>
        </div>
    )
}

export default author