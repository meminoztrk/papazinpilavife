import React, { useRef, useEffect } from 'react'
import { FaSearch} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';


const SearchModal = ({ closeModal }) => {

  const wrapper = useRef([]);
  let navigate = useNavigate();

  function useOutsideAlerter(ref) {
    useEffect(() => {

      function handleClickOutside(event) {
        if (ref.current && !ref.current.contains(event.target)) {
          event.button === 0 && closeModal(false)
        }
      }
      document.addEventListener("mouseup", handleClickOutside);
      return () => {
        document.removeEventListener("mouseup", handleClickOutside);
      };
    }, [ref]); // eslint-disable-line react-hooks/exhaustive-deps
  }

  useOutsideAlerter(wrapper);

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      navigate(`/arama?text=${event.target.value}`)
      closeModal(false)
    }
  }

  return (
    <div className='flex justify-center w-[100vw] h-[100vh] bg-black bg-opacity-80 fixed items-center z-50 modalBackground'>
      <div ref={wrapper} className='w-full xl:mx-60 lg:mx-16 mx-4 md:mb-40 flex flex-col'>
        <div className='w-full flex items-center relative'>
          <FaSearch className='absolute text-gray-500 z-50 ml-4 text-[17px]'/>
          <input onKeyDown={handleKeyDown} type="text" className="h-12 w-full pl-12 pr-5 rounded-xl z-0 focus:shadow focus:outline-none" placeholder="Haber, kategori veya içerik ara" />
        </div>
        <div className='p-2 flex flex-wrap items-center space-x-2'>
          <button className='text-white border p-2 rounded text-xs hover:bg-white hover:text-black'>#diyanet</button>
          <button className='text-white border p-2 rounded text-xs hover:bg-white hover:text-black'>#teşkilat haberleri</button>
          <button className='text-white border p-2 rounded text-xs hover:bg-white hover:text-black'>#ali erbaş</button>

          
        </div>
        <button className='absolute text-white right-0 top-0 mt-2 mr-5 text-xl hover:text-gray-300' onClick={() => closeModal(false)}>x</button>   
      </div>
    </div>
  )
}

export default SearchModal;