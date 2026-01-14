import { UserProfileData } from "@/utils/typesInterface";
import { Backdrop, Box, CircularProgress, Fade, Modal } from "@mui/material";
import { useFormik } from "formik";
import { useTheme } from "next-themes";
import Image from "next/image";
import React, { useState } from "react";
import * as Yup from "yup";

interface userDetailProps {
  username: string;
  email: string;
}
interface ModalProps {
  isOpen: boolean;
  handleClose: () => void;
  userDetails: UserProfileData | null;
}

const userUpdateSchema = Yup.object().shape({
  userName: Yup.string()
    .required("Name is required")
    .min(4, "Must be at least 4 characters"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  image: Yup.string().required("Profile image is required"),
});

export default function UpdateProfile({
  isOpen,
  handleClose,
  userDetails,
}: ModalProps) {
  const { theme } = useTheme();
  const [isLoader, setIsLoader] = useState(false);

  const users = userDetails?.user as userDetailProps;
  console.log(users, "userDetails");

  const formik = useFormik({
    initialValues: {
      userName: users?.username || "",
      email: users?.email || "",
      image: "",
    },
    validationSchema: userUpdateSchema,
    enableReinitialize: true,
    onSubmit: async (values) => {
      setIsLoader(true);

      // 🔥 API call here
      console.log("Updated Data:", values);

      // setTimeout(() => {
      //   setIsLoader(false);
      //   handleClose();
      // }, 1500);
    },
  });

  /* IMAGE HANDLER */
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onloadend = () => {
      formik.setFieldValue("image", reader.result);
    };
    reader.readAsDataURL(file);
  };

  const handleCloseModal = () => {
    formik.resetForm();
    handleClose();
  };

  return (
    <Modal
      open={isOpen}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 300,
        sx: {
          backdropFilter: "blur(10px)",
          backgroundColor:
            theme === "dark"
              ? "rgba(15, 23, 42, 0.7)"
              : "rgba(255,255,255,0.7)",
        },
      }}
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
          className=" dark:bg-[#0f172a] w-full max-w-[380px] lg:max-w-[520px] rounded-2xl p-6 lg:p-8 shadow-xl outline-none"
        >
          {/* HEADER */}
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold dark:text-white text-gray-900">
              Update Profile
            </h2>
            <button
              onClick={handleCloseModal}
              className="text-gray-400 cursor-pointer hover:text-gray-600 dark:hover:text-gray-200"
            >
              ✕
            </button>
          </div>

          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
            {/* IMAGE PICKER */}
            <div>
              <label className="text-sm font-medium dark:text-gray-300 text-gray-800">
                Profile Image
              </label>

              <div className="mt-2">
                <label
                  htmlFor="image"
                  className="relative flex items-center justify-center w-full h-36 border-2 border-dashed rounded-xl cursor-pointer 
                  border-gray-300 dark:border-gray-600 hover:border-blue-500 transition"
                >
                  {formik.values.image ? (
                    <Image
                      src={formik.values.image}
                      alt="Preview"
                      className="h-full w-full object-cover rounded-xl"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-gray-400  ">
                      <span className="text-2xl">📷</span>
                      <span className="text-sm">Click to upload</span>
                    </div>
                  )}

                  <input
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </label>
              </div>

              {formik.touched.image && formik.errors.image && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.image}
                </p>
              )}
            </div>

            {/* NAME */}
            <div>
              <label className="text-sm font-medium dark:text-gray-300 text-gray-800 ">
                Name
              </label>
              <input
                type="text"
                name="userName"
                value={formik.values.userName}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full mt-1 px-4 py-3 rounded-xl border 
                border-gray-300 dark:border-gray-600 bg-transparent 
                dark:text-white border-gray-800 focus:outline-none placeholder:text-gray-200  focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your name"
              />
              {formik.touched.userName && formik.errors.userName && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.userName as string}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div>
              <label className="text-sm font-medium dark:text-gray-300 text-gray-800">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="w-full mt-1 px-4 py-3 rounded-xl border 
                border-gray-300 dark:border-gray-600 bg-transparent 
                dark:text-white focus:outline-none placeholder:text-gray-600 focus:ring-2 focus:ring-blue-500"
                placeholder="Enter your email"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-xs mt-1">
                  {formik.errors.email as string}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoader}
              className="w-full py-3 rounded-xl text-lg font-semibold text-white
              bg-gradient-to-r from-sky-500 to-blue-500
              hover:from-sky-600 hover:to-blue-600
              transition-all flex items-center justify-center"
            >
              {isLoader ? (
                <CircularProgress size={26} sx={{ color: "white" }} />
              ) : (
                "Update Profile"
              )}
            </button>
          </form>
        </Box>
      </Fade>
    </Modal>
  );
}
