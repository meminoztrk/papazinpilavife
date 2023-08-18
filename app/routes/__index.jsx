
import { Outlet } from "@remix-run/react";
import React, { useState, useEffect } from 'react'
import { Header } from './../components/Header';
import { Footer } from './../components/Footer';
import { useLoaderData } from "@remix-run/react";
import SearchModal from './../components/SearchModal';
import { useOutletContext } from 'react-router-dom';
import Projection from "~/components/Projection";


export default function IndexRoute() {
  const [data] = useOutletContext();
  const [openModal, setOpenModal] = useState(false);
  const [hidden,setHidden] = useState(false);

  useEffect(() => {
    setHidden(true)
  }, []);

  return (
    <div>
      <Projection state={hidden}/>
      {openModal && <SearchModal closeModal={setOpenModal} />}
      <Header data={data} openModal={setOpenModal} />
      <div className='container pt-28 mx-auto xl:px-48 lg:px-12 px-2'>
        <Outlet />
      </div>
      <Footer data={data} />
    </div >
  );
}