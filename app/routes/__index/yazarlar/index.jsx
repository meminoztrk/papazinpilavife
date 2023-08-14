import React from 'react'
import { AiOutlineUser } from 'react-icons/ai'
import { Link, useLoaderData } from '@remix-run/react';
import seoHelp from './../../../hooks/seoHelp';
import { redirect } from '@remix-run/node';


export const loader = async ({ params }) => {
    const req = await fetch(process.env.REACT_APP_API + "/CBlog/GetUsersWithCBlog", {
        headers: {
            'ApiKey': process.env.REACT_APP_API_KEY,
            'Content-Type': 'application/json'
        }
    })
    const blogs = await req.json();
    const data = {
        data: blogs.data,
        API: process.env.REACT_APP_API,
        IMAGES: process.env.REACT_APP_IMAGES
    }
    if (data.data && data.data.length > 0) { return data } else { return redirect("/404") }
}


const index = () => {
    const { data, API, IMAGES } = useLoaderData();

    return (
        <div className='mt-8'>

            <div className="bg-white shadow" style={{ minHeight: 470 }}>
                <div className='p-8'>
                    <div className='relative'>
                        <div className="px-6 py-1 before:w-[4px] before:h-full before:bg-red-700 before:block before:rounded-lg before:absolute before:top-0 before:left-0 before:content-['']">
                            <div>
                                <div className="flex items-center justi space-x-2">
                                    <AiOutlineUser size={30} />
                                    <span className="font-semibold text-2xl block">Yazarlarımız</span>
                                </div>
                                <span className="text-xs"><Link className="hover:text-red-500" to={"/"}>Anasayfa</Link> {">"} Yazarlarımız</span>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="px-4 pb-12">
                    <div className="grid md:grid-cols-3 grid-cols-1 gap-6 p-4">
                        {data.map((x, index) => (
                            <div key={x} className='bg-gray-50 p-4 h-full rounded'>
                                <div className='flex items-center'>
                                    <div className='min-w-fit'>
                                        <img className='md:w-20 md:h-20 object-cover  rounded-full align-middle ' src={IMAGES + "user/" + x.image} alt="" />
                                    </div>
                                    <div className='pl-5 flex justify-center'>
                                        <Link className='hover:text-red-500 font-semibold xl:text-[14px] text-[10px] text-gray-800 uppercase' to={`/yazarlar/${seoHelp(x.author)}-${x.id}`}>
                                           {x.author}
                                        </Link>
                                    </div>
                                </div>
                                <div className='pt-4 px-2'>
                                    <Link className='hover:text-gray-900 xl:text-[14px] text-[9px] font-medium text-gray-600' to={`/yazarlar/${seoHelp(x.author)}/${seoHelp(x.title)}-${x.id}`}>
                                        {x.title}
                                    </Link>
                                    <p className='xl:text-[10px] text-[8px] font-medium text-gray-400 pt-2'>{x.createdDate}</p>
                                </div>
                            </div>
                        ))}

                    </div>
                </div>
            </div>
        </div>




    )
}

export default index
