const Projection = ({ state }) => {
 
  return (
    <div
      className={`${
        state && "alert-hidden"
      } flex justify-center w-[100vw] h-[100vh] bg-white bg-opacity-80 fixed items-center z-50`}
    >
      <div className="w-full xl:mx-60 lg:mx-16 mx-4 md:mb-40 flex justify-center items-center">
        <img
          alt="logo"
          className="object-cover w-1/5"
          src="https://seeklogo.com/images/L/logo-com-hr-logo-5636A4D2D5-seeklogo.com.png"
        />
      </div>
    </div>
  );
};

export default Projection;
