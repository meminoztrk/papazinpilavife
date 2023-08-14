
import { useLoaderData } from "@remix-run/react";
import { AiOutlineMenu } from 'react-icons/ai';
import { Link } from '@remix-run/react';
import seoHelp from './../../../hooks/seoHelp';
import { redirect } from '@remix-run/node';
import StickyMenu from './../../../components/StickyMenu';


export const loader = async ({ params }) => {
    const req = await fetch(process.env.REACT_APP_API + `/Blog/GetWithCatName?category=${params.catname}&page=1&items=48`, {
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
    if(data.data && data.data.length > 0) { return data } else { return redirect("/404")}
}

const kategori = () => {
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
                                            <AiOutlineMenu size={20} />
                                            <span className="font-semibold text-2xl block">{data[0].categoryName}</span>
                                        </div>
                                        <span className="text-xs"><Link className="hover:text-red-500" to={"/"}>Anasayfa</Link> {">"} {data[0].categoryName}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="px-4 pb-12">
                            <div className="grid md:grid-cols-3 grid-cols-2 gap-8 p-4">
                                {data.map((x, index) => (
                                    <div key={x.id}>
                                        <div className="thumbn shadow-inner">
                                            <div className="imgbox">
                                                <img className="shadow border object-cover md:h-36 h-24 w-full" src={`${IMAGES}/blog/thumbnail${x.image}`} />
                                            </div>
                                        </div>
                                        <div className="tracking-tighter text-[13px] pt-2 text-gray-400">{x.createdDate}</div>
                                        <Link to={`/kategoriler/${seoHelp(x.categoryName)}/${seoHelp(x.title)}-${x.id}`} className="hover:text-red-500">
                                            <div className=" hover:text-red-500 md:text-base text-xs cursor-pointer font-bold">{x.title}</div>
                                        </Link>
                                        <div className="md:text-[13px] text-[11px] text-gray-600">{x.content}...</div>
                                    </div>
                                ))}                              
                            </div>
                        </div>
                    </div>
                </div>
                <StickyMenu API={{API,API_KEY}}/>


            </div>
        </div>
    )
}

export default kategori