import React from 'react'
import { FaFacebookF, FaTwitter, FaInstagram, FaYoutube, FaWhatsapp } from 'react-icons/fa';
import { Link } from '@remix-run/react';
import seoHelp from './../hooks/seoHelp';


export const Footer = ({ data }) => {
    return (
        <div>
            <div className='mt-10 w-full bg-white'>
                <div className='container mx-auto xl:px-48 lg:px-12 px-2 h-full'>
                    <div className="grid md:grid-cols-4 grid-cols-1 divide-x h-full">
                        <div className='md:col-span-1 flex flex-col px-4 py-8 mt-2'>
                            <div className='flex justify-center px-2'>
                                <img alt="logo" className='w-20' src="https://seeklogo.com/images/L/logo-com-hr-logo-5636A4D2D5-seeklogo.com.png" />
                            </div>
                            <p className='mt-4'>
                                Bu sitede yayınlanan tüm materyalin her hakkı mahfuzdur. Kaynak göstermeksizin alıntı yapılamaz.
                            </p>
                            <ul className='flex items-center mt-4 text-lg'>
                                <li className='cursor-pointer hover:text-white hover:bg-gray-300 p-2 rounded'><FaTwitter /></li>
                                <li className='cursor-pointer hover:text-white hover:bg-gray-300 p-2 rounded'><FaFacebookF /></li>
                                <li className='cursor-pointer hover:text-white hover:bg-gray-300 p-2 rounded'><FaInstagram /></li>
                                <li className='cursor-pointer hover:text-white hover:bg-gray-300 p-2 rounded'><FaYoutube /></li>
                                <li className='cursor-pointer hover:text-white hover:bg-gray-300 p-2 rounded'><FaWhatsapp /></li>
                            </ul>
                        </div>
                        <div className='md:col-span-1 flex px-4 md:py-8 justify-center'>
                            <nav>
                                <ul className='space-y-6 md:pt-4 flex flex-col justify-center text-center'>
                                    <Link className='hover:text-red-500' to={"/"}>Anasayfa</Link>
                                    <Link className='hover:text-red-500' to={"/"}>İletişim</Link>
                                    <Link className='hover:text-red-500' to={"/"}>Hakkımızda</Link>
                                    <Link className='hover:text-red-500' to={"/"}>Tüm Yazarlar</Link>
                                </ul>
                            </nav>
                        </div>
                        <div className='md:col-span-2'>
                            <nav>
                                <ul className='flex flex-wrap items-center px-4 py-8 w-full'>
                                    <Link className="md:w-1/3 w-1/2 p-2" to={"/"}><span className='block bg-gray-100 hover:bg-gray-200 cursor-pointer p-2 px-4 rounded text-gray-600'>Anasayfa</span></Link>
                                    {data.data.categories.slice(0,8).map((x, i) => (
                                        <Link key={i} className="md:w-1/3 w-1/2 p-2" to={`/kategoriler/${seoHelp(x.name)}`}><span className='block bg-gray-100 hover:bg-gray-200 cursor-pointer p-2 px-4 rounded text-gray-600'>{x.name}</span></Link>
                                    ))}

                                </ul>
                            </nav>
                        </div>
                    </div>
                </div>
                <div className='bg-black py-2 flex justify-center text-white'>
                    Papazinpilavi @2022
                </div>
            </div>
        </div>
    )
}
