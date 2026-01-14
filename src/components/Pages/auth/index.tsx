import ModalSignup from "@/components/Modal/Signup/page";
import React, { useState } from "react";
import Register from "./register";
import { googleLoginAPI } from "@/components/service/auth";
import toast from "react-hot-toast";
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { GOOGLE_CLIENT_ID } from "@/components/content";
import { useDispatch } from "react-redux";
import { login } from "@/components/store/slice/auth";

export default function Authentication({
  isOpen = false,
  isLogin = false,
  handleClose,
}: {
  isOpen: boolean;
  isLogin: boolean;
  handleClose: () => void;
}) {
  const [registerOpen, setRegisterOpen] = useState(false);

  const dispatch = useDispatch();
  const handleRegister = () => {
    handleClose();
    setRegisterOpen(true);
  };
  const handleRegisterClose = () => {
    setRegisterOpen(false);
  };
  const loginWithGoogle = async (token: string) => {
    try {
      const reqBody = {
        idToken: token,
      };
      // eyJhbGciOiJSUzI1NiIsImtpZCI6IjRiYTZlZmVmNWUxNzIxNDk5NzFhMmQzYWJiNWYzMzJlMGY3ODcxNjUiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL2FjY291bnRzLmdvb2dsZS5jb20iLCJhenAiOiI4MzU5ODgwMzU5MzAtZWszYjI5N2owbzM0MDk4M2w1c2NiaWdtM21jbWg5b2YuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJhdWQiOiI4MzU5ODgwMzU5MzAtZWszYjI5N2owbzM0MDk4M2w1c2NiaWdtM21jbWg5b2YuYXBwcy5nb29nbGV1c2VyY29udGVudC5jb20iLCJzdWIiOiIxMTQyNDM4Nzk0NDg1NzA5NjYzMzkiLCJlbWFpbCI6InZhYmhpNzAyOUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwibmJmIjoxNzY3OTUzMTU3LCJuYW1lIjoiQWJoaSBWYXJtYSIsInBpY3R1cmUiOiJodHRwczovL2xoMy5nb29nbGV1c2VyY29udGVudC5jb20vYS9BQ2c4b2NLcUFqTXR5S29SSEhQTTFFU1VWdGIwWXdvNmphbEdCNWlxYS0yeno2RUhuaVpvWGc9czk2LWMiLCJnaXZlbl9uYW1lIjoiQWJoaSIsImZhbWlseV9uYW1lIjoiVmFybWEiLCJpYXQiOjE3Njc5NTM0NTcsImV4cCI6MTc2Nzk1NzA1NywianRpIjoiY2MyYmMzYWMxN2I3MGY3NzQ3Y2VjYTVhZDQzMzk0ZWJlOGM2YWE4ZCJ9.TeBt3fJzjcVX2YVB7n79z-OkPga5f5jlbi6rNf0IezR37Ufqc86yTXVZ65h2tbguhn8cjL99_3AAKVuUu8wAIje5tk21v34rgXH9ZbwtrL59-XxsRQx_xLA5ljpLWy8lx_xEaAhP-S46m3QpcmI6DjmPNF_aIIYaI2VJ1r3O7FKIKfS-arYY8ElxCyHcVvPuGGONOXMaD2BjU7o-qtalMxRyyOvYl3puLMH-6aij2I3PL_WCa3OoQZak5mG_qvs8e4PN1qi0nGOTDLTys4eiFVXjNSJMUReJH6OF1fPfLnRKaYCgp3hUbidnrjL8xsTEOzQaZispqfc4suNoPpbRAg
      const response = await googleLoginAPI(reqBody);
      console.log(response, "response");

      if (response?.success) {
        localStorage.setItem("token", response?.data?.token);
        dispatch(
          login({ user: response?.data?.user, token: response?.data?.token })
        );
        toast.success(response?.message);
        // window.location.reload();
        handleClose();
      } else {
        toast.error(response?.message || "Something went wrong?");
      }
    } catch (error: unknown) {
      console.log(error, "Error");

      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("Something went wrong");
      }
    }
  };
  return (
    <>
      <ModalSignup isOpen={isOpen} onClose={handleClose}>
        <h2 className="text-xl  text-black dark:text-white font-bold mb-4">
          {isLogin ? " Login your account" : " Create your account"}
        </h2>

        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <div className="w-full flex justify-center mt-10">
            <div className="w-full max-w-md">
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  const token: string = credentialResponse.credential || "";
                  const userInfo = jwtDecode(token);
                  console.log("User Info:", userInfo);
                  await loginWithGoogle(token);
                }}
                onError={() => toast.error("Login Failed")}
                width="100%"
                theme="filled_blue"
                shape="square"
                size="large"
                containerProps={{
                  style: {
                    width: "100%",
                    borderRadius: "0px",
                    overflow: "hidden",
                  },
                }}
              />
            </div>
          </div>
        </GoogleOAuthProvider>

        <div className="bg-black dark:bg-gray-50 dark:text-black hover:text-gray-800 hover:dark:bg-white hover:bg-black/85 w-full p-3 text-center text-white rounded-lg mt-3 mb-3 cursor-pointer">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            fill="currentColor"
            className="bi bi-apple w-5 h-5 inline-block mr-4"
            viewBox="0 0 16 16"
          >
            <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
            <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
          </svg>
          Continue with Apple
        </div>
        <div
          onClick={handleRegister}
          className="border border-gray-600/15 hover:bg-gray-200 hover:dark:bg-transparent w-full p-3 text-center text-gray-800 dark:text-gray-200 dark:border-gray-300 rounded-lg mb-3 cursor-pointer"
        >
          <span className="w-5 h-5 fill-current mr-4 inline-block">@</span>
          Continue with Email
        </div>
      </ModalSignup>
      <Register
        isLogin={isLogin}
        handleClose={handleRegisterClose}
        isOpen={registerOpen}
      />
    </>
  );
}
