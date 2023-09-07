import { useState } from "react";
import Login from "~/components/Login";
import Register from "~/components/Register";
import RegisterBusiness from "~/components/RegisterBusiness";

export const loader = async () => {
  const data = {
    API: process.env.REACT_APP_API,
    API_KEY: process.env.REACT_APP_API_KEY,
  };
  console.log(data);
  return data;
};

const uyelik = () => {
  return (
    <div className="mt-36">
      <div className="bg-white px-4 py-3 rounded flex items-center justify-between">
          <div>
             Bir işletmeye sahip iseniz işletme hesabı açıp işletmenizi tanıtabilirsiniz.
          </div>
          <div>
            <RegisterBusiness />
          </div>
      </div>
      <div className="grid md:grid-cols-2 grid-cols-1 md:space-x-8 space-x-0 md:space-y-0 space-y-8 pt-6">
        <Login />

        <Register />
      </div>
    </div>
  );
};

export default uyelik;
