import CustomInput from "@/components/common/CustomInput";
import ModalSignup from "@/components/Modal/Signup/page";
import { loginAPI, registerAPI } from "@/components/service/auth";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { MdEmail } from "react-icons/md";
import { TbLockFilled } from "react-icons/tb";
import * as Yup from "yup";
import CircularProgress from "@mui/material/CircularProgress";
import { useDispatch } from "react-redux";
import { login } from "@/components/store/slice/auth";
const RegisterSchema = Yup.object().shape({
  userName: Yup.string()
    .required("Email or Phone is required")
    .min(4, "Must be at least 4 characters"),
  password: Yup.string()
    .required("Password is required")
    .min(6, "Password must be at least 8 characters")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]+$/,
      "Password must contain uppercase, lowercase, number & special character"
    ),
});

function isValidEmail(email: string) {
  if (typeof email !== "string") return false;
  email = email.trim();
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

export default function Register({
  isOpen = false,
  isLogin = false,
  handleClose,
}: {
  isOpen: boolean;
  isLogin: boolean;
  handleClose: () => void;
}) {
  const [isLoader, setIsLoader] = useState(false);
  const [show, setShow] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const dispatch = useDispatch();
  console.log(isLogin, "isLogin");

  const formik = useFormik({
    initialValues: {
      userName: "",
      password: "",
    },
    validationSchema: RegisterSchema,
    onSubmit: async (values, action) => {
      const reqBody = {
        [isPhone ? "phone" : "email"]: values?.userName,
        password: values.password,
      };
      setIsLoader(true);
      if (isLogin) {
        try {
          const response = await loginAPI(reqBody);
          console.log(response, "response========");

          if (response?.success) {
            localStorage.setItem("token", response?.data?.token);
            dispatch(
              login({
                user: response?.data?.user,
                token: response?.data?.token,
              })
            );
            toast.success(response?.message);
            action.resetForm();
            window.location.reload();
            handleClose();
          } else {
            toast.error(response?.message);
          }
        } catch (error: unknown) {
          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Something went wrong");
          }
        } finally {
          setIsLoader(false);
        }
      } else {
        try {
          const response = await registerAPI(reqBody);
          console.log(response, "response");

          if (response?.success) {
            toast.success(response?.message);
            action.resetForm();
            handleClose();
          } else {
            toast.error(response?.errors?.[0]?.message || response?.message);
          }
        } catch (error: unknown) {
          console.log(error, "error===");

          if (error instanceof Error) {
            toast.error(error.message);
          } else {
            toast.error("Something went wrong");
          }
        } finally {
          setIsLoader(false);
        }
      }
    },
  });

  useEffect(() => {
    const isEmail = isValidEmail(formik.values.userName);
    if (isEmail) {
      setIsPhone(false);
    } else {
      setIsPhone(true);
    }
  }, [formik.values.userName]);

  return (
    <ModalSignup isOpen={isOpen} onClose={handleClose}>
      <div className=" flex flex-col pb-5 gap-6">
        {/* Icon */}
        <div className="mx-auto bg-white dark:bg-black/50  shadow-md rounded-2xl p-3 w-14 h-14 flex items-center justify-center">
          <FiLogOut className="text-black dark:text-white" size={28} />
        </div>

        <div className="flex flex-col gap-4">
          <h1 className="text-center text-2xl  font-semibold text-gray-900 dark:text-white">
            Sign {isLogin ? "in" : "up"} with email or Phone
          </h1>
          <p className="text-center mx-auto  text-gray-500 dark:text-gray-300 w-2/3 text-sm -mt-3">
            Make a new doc to bring your words, data, and teams together.
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
          <div>
            {" "}
            <CustomInput
              placeholder="Email Or Phone"
              name="userName"
              value={formik.values.userName}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.userName ? formik.errors.userName : ""}
              startIcon={<MdEmail className="text-gray-400 " size={22} />}
            />
          </div>
          <div>
            <CustomInput
              type={show ? "text" : "password"}
              placeholder="Password"
              name="password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              error={formik.touched.password ? formik.errors.password : ""}
              startIcon={<TbLockFilled className="text-gray-400" size={22} />}
              endIcon={
                show ? (
                  <FaRegEye
                    size={22}
                    className="text-gray-600 dark:text-gray-400 cursor-pointer"
                    onClick={() => setShow(false)}
                  />
                ) : (
                  <FaRegEyeSlash
                    size={22}
                    className="text-gray-600 dark:text-gray-400 cursor-pointer"
                    onClick={() => setShow(true)}
                  />
                )
              }
            />
          </div>

          {/* Forgot */}
          {isLogin && (
            <div className="text-end text-sm text-gray-600 cursor-pointer hover:underline">
              Forgot password?
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 flex items-center justify-center  rounded-xl  text-lg  font-semibold  text-white hover:cursor-pointer shadow-lg bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 transition-all duration-300
  "
          >
            {isLoader ? (
              <CircularProgress size={28} className="!text-white" />
            ) : (
              `Sign${isLogin ? "In" : "Up"}`
            )}{" "}
          </button>
        </form>
      </div>
    </ModalSignup>
  );
}
