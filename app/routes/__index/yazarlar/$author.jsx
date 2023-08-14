
import { useLoaderData } from "@remix-run/react";
import { AiOutlineMenu } from 'react-icons/ai';
import { Link } from '@remix-run/react';
import seoHelp from './../../../hooks/seoHelp';
import { redirect } from '@remix-run/node';
import StickyMenu from './../../../components/StickyMenu';


export const loader = async ({ params }) => {
    const authorId = params.author.split("-").pop()
    const req = await fetch(process.env.REACT_APP_API + "/CBlog/GetUserWithCBlogs?id=" + authorId, {
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
    if (data.data && data.data.id) { return data } else { return redirect("/404") }
}

const author = () => {
    const { data, API, API_KEY, IMAGES } = useLoaderData();

    return (
        <div className='mt-8'>
            <div className="grid md:grid-cols-7 space-x-4">
                <div className="col-span-5">
                    <div className="bg-white shadow">
                        <div className='px-8 py-2 pt-6'>
                            <div className='bg-gray-50 p-4 h-full rounded shadow'>
                                <div className='flex items-center'>
                                    <div className='min-w-fit'>
                                        <img className='md:w-40 md:h-40 object-cover  rounded-full align-middle ' src={IMAGES + "user/" + data.image} alt="" />
                                    </div>
                                    <div className='pl-8'>
                                        <p className='font-semibold xl:text-[18px] text-[10px] text-red-500'>BÜTÜN YAZILARI</p>
                                        <p className='font-semibold xl:text-[15px] text-[10px] text-gray-600 uppercase'>{data.author}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {data.cBlogs.map((x, index) => (
                            <div key={x.id} className='px-8 py-2'>
                                <div className='p-4 h-full rounded shadow' style={{ minHeight: 160 }}>
                                    <h1 className="text-lg font-semibold">{x.title}</h1>
                                    <p>{x.content}...</p>
                                    <div className="pt-4 px-1 flex items-center justify-between">
                                        <span className="text-gray-400">{x.createdDate}</span>
                                        <Link to={`/yazarlar/${seoHelp(data.author)}/${seoHelp(x.title)}-${x.id}`} className="text-red-500">Devamını Oku</Link>
                                    </div>
                                </div>
                            </div>
                        ))}


                        <div className="h-16"></div>

                    </div>
                </div>
                <StickyMenu API={{API,API_KEY}}  />


            </div>
        </div>
    )
}

export default author