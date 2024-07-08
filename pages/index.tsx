import Image from "next/image";
import { Inter } from "next/font/google";
import { useState } from "react";
import { useCookies } from "react-cookie";
import { Cookies } from "react-cookie";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { useRouter } from "next/router";

const inter = Inter({ subsets: ["latin"] });

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const serverCookie = context.req.cookies.__session;
  console.log("__session: ", serverCookie);
  return {
    props: { serverCookie: serverCookie ?? null },
  };
}

export default function Home({
  serverCookie,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const cookies = new Cookies();
  const currentCookie = serverCookie ?? cookies.get("__session");
  const [cookieText, setCookieText] = useState(currentCookie ?? "test-cookie");
  const [, setCookie] = useCookies(["__session"]);
  const { reload } = useRouter();

  const onClick = () => {
    setCookie("__session", cookieText, {
      maxAge: 60 * 60 * 24 * 30,
      path: "/",
      sameSite: "lax" as "lax",
      secure: process.env.NODE_ENV === "production",
    });
    reload();
  };

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-center gap-2 p-6 ${inter.className}`}
    >
      <div className="flex flex-col gap-2 items-end">
        <span className="text-black mb-6 ">
          <b>Current cookie (__session):</b> {currentCookie}
        </span>
        <input
          type="text"
          value={cookieText}
          onChange={(event) => setCookieText(event.target.value)}
          className="rounded-full px-4 py-2 shadow-lg max-w-[400px] w-full"
        />
        <button
          className="bg-blue-600 text-white p-2 rounded-full hover:brightness-125 shadow-lg active:scale-95 w-[160px]"
          onClick={onClick}
        >
          Set client cookie
        </button>
        <span className="text-slate-800">
          When client cookie is set, the page will be reloaded and you should
          see the cookie in the server logs
        </span>
      </div>
    </main>
  );
}
