import { useState, useEffect } from "react";
import { useForm } from "sunflower-antd";
import { Checkbox, Form, Modal, Spin } from "antd";
import {
  AlertFilled,
  KeyOutlined,
  MailOutlined,
  LoadingOutlined,
} from "@ant-design/icons";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useLoaderData } from "@remix-run/react";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import jwtDecode from "jwt-decode";
import { userPrefs } from "~/hooks/cookie";

const LoginModal = ({ loginModal, handleLoginModal }) => {
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
        data.statusCode == 400 && setError(data.errors);
        data.statusCode == 201 &&
          (handleChange(data.data),
          userPrefs(data.data.token),
          handleLoginModal(false));
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
        data.statusCode == 400 && setError(data.errors);
        data.statusCode == 201 &&
          (handleChange(data.data),
          userPrefs(data.data.token),
          handleLoginModal(false));
      });
  };

  const { formProps, formLoading } = useForm({
    form,
    async submit({ email, password }) {
      await new Promise((r) => setTimeout(r, 500));
      await login(email, password);
      return "ok";
    },
  });

  return (
    <Modal
      visible={loginModal}
      onCancel={() => handleLoginModal(false)}
      forceRender
      transitionName=""
      footer=""
      getContainer={false}
      centered
      title={
        <div className="relative py-2">
          <div className="px-6 py-1 before:w-[4px] before:h-full before:bg-red-700 before:block before:rounded-lg before:absolute before:top-0 before:left-0 before:content-['']">
            <div className="flex items-center space-x-2">
              <span className="font-semibold text-xl block">Giriş Yap</span>
            </div>
          </div>
        </div>
      }
    >
      <Spin spinning={formLoading} indicator={<LoadingOutlined spin />}>
        <div className="bg-white rounded-md">
          <div className="px-4 py-2 bg-gray-50 flex items-center">
            <AlertFilled className="pr-4" /> Kişisel hesabınız veya işletme
            hesabınız varsa giriş yapın
          </div>
          <div className="py-6">
            <Form
              {...formProps}
              name="basic"
              initialValues={{ remember: true, email: "", password: "" }}
              autoComplete="off"
            >
              <Form.Item>
                <MailOutlined
                  style={{ fontSize: "18px" }}
                  className="pointer-events-none w-5 h-5 absolute top-[16px] transform left-3 text-gray-400"
                />
                <Form.Item
                  name="email"
                  rules={[
                    {
                      required: true,
                      message: "Lütfen e-posta adresinizi girin!",
                    },
                    {
                      type: "email",
                      message: "Uygun bir E-posta adresi girin!",
                    },
                  ]}
                  noStyle
                >
                  <input
                    className="shadow pl-10 h-12 appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline"
                    type={"text"}
                    placeholder="E-Posta"
                    tabIndex="0"
                  />
                </Form.Item>
              </Form.Item>

              <Form.Item>
                <KeyOutlined
                  style={{ fontSize: "18px" }}
                  className="pointer-events-none w-5 h-5 absolute top-[16px] transform left-3 text-gray-400"
                />
                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: "Lütfen şifrenizi girin!" },
                  ]}
                  noStyle
                >
                  <input
                    className="shadow pl-10 h-12 appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline"
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
                    className="px-4 py-2 rounded-lg bg-red-700 hover:bg-red-900 text-white font-semibold"
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
                  <div className="flex">
                    <GoogleOAuthProvider clientId="632469238629-v1rmriqohn2cvpsno69b219m5fhnjdi8.apps.googleusercontent.com">
                      <GoogleLogin
                        onSuccess={(credentialResponse) => {
                          glogin(credentialResponse);
                        }}
                        onError={() => {
                            setError("Google hesabına girerken bir hata oluştu.")
                        }}
                      />
                    </GoogleOAuthProvider>
                  </div>
                </div>
              </Form.Item>
            </Form>
          </div>
          <div className="flex justify-center">
            <button
              onClick={() => navigate("/uyelik")}
              className="text-red-700 rounded-lg border p-2 hover:border-red-700"
            >
              Hesabınız yoksa kayıt olun
            </button>
          </div>
        </div>
      </Spin>
    </Modal>
  );
};

export default LoginModal;
