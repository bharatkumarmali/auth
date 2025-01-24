import React, { useState } from "react";
import { HiUser } from "react-icons/hi2";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { login, register } from "../api/api";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { MdCheckCircleOutline } from "react-icons/md";

function RegisterPage() {
  const [inputValue, setInputValue] = useState({
    fname: "",
    lname: "",
    gender: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    cPassword: "",
    avatar: "",
    termsCondition: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [eye, setEye] = useState(false);
  const navigate = useNavigate();

  // handle change
  const changeHandle = (e) => {
    const { name, value, files, type, checked } = e.target;
    setError("");

    if (
      type === "text" ||
      type === "password" ||
      type === "email" ||
      type === "number"
    ) {
      setInputValue({
        ...inputValue,
        [name]: value,
      });
    }

    if (type === "file") {
      setInputValue({
        ...inputValue,
        [name]: files[0],
      });
    }

    if (type === "checkbox") {
      setInputValue({
        ...inputValue,
        [name]: checked,
      });
    }

    if (type === "radio") {
      setInputValue({
        ...inputValue,
        [name]: value,
      });
    }

    if (name === "gender") {
      setInputValue({
        ...inputValue,
        [name]: value,
      });
    }
  };

  // handle show or hide password
  const eyeHandle = () => {
    setEye(!eye);
  };

  // login api calling
  const registerHandle = async () => {
    try {
      setError("");
      setLoading(true);

      if (!inputValue.fname) {
        setError("First name is required");
        setLoading(false);
        return;
      } else if (!inputValue.lname) {
        setError("Last name is required");
        setLoading(false);
        return;
      } else if (!inputValue.gender) {
        setError("Gender is required");
        setLoading(false);
        return;
      } else if (!inputValue.username) {
        setError("Username is required");
        setLoading(false);
        return;
      } else if (!inputValue.mobile) {
        setError("Mobile no is required");
        setLoading(false);
        return;
      } else if (!inputValue.email) {
        setError("Email is required");
        setLoading(false);
        return;
      } else if (!inputValue.password) {
        setError("Password is required");
        setLoading(false);
        return;
      } else if (!inputValue.cPassword) {
        setError("Confirm password is required");
        setLoading(false);
        return;
      } else if (inputValue.password !== inputValue.cPassword) {
        setError("Password and confirm password do not match");
        setLoading(false);
        return;
      } else if (!inputValue.avatar || inputValue.avatar == "undefined") {
        setError("Profile is required");
        setLoading(false);
        return;
      } else if (
        !inputValue.termsCondition ||
        inputValue.termsCondition == "false"
      ) {
        setError("Accept terms and conditions");
        setLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append("fname", inputValue.fname);
      formData.append("lname", inputValue.lname);
      formData.append("gender", inputValue.gender);
      formData.append("username", inputValue.username);
      formData.append("email", inputValue.email);
      formData.append("mobile", inputValue.mobile);
      formData.append("password", inputValue.password);
      formData.append("avatar", inputValue.avatar);
      formData.append("termsCondition", inputValue.termsCondition);

      console.log(formData);

      const res = await register(formData);
      if (res.status === 200) {
        console.log(res);
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      //   setError(`${error.response.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  console.log(inputValue);
  return (
    <div className="h-screen flex justify-center items-center">
      <div className="min-w-[400px] bg-blue-300 min-h-[300px] shadow-sm rounded-md flex flex-col justify-start items-center gap-4 px-12 py-10">
        <div className="flex flex-col justify-center items-center">
          <HiUser className="text-[100px] text-white" />
          <h1 className="uppercase text-[25px] text-white">user register</h1>
        </div>

        <div className="flex flex-col gap-5 w-full">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-2 ">
            <input
              type="text"
              className="w-full rounded-md outline-none py-2 px-3 border-2 border-white focus:shadow-md bg-[#fffffff5] text-gray-400"
              placeholder="First name..."
              onChange={(e) => changeHandle(e)}
              name="fname"
              value={inputValue?.fname}
              autoComplete="fname"
            />

            <input
              type="text"
              className="w-full rounded-md outline-none py-2 px-3 border-2 border-white focus:shadow-md bg-[#fffffff5] text-gray-400"
              placeholder="Last name..."
              onChange={(e) => changeHandle(e)}
              name="lname"
              value={inputValue?.lname}
              autoComplete="lname"
            />
          </div>

          {/* <div className="flex  gap-10">
            <span className="flex justify-center items-center gap-2 select-none capitalize">
              <label htmlFor="male" className="cursor-pointer">
                Male :
              </label>
              <input
                type="radio"
                name="gender"
                id="male"
                value="male"
                className="cursor-pointer h-[20px] w-[20px] border-2 border-white"
                checked={inputValue.gender === "male"}
                onChange={(e) => changeHandle(e)}
              />
            </span>
            <span className="flex justify-center items-center gap-2 select-none capitalize">
              <label htmlFor="female" className="cursor-pointer">
                Female :
              </label>
              <input
                type="radio"
                name="gender"
                id="female"
                value="female"
                className="cursor-pointer h-[20px] w-[20px] border-2 border-white"
                checked={inputValue.gender === "female"}
                onChange={(e) => changeHandle(e)}
              />
            </span>
            <span className="flex justify-center items-center gap-2 select-none capitalize">
              <label htmlFor="other" className="cursor-pointer">
                Other :
              </label>
              <input
                type="radio"
                name="gender"
                id="other"
                value="other"
                className="cursor-pointer h-[20px] w-[20px] border-2 border-white"
                checked={inputValue.gender === "other"}
                onChange={(e) => changeHandle(e)}
              />
            </span>
          </div> */}

          <div className="flex gap-10 items-center">
            <span className="flex items-center gap-2 select-none capitalize w-full">
              <select
                name="gender"
                id="gender"
                value={inputValue.gender}
                onChange={changeHandle}
                className="rounded-md py-2 px-3 transition duration-200 focus:outline-none text-gray-400 w-full"
              >
                <option value="" disabled className="text-gray-400">
                  Select...
                </option>
                <option value="male" className="">
                  Male
                </option>
                <option value="female" className="">
                  Female
                </option>
                <option value="other" className="">
                  Other
                </option>
              </select>
            </span>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-2  ">
            <input
              type="text"
              className="w-full rounded-md outline-none py-2 px-3 border-2 border-white focus:shadow-md bg-[#fffffff5] text-gray-400"
              placeholder="Username..."
              onChange={(e) => changeHandle(e)}
              name="username"
              value={inputValue?.username}
              autoComplete="username"
            />

            <input
              type="number"
              className="w-full rounded-md outline-none py-2 px-3 border-2 border-white focus:shadow-md bg-[#fffffff5] text-gray-400"
              placeholder="Mobile number..."
              onChange={(e) => changeHandle(e)}
              name="mobile"
              value={inputValue?.mobile}
              autoComplete="mobile"
            />
          </div>

          <input
            type="text"
            className="w-full rounded-md outline-none py-2 px-3 border-2 border-white focus:shadow-md bg-[#fffffff5] text-gray-400"
            placeholder="Email id..."
            onChange={(e) => changeHandle(e)}
            name="email"
            value={inputValue?.email}
            autoComplete="email"
          />

          <div className="flex flex-col sm:flex-row gap-4 sm:gap-2  ">
            <input
              type="password"
              className="rounded-md outline-none py-2 px-3 border-2 border-white focus:shadow-md bg-[#fffffff5] text-gray-400"
              placeholder="Password..."
              onChange={(e) => changeHandle(e)}
              name="password"
              value={inputValue?.password}
              autoComplete="password"
            />

            <div className="relative">
              <input
                type={`${eye ? "text" : "password"}`}
                className="w-full rounded-md outline-none py-2 px-3 border-2 border-white focus:shadow-md bg-[#fffffff5] text-gray-400"
                placeholder="Confirm password..."
                onChange={(e) => changeHandle(e)}
                name="cPassword"
                value={inputValue?.cPassword}
                autoComplete="cPassword"
              />
              {eye ? (
                <IoEyeOffOutline
                  className="text-[20px] text-gray-500 cursor-pointer absolute right-3 top-2/4 -translate-y-2/4 select-none"
                  onClick={eyeHandle}
                />
              ) : (
                <IoEyeOutline
                  className="text-[20px] text-gray-500 cursor-pointer absolute right-3 top-2/4 -translate-y-2/4 select-none"
                  onClick={eyeHandle}
                />
              )}
            </div>
          </div>

          <input
            type="file"
            className="rounded-md outline-none py-2 px-3 border-2 border-white focus:shadow-md bg-[#fffffff5] text-gray-400"
            onChange={(e) => changeHandle(e)}
            name="avatar"
          />

          <span className="text-gray-500 uppercase text-sm cursor-pointer select-none flex items-center gap-2">
            <input
              type="checkbox"
              className="w-[20px] h-[20px] border-2 border-white"
              onChange={(e) => changeHandle(e)}
              name="termsCondition"
              checked={inputValue.termsCondition}
            />
            <code
              className="capitalize text-blue-800 text-[15px]"
              //   onClick={rememberMeHandle}
            >
              Accept terms & conditions
            </code>
          </span>

          <button
            className={`mt-auto bg-[#0075ff] active:shadow-lg rounded-md text-white w-full py-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={registerHandle}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Register now"}
          </button>
          <Link
            to="/"
            className="text-blue-800 underline capitalize text-[15px] cursor-pointer select-none mx-auto"
          >
            already have an account? login
          </Link>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
