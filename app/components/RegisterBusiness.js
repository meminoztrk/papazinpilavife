import { useState, useEffect } from "react";
import { useModalForm } from "sunflower-antd";
import { Form, Input, Modal, Select, Checkbox } from "antd";
import {
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
  KeyOutlined,
} from "@ant-design/icons";
import ReactInputMask from "react-input-mask";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useLoaderData } from "@remix-run/react";
import { userPrefs } from "~/hooks/cookie";


const RegisterBusiness = () => {
  const [existUser, handleChange] = useOutletContext();
  const [error, setError] = useState("");
  const [form] = Form.useForm();
  let navigate = useNavigate();
  const { API, API_KEY } = useLoaderData();

  const register = async (name,surname,email,phone,password) => {
    await fetch(API + "/User/register", {
      method: "POST",
      headers: {
        ApiKey: API_KEY,
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        name,
        surname,
        email,
        phone,
        password,
        isBusiness:true
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data)
        data.statusCode == 400 && setError(data.errors);
        data.statusCode == 201 && (close(),handleChange(data.data), userPrefs(data.data.token), navigate(`/profilebusiness`));
      });
  };


  const {
    modalProps,
    formProps,
    show,
    close,
    formLoading,
    // formValues,
    // formResult,
  } = useModalForm({
    defaultVisible: false,
    autoSubmitClose: true,
    autoResetForm: true,
    async submit({ bname, bsurname, bemail, bphone, bpassword }) {
      await new Promise((r) => setTimeout(r, 1000));
      register(bname,bsurname,bemail,bphone,bpassword);
      console.log("test");
      return "ok";
    },
    form,
  });

  return (
    <>
      <button
        onClick={() => show()}
        className="py-2 px-4 rounded bg-red-500 hover:bg-red-700 text-white"
      >
        İşletme Hesabı Aç
      </button>
      <Modal
        {...modalProps}
        forceRender
        transitionName=""
        footer=""
        getContainer={false}
        title={
          <div className="relative">
            <div className="px-6 py-1 before:w-[4px] before:h-full before:bg-red-700 before:block before:rounded-lg before:absolute before:top-0 before:left-0 before:content-['']">
              <div className="flex items-center space-x-2">
                <span className="font-semibold text-xl block">
                  İşletme Hesabı Aç
                </span>
              </div>
            </div>
          </div>
        }
        centered
      >
        <Form
          {...formProps}
          initialValues={{
            bremember: true,
            bname: "",
            bsurname: "",
            bemail: "",
            bphone: "",
            bpassword: "",
          }}
          autoComplete="off"
        >
          <div className="flex items-center gap-x-4">
            <Form.Item className="mb-0">
              <UserOutlined
                style={{ fontSize: "18px" }}
                className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
              />
              <Form.Item
                name="bname"
                rules={[
                  { required: true, message: "Lütfen adınızı girin!" },
                  { min: 2, message: "Adınız minimum 2 karakter olmalı!" },
                ]}
                // className="mb-0"
              >
                <input
                  className="shadow pl-10 h-12 z-0 appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline"
                  type={"text"}
                  placeholder="Ad"
                  tabIndex="0"
                />
              </Form.Item>
            </Form.Item>
            <Form.Item className="mb-0">
              <UserOutlined
                style={{ fontSize: "18px" }}
                className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
              />
              <Form.Item
                name="bsurname"
                rules={[
                  { required: true, message: "Lütfen soyadınızı girin!" },
                  { min: 2, message: "Soyadınız minimum 2 karakter olmalı!" },
                ]}
                // className="mb-0"
              >
                <input
                  className="shadow pl-10 h-12 appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline"
                  type={"text"}
                  placeholder="Soyad"
                  tabIndex="0"
                />
              </Form.Item>
            </Form.Item>
          </div>

          <Form.Item className="mb-0">
            <MailOutlined
              style={{ fontSize: "18px" }}
              className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
            />
            <Form.Item
              name="bemail"
              rules={[
                { required: true, message: "Lütfen e-posta adresinizi girin!" },
                { type: "email", message: "Uygun bir E-posta adresi girin!" },
              ]}
              //   noStyle
            >
              <input
                className="shadow pl-10 h-12 z-0 appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline"
                type={"text"}
                placeholder="E-Posta"
                tabIndex="0"
              />
            </Form.Item>
          </Form.Item>

          <Form.Item className="mb-0">
            <PhoneOutlined
              style={{ fontSize: "18px" }}
              className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
            />
            <Form.Item
              name="bphone"
              rules={[
                {
                  validator(rule, value) {
                    return new Promise((resolve, reject) => {
                      if (!value.includes("_") && value.length > 0) {
                        resolve();
                      } else {
                        reject("Geçerli telefon numarası girin!");
                      }
                    });
                  },
                },
              ]}
              //   noStyle
            >
              <ReactInputMask
                className="shadow pl-10 h-12 z-0 appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline"
                type={"text"}
                placeholder="Telefon"
                tabIndex="0"
                mask="(999) 999 99 99"
              />
            </Form.Item>
          </Form.Item>

          <Form.Item className="mb-0">
            <KeyOutlined
              style={{ fontSize: "18px" }}
              className="pointer-events-none w-5 h-5 z-10 absolute top-[16px] transform left-3 text-gray-400"
            />
            <Form.Item
              name="bpassword"
              rules={[
                { required: true, message: "Lütfen şifrenizi girin!" },
                { min: 6, message: "Şifre minimum 6 karakter olmalı!" },
              ]}
              //   noStyle
            >
              <input
                className="shadow pl-10 h-12 z-0 appearance-none border rounded w-full py-2 px-3 text-gray-700 bg-gray-50 leading-tight focus:outline-none focus:shadow-outline"
                type="password"
                placeholder="Parola"
                tabIndex="0"
              />
            </Form.Item>
          </Form.Item>

          <div className="flex items-center justify-between pl-1 pr-2">
            <Form.Item
              name="bremember"
              valuePropName="checked"
              className="mb-0"
            >
              <Checkbox>
                Fırsatlardan ve gelişmelerden beni haberdar et.
              </Checkbox>
            </Form.Item>
          </div>
          <span className="text-red-500 my-4 block">{error}</span>
          <Form.Item>
            <div className="flex items-center justify-center w-full">
              <button
                {...(formLoading && { disabled: true })}
                className="px-4 py-2 rounded-lg w-1/2 bg-red-700 hover:bg-red-900 text-white font-semibold"
                type="sumbit"
              >
                <div className="flex items-center justify-center">
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
                  <span>KAYIT OL</span>
                </div>
              </button>
            </div>
          </Form.Item>
          <div className="text-xs text-center px-4">
            Devam ettiğiniz takdirde{" "}
            <span className=" underline">Kullanım Koşullarımızı</span> kabul
            etmiş ve{" "}
            <span className=" underline">
              Gizlilik ve Çerezlerle İlgili Bildirimimizi
            </span>{" "}
            okuduğunuzu onaylamış sayılırsınız.
          </div>
        </Form>
      </Modal>
    </>
  );
};

export default RegisterBusiness;
