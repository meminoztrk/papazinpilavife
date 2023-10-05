
import { Outlet } from "@remix-run/react";
import React, { useState, useEffect } from 'react'
import { Header } from './../components/Header';
import { Footer } from './../components/Footer';
import { useLoaderData } from "@remix-run/react";
import SearchModal from '../components/ImageWithCommentModal';
import { useOutletContext } from 'react-router-dom';
import Projection from "~/components/Projection";
import { getUser, getJwt } from "~/hooks/cookie";





export const loader = async ({ request }) => {
  const jwt = getJwt(request.headers.get("cookie"))
  const data = await getUser(jwt,process.env.REACT_APP_API,process.env.REACT_APP_API_KEY);

  if(data.userId){ return data }else{ return null}
}


export default function IndexRoute() {
  const [data] = useOutletContext();
  const user = useLoaderData();
  const [existUser,setExistUser] = useState(user);
  const [openModal, setOpenModal] = useState(false);
  const [hidden,setHidden] = useState(false);

  const handleChange = (data) => {
    setExistUser(data);
  };

  useEffect(() => {
    console.log("index tarafında: ",existUser);
  }, [existUser]);

  useEffect(() => {
    console.log(user);
    setHidden(true)
  }, []);

  return (
    <div>
      <Projection state={hidden}/>
      {openModal && <SearchModal closeModal={setOpenModal} />}
      <Header data={data} existUser={existUser} handleChange={handleChange} openModal={setOpenModal}  />
      <div className='container pt-28 mx-auto xl:px-48 lg:px-12 px-2'>
        <Outlet context={[existUser,handleChange]} />
      </div>
      <Footer data={data} />
    </div >
  );
}