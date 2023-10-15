import { useState } from "react";
import { useForm } from "sunflower-antd";
import { Checkbox, Form, Input } from "antd";
import { AlertFilled, KeyOutlined, MailOutlined } from "@ant-design/icons";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useLoaderData } from "@remix-run/react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { userPrefs } from "~/hooks/cookie";

export const loader = async () => {
  const data = {
    API: process.env.REACT_APP_API,
    API_KEY: process.env.REACT_APP_API_KEY,
  };
  return data;
};

const administrationlogin = () => {
  const [existUser, handleChange] = useOutletContext();
  const [error, setError] = useState("");
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const { API, API_KEY } = useLoaderData();

  const glogin = async (credResponse) => {
    var decoded = jwtDecode(credResponse.credential);

    await fetch(API + "/User/gSign", {
      method: "POST",
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email: decoded.email,
        name: decoded.given_name,
        surname: decoded.family_name,
        googleCredential: decoded.sub,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        data.data.isAdmin
          ? (handleChange(data.data),
            userPrefs(data.data.token),
            navigate("/administrationv1"))
          : setError("Yönetici bulunamadı!");
      });
  };

  const login = async (email, password) => {
    await fetch(API + "/User/login", {
      method: "POST",
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        email,
        password,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        data.data.isAdmin
          ? (handleChange(data.data),
            userPrefs(data.data.token),
            navigate("/administrationv1"))
          : setError("Yönetici bulunamadı!");
      });
  };

  const { formProps, formLoading } = useForm({
    form,
    async submit({ email, password }) {
      await login(email, password);
      return "ok";
    },
  });
  return (
    <div className="flex md:flex-row flex-col mt-40">
      <div className="bg-white shadow md:rounded-l-md rounded-md divide-y md:w-1/2 w-full">
        <div className="p-4">
          <div className="relative">
            <div className="px-6 py-1 before:w-[4px] before:h-full before:bg-red-700 before:block before:rounded-lg before:absolute before:top-0 before:left-0 before:content-['']">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-xl block">
                  Administration
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="px-4 py-2 bg-gray-50 flex items-center">
          <AlertFilled className="pr-4" /> Yönetim paneline ulaşmak için giriş
          yapın
        </div>
        <div className="px-6 py-6">
          <Form
            {...formProps}
            name="basic"
            initialValues={{ remember: true, email: "", password: "" }}
            autoComplete="off"
          >
            <Form.Item>
              <MailOutlined
                style={{ fontSize: "18px" }}
                className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
              />
              <Form.Item
                name="email"
                rules={[
                  {
                    required: true,
                    message: "Lütfen e-posta adresinizi girin!",
                  },
                  { type: "email", message: "Uygun bir E-posta adresi girin!" },
                ]}
                noStyle
              >
                <Input
                  className="shadow pl-10 h-12 rounded w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline"
                  type={"text"}
                  placeholder="E-Posta"
                  tabIndex="0"
                />
              </Form.Item>
            </Form.Item>

            <Form.Item>
              <KeyOutlined
                style={{ fontSize: "18px" }}
                className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
              />
              <Form.Item
                name="password"
                rules={[{ required: true, message: "Lütfen şifrenizi girin!" }]}
                noStyle
              >
                <Input
                  className="shadow pl-10 h-12 rounded w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline"
                  type="password"
                  placeholder="Parola"
                  tabIndex="0"
                />
              </Form.Item>
            </Form.Item>

            <div className="flex items-center justify-between pl-1 pr-2">
              <Form.Item name="remember" valuePropName="checked">
                <Checkbox>Beni Hatırla</Checkbox>
              </Form.Item>
              <Form.Item name="remember" valuePropName="checked">
                <a
                  className="text-red-500 font-bold uppercase"
                  lang="tr"
                  href="#sifremiunuttum"
                >
                  Şifremi Unuttum
                </a>
              </Form.Item>
            </div>
            <span className="text-red-500 my-4 block">{error}</span>
            <Form.Item>
              <div className="flex items-center justify-between">
                <button
                  {...(formLoading && { disabled: true })}
                  className="px-8 py-[10px] rounded-lg bg-red-700 hover:bg-red-900 text-white font-semibold"
                  type="sumbit"
                >
                  <div className="flex items-center">
                    <svg
                      className={
                        formLoading
                          ? "inline mr-2 w-4 h-4 text-red-200 animate-spin  fill-white"
                          : "hidden"
                      }
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span>GİRİŞ YAP</span>
                  </div>
                </button>
                <div>
                  <GoogleOAuthProvider clientId="632469238629-v1rmriqohn2cvpsno69b219m5fhnjdi8.apps.googleusercontent.com">
                    <GoogleLogin
                      className="h-5 w-10"
                      onSuccess={(credentialResponse) => {
                        glogin(credentialResponse);
                      }}
                      onError={() => {
                        console.log("Login Failed");
                      }}
                    />
                  </GoogleOAuthProvider>
                </div>
              </div>
            </Form.Item>
          </Form>
        </div>
        <div className="mt-14"></div>
      </div>

      <div className="relative overflow-hidden rounded-r-md md:flex md:w-1/2 w-full bg-gradient-to-tr from-red-800 to-purple-700 i justify-around items-center hidden">
        <div>
          <h1 className="text-white font-bold text-4xl font-sans">
            Papazın Pilavı
          </h1>
          <p className="text-white mt-1">
            Popüler işletmeleri ve yorumları görmek için ziyaret edin.
          </p>
          <button
            type="submit"
            className="block w-28 bg-white text-indigo-800 mt-4 py-2 rounded-2xl font-bold mb-2"
          >
            Anasayfa
          </button>
        </div>
        <div className="absolute -bottom-32 -left-40 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -bottom-40 -left-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-40 -right-0 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
        <div className="absolute -top-20 -right-20 w-80 h-80 border-4 rounded-full border-opacity-30 border-t-8"></div>
      </div>
    </div>
  );
};

export default administrationlogin;
