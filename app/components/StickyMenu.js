import { useEffect, useState } from 'react'
import { LoadingOutlined } from '@ant-design/icons';
import { Spin } from 'antd';
import { FaMosque, FaSearch, FaCaretDown, FaCaretUp } from 'react-icons/fa'
import { BsCloudSunFill } from 'react-icons/bs'
import RealTimeClock from "../components/RealTimeClock";
import cities from '../data/Cities.json'
import { Link } from '@remix-run/react';
import seoHelp from './../hooks/seoHelp';
import { useLoaderData } from '@remix-run/react';
import { useNavigate } from 'react-router-dom';


const StickyMenu = ({API}) => {
    const [blogs, setBlogs] = useState([])
    const [hidden, setHidden] = useState(true);
    const [city, setCity] = useState([])
    const [vakitler, setVakitler] = useState([])
    const [loadingNamaz, setLoadingNamaz] = useState(false)
    const [loadingBlog, setLoadingBlog] = useState(false)
    let navigate = useNavigate();

    const getLastBlogs = async () => {
        setLoadingBlog(true)
        await fetch(API.API + "/Blog/GetBlogTitle", {
            method: 'GET',
            headers: {
                'ApiKey': API.API_KEY,
                'Content-Type': 'application/json'
            }
        }).then(res => res.json())
            .then(data => {
                setLoadingBlog(false)
                setBlogs(data.data)
            })
    }

    const getPrayerTime = async (cName) => {
        setLoadingNamaz(true);
        await fetch(
            `https://api.aladhan.com/v1/timingsByAddress/20-11-2022?address=${cName}&method=13&tune=10,0,-7,5,2,7,7,1`
        )
            .then((res) => res.json())
            .then((data) => {
                let { Firstthird, Lastthird, Fajr, Sunset, Midnight, ...times } = data.data.timings;
                const obje = [];
                for (var key in times) {
                    obje.push(times[key]);
                }
                obje.sort();
                setLoadingNamaz(false);
                setVakitler(obje);
            });
    };

    useEffect(async () => {
        getLastBlogs();
        await getPrayerTime('Istanbul')
    }, [])

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
          navigate(`/arama?text=${event.target.value}`)
          closeModal(false)
        }
      }


    return (
        <div className="col-span-2 md:block hidden">
            <div className="sticky top-10">

                <div className="flex items-center shadow">
                    <input onKeyDown={handleKeyDown} className="w-full h-12 outline-none border pl-4 pr-10" />
                    <FaSearch className="absolute mr-4 right-0 cursor-pointer hover:text-gray-500" size={18} />
                </div>

                <div className="bg-white shadow mt-5">
                    <div className="flex items-center bg-gray-50 justify-between relative p-4 after:h-[2px] after:w-full after:bg-red-700 after:block after:absolute after:bottom-0 after:left-0 after:content-['']">
                        <div className="flex items-center space-x-2">
                            <span className="font-bold text-[15px] block">Son Yazılar</span>
                        </div>
                    </div>
                    <Spin indicator={<LoadingOutlined className="text-gray-400" spin />} spinning={loadingBlog}>
                        <div className="divide-y">
                            {blogs.map((x, index) => (
                                <div key={x.id} className="px-4 py-2">
                                    <Link className="hover:text-red-500" to={`/kategoriler/${seoHelp(x.categoryName)}/${seoHelp(x.title)}-${x.id}`}>
                                        {x.title}
                                    </Link>
                                </div>
                            ))}
                        </div>
                        <div className='h-16'></div>
                    </Spin>
                </div>

                {/* <div className="bg-white shadow mt-5">
                    <div className="flex items-center bg-gray-50 justify-between relative p-4 after:h-[2px] after:w-full after:bg-red-700 after:block after:absolute after:bottom-0 after:left-0 after:content-['']">
                        <div className="flex items-center space-x-2">
                            <FaMosque size={18} />
                            <span className="font-bold text-[15px] block">NAMAZ VAKİTLERİ</span>
                        </div>
                    </div>
                    <Spin indicator={<LoadingOutlined className="text-gray-400" spin />} spinning={loadingNamaz}>
                        <div className="divide-y-2 divide-gray-100 relative">

                            <div className="flex items-center justify-between p-4 cursor-pointer select-none" onClick={() => setHidden(!hidden)}>
                                <span className="font-semibold text-[15px] select-none" >{city != '' ? city : 'İSTANBUL'}</span>
                                {hidden ? <FaCaretDown size={18} /> : <FaCaretUp size={18} />}
                            </div>
                            <div className={`absolute w-full h-[218px] z-50 ${hidden ? 'basket hide' : 'basket'}`}>
                                <div className="h-full bg-white top-0 left-0 overflow-scroll divide-y divide-gray-100">
                                    {cities.map((x, i) => (
                                        <div onClick={(e) => { setHidden(!hidden), getPrayerTime(x.sehirAdiEn), setCity(x.sehirAdiEn) }} key={i} className="py-2 px-4 cursor-pointer hover:bg-gray-100">{x.sehirAdi}</div>
                                    ))
                                    }

                                </div>
                            </div>
                            <div className="p-4 text-gray-400">
                                <RealTimeClock />
                            </div>
                            <div className="p-2 text-gray-500 font-medium tracking-tight text-[14px]">
                                <ul className='flex flex-wrap items-center w-full'>
                                    <li className='md:w-1/3 w-1/2 p-2'>
                                        <div className='block bg-gray-100 hover:bg-gray-200 cursor-pointer p-2 px-4 rounded text-center'>
                                            <span className="block text-gray-400 text-[13px]">İMSAK</span>
                                            <span className="text-black">{vakitler.length > 0 && vakitler[0]}</span>
                                        </div>
                                    </li>
                                    <li className='md:w-1/3 w-1/2 p-2'>
                                        <div className='block bg-gray-100 hover:bg-gray-200 cursor-pointer p-2 px-4 rounded text-center'>
                                            <span className="block text-gray-400 text-[13px]">GÜNEŞ</span>
                                            <span className="text-black">{vakitler.length > 0 && vakitler[1]}</span>
                                        </div>
                                    </li>
                                    <li className='md:w-1/3 w-1/2 p-2'>
                                        <div className='block bg-gray-100 hover:bg-gray-200 cursor-pointer p-2 px-4 rounded text-center'>
                                            <span className="block text-gray-400 text-[13px]">ÖĞLE</span>
                                            <span className="text-black">{vakitler.length > 0 && vakitler[2]}</span>
                                        </div>
                                    </li>
                                    <li className='md:w-1/3 w-1/2 p-2'>
                                        <div className='block bg-gray-100 hover:bg-gray-200 cursor-pointer p-2 px-4 rounded text-center'>
                                            <span className="block text-gray-400 text-[13px]">İKİNDİ</span>
                                            <span className="text-black">{vakitler.length > 0 && vakitler[3]}</span>
                                        </div>
                                    </li>
                                    <li className='md:w-1/3 w-1/2 p-2'>
                                        <div className='block bg-gray-100 hover:bg-gray-200 cursor-pointer p-2 px-4 rounded text-center'>
                                            <span className="block text-gray-400 text-[13px]">AKŞAM</span>
                                            <span className="text-black">{vakitler.length > 0 && vakitler[4]}</span>
                                        </div>
                                    </li>
                                    <li className='md:w-1/3 w-1/2 p-2'>
                                        <div className='block bg-gray-100 hover:bg-gray-200 cursor-pointer p-2 px-4 rounded text-center'>
                                            <span className="block text-gray-400 text-[13px]">YATSI</span>
                                            <span className="text-black">{vakitler.length > 0 && vakitler[5]}</span>
                                        </div>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </Spin>
                </div> */}

                <div className="bg-white mt-5 h-60 shadow">
                    <div className="flex items-center bg-gray-50 justify-between relative p-4 after:h-[2px] after:w-full after:bg-red-700 after:block after:absolute after:bottom-0 after:left-0 after:content-['']">
                        <div className="flex items-center space-x-2">
                            <BsCloudSunFill className="mb-1" size={18} />
                            <span className="font-bold text-[15px] block">DÖVİZ</span>
                        </div>
                    </div>
                    <div>
                        <iframe src="https://api.genelpara.com/iframe/?symbol=para-birimleri&pb=USD,EUR,GA&stil=stil-9&renk=beyaz" title="Döviz ve Altın Fiyatları" frameBorder="0" className="w-full"></iframe>
                    </div>
                </div>



            </div>
        </div>
    )
}

export default StickyMenu
