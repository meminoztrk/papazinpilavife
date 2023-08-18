import {
  Outlet,
  LiveReload,
  Scripts,
  Link,
  Links,
  Meta,
  useCatch,
  useTransition,
  ScrollRestoration,
} from "@remix-run/react";
import { useLoaderData } from "@remix-run/react";
import antdcss from "antd/dist/antd.css";
import swipercss from "swiper/css";
import swipernav from "swiper/css/navigation";
import swiperpg from "swiper/css/pagination";
import swipersb from "swiper/css/scrollbar";
import styles from "./styles/app.css";
import NProgress from "nprogress";
import nProgressStyles from "nprogress/nprogress.css";
import { useEffect, useState } from "react";

export function links() {
  return [
    { rel: "stylesheet", href: antdcss },
    { rel: "stylesheet", href: swipercss },
    { rel: "stylesheet", href: swipernav },
    { rel: "stylesheet", href: swiperpg },
    { rel: "stylesheet", href: swipersb },
    { rel: "stylesheet", href: nProgressStyles },
    { rel: "stylesheet", href: styles },
    {
      rel: "icon",
      href: "https://icon-library.com/images/red-icon-png/red-icon-png-14.jpg",
      type: "image/png",
    },
  ];
}

export const loader = async ({ request }) => {
  require("dotenv").config();
  const req = await fetch(process.env.REACT_APP_API + "/Generic/GetAbout", {
    headers: {
      ApiKey: process.env.REACT_APP_API_KEY,
      "Content-Type": "application/json",
    },
  });
  const common = await req.json();
  common.API = process.env.REACT_APP_API;
  common.IMAGES = process.env.REACT_APP_IMAGES;
  return common;
};

export const meta = ({ data }) => {
  const description = data.data.seoDescription;
  const keywords = data.data.seoKeywords;
  const title = "Papazinpilavi";
  return {
    description,
    keywords,
    title,
    "og:url": "https://www.diyanetgonulluleri.com",
    "og:type": "website",
    "og:site_name": data.data.name,
    // "og:image": data.IMAGES + "about/" + data.data.about.logo,
    "og:image": "https://images.alphacoders.com/472/472647.jpg",
    "og:image:width": 1280,
    "og:image:heigth": 720,
  };
};

export default function App() {
  const data = useLoaderData();
  const transition = useTransition();
  const [hidden,setHidden] = useState(false);

  useEffect(() => {
    // when the state is idle then we can to complete the progress bar
    if (transition.state === "idle") NProgress.done();
    // and when it's something else it means it's either submitting a form or
    // waiting for the loaders of the next location so we start it
    else NProgress.start();
  }, [transition.state]);

  return (
    <Document>
      <Outlet context={[data]} />
    </Document>
  );
}

function Document({ children, title }) {
  return (
    <html prefix="og: http://ogp.me/ns#" lang="tr">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <meta
          httpEquiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <meta name="robots" content="max-image-preview:large" />
        <Meta />
        <Links />
        <title>{title ? title : "Diyanet Gönüllüleri"}</title>
      </head>
      <body className="font-inter">
        {children}
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === "development" ? <LiveReload /> : null}
      </body>
    </html>
  );
}
