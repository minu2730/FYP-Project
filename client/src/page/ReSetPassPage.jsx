import passwordToggle from "../hooks/passwordToggle";
import { useSearchParams } from "react-router-dom";
import axiosClient from "../utils/axios.config";
import { toast } from "react-toastify";
import * as yup from "yup";
import { useFormik } from "formik";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const validationSchema = yup.object({
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(15, "Password must not be greater than 15 characters")
    .required("Password is required"),

  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
});

const ReSetPassPage = () => {
  const [search] = useSearchParams();
  const [passwordInputType, ToggleIcon] = passwordToggle();
  const [PasswordInputType2, ToggleIcon2] = passwordToggle();

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      const token = search.get("token");
      try {
        const response = await axiosClient.post("/auth/reset-password", {
          token,
          password: values.password,
        });
        toast.success(response.data.msg, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
        });
      } catch (error) {
        toast.error(error.response.data.msg, {
          position: "top-center",
          autoClose: 3000,
          closeOnClick: true,
          draggable: true,
        });
      }
    },
  });

  return (
    <>
      <Navbar isLoginPage={true} />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="w-[400px] bg-white shadow-2xl rounded-xl text-center border-orange-400 border-2 hover:shadow-2xl transition-shadow duration-500 p-8">
          <h1 className="text-2xl font-medium text-slate-800 mb-6 drop-shadow-lg">
            Reset Password
          </h1>
          <form
            onSubmit={formik.handleSubmit}
            className="flex flex-col gap-6 w-full items-start"
          >
            <Input
              label="Password"
              type={passwordInputType}
              id="password"
              placeholder="Password"
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              icon={ToggleIcon}
              error={
                formik.touched.password && formik.errors.password ? (
                  <p className="text-red-500 -mt-3 self-end">
                    {formik.errors.password}
                  </p>
                ) : null
              }
            />
            <Input
              label="Confirm Password"
              type={PasswordInputType2}
              id="confirmPassword"
              placeholder="Confirm Password"
              value={formik.values.confirmPassword}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              icon={ToggleIcon2}
              error={
                formik.touched.confirmPassword &&
                formik.errors.confirmPassword ? (
                  <p className="text-red-500 -mt-3 self-end">
                    {formik.errors.confirmPassword}
                  </p>
                ) : null
              }
            />
            <button
              type="submit"
              className="mx-auto w-[45%] h-[2.5rem] mt-6 text-xl font-medium text-white bg-slate-600 border border-slate-600 rounded-lg hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-slate-600 focus:ring-offset-2"
            >
              Reset
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

const Input = (props) => {
  const { id, type, placeholder, value, onChange, label, icon, onBlur, error } =
    props;
  return (
    <div className="flex flex-col gap-3 items-start w-full">
      <div className="flex justify-between w-full">
        <label className="text-base font-medium text-slate-900" htmlFor={id}>
          {label}
        </label>
        {error}
      </div>
      <div className="relative w-full">
        <input
          type={type}
          id={id}
          placeholder={placeholder}
          className="w-full h-[43px] px-4 py-2 text-sm text-slate-900 bg-slate-100 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
        <div className="absolute right-4 top-3 text-slate-500 cursor-pointer">
          {icon}
        </div>
      </div>
    </div>
  );
};

export default ReSetPassPage;
