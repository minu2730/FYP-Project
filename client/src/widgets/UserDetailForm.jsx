import { useState } from "react";
import * as yup from "yup";
import { useFormik } from "formik";
import axiosClient from "./../utils/axios.config";
import { toast } from "react-toastify";
import IconButton from "@mui/material/IconButton";
import InputAdornment from "@mui/material/InputAdornment";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import TextField from '@mui/material/TextField';

const UserDetailForm = ({ onSubmit }) => {
  const [showPassword, setShowPassword] = useState(false);
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const userSchema = yup.object({
    name: yup
      .string()
      .min(3, "Must be at least 3 characters long")
      .max(15, "Must be 15 characters or less")
      .required("Name is required"),
    email: yup
      .string()
      .email("Email is invalid")
      .matches(
        /^[a-zA-Z0-9 ]+@(?:[a-zA-Z0-9]+\.)+[A-Za-z]+$/,
        "Must be a valid email"
      )
      .required("Email is required"),
    password: yup
      .string()
      .min(8, "Password must be at least 8 characters")
      .required("Password is required")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z]).{8,15}$/,
        "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and one special case Character"
      ),
  });

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
    },
    validationSchema: userSchema,
    onSubmit: async (values) => {
      await axiosClient
        .post("/auth/register", values)
        .then((response) => {
          localStorage.setItem("token", response.data.token);
          toast.success(response.data.msg, {
            position: "top-center",
            autoClose: 3000,
            closeOnClick: true,
            draggable: true,
          });
          localStorage.setItem('id', response.data.user?._id);
          onSubmit();
        })
        .catch((error) => {
          toast.error(error.response.data.msg, {
            position: "top-center",
            autoClose: 3000,
            closeOnClick: true,
            draggable: true,
          });
        });
    },
  });

  return (
    <form onSubmit={formik.handleSubmit}>
      <div className="bg-white shadow-md rounded-2xl border-orange-300 border-2 p-8 mb-4 max-w-md mx-auto my-2">
        <h2 className="text-center text-2xl font-bold mb-6">User Details</h2>
        <div>
          <div className="mb-4">
            <div className="flex justify-between align-middle">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              {formik.touched.name && formik.errors.name ? (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              ) : null}
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              label="Name"
              type="text"
              id="name"
              placeholder="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
          </div>
          <div className="mb-4">
            <div className="flex justify-between align-middle">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              {formik.touched.email && formik.errors.email ? (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              ) : null}
            </div>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              label="Email"
              type="text"
              id="email"
              placeholder="Email"
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
            />
          </div>
          <div className="mb-6">
            <div className="flex justify-between align-middle">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              {formik.touched.password && formik.errors.password ? (
                <p className="text-red-500 text-sm">{formik.errors.password}</p>
              ) : null}
            </div>
            <TextField
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              label="Password"
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              required
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={toggleShowPassword}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </div>
          <div className="flex items-center justify-center">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Submit
            </button>
          </div>
        </div>
      </div>
    </form>
  );
};

export default UserDetailForm;
