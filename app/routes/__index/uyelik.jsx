import Login from "~/components/Login";
import Register from "~/components/Register";

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
    <div className="mt-32">
      <div className="grid md:grid-cols-2 grid-cols-1 md:space-x-8 space-x-0 md:space-y-0 space-y-8 pt-10">
        <Login />

        <Register />
      </div>
    </div>
  );
};

export default uyelik;
