import React, { useContext, useEffect, useState } from "react";
import { HiUser } from "react-icons/hi2";
import { IoMdCheckmarkCircle } from "react-icons/io";
import { IoEyeOffOutline, IoEyeOutline } from "react-icons/io5";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/api";
import { MdCheckCircleOutline } from "react-icons/md";
import Cookies from "universal-cookie";
import { MyContext } from "../context/MyContext";
function LoginPage() {
  const [userData, setUserData] = useState({});
  const [inputValue, setInputValue] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [eye, setEye] = useState(false);
  const [rememberMe, setRememberMe] = useState(
    localStorage.getItem("rememberMe") ? true : false
  );
  const navigate = useNavigate();
  const cookies = new Cookies();
  const { loggedInUserData, setLoggedInUserData } = useContext(MyContext);



  
  // handle remember me
  useEffect(() => {
    const rememberMe = localStorage.getItem("rememberMe");
    if (rememberMe) {
      setRememberMe(true);
      const savedEmail = localStorage.getItem("email");
      const savedPassword = localStorage.getItem("password");
      setInputValue({
        email: savedEmail || "",
        password: savedPassword || "",
      });
    }
  }, []);

  // handle change
  const changeHandle = (e) => {
    const { name, value } = e.target;
    setError("");
    setInputValue({
      ...inputValue,
      [name]: value,
    });
    setRememberMe(false);
  };

  // handle show or hide password
  const eyeHandle = () => {
    setEye(!eye);
  };

  // handle remember me
  const rememberMeHandle = () => {
    if (!rememberMe) {
      localStorage.setItem("email", inputValue.email);
      localStorage.setItem("password", inputValue.password);
    } else {
      localStorage.removeItem("email");
      localStorage.removeItem("password");
    }
    localStorage.setItem("rememberMe", !rememberMe);
    setRememberMe(!rememberMe);
  };

  // login api calling
  const loginHandle = async () => {
    try {
      setError("");
      setLoading(true);

      if (!inputValue.email) {
        setError("Please enter a valid email address");
        setLoading(false);
        return;
      }

      // Password validation
      if (!inputValue.password) {
        setError("Password must be required");
        setLoading(false);
        return;
      }

      const res = await login(inputValue);

      if (res.data?.data?.accessToken) {
        const { user, accessToken } = res.data.data;
        setUserData(user);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
        setLoggedInUserData(user);
        // cookies.set("token", accessToken);
        // cookies.set("user", user);
        navigate("/dashboard");
      } else {
        setError("Invalid response from server");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError(`${error.response.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center">
      <div className="min-w-[400px] bg-blue-300 min-h-[300px] shadow-sm rounded-md flex flex-col justify-start items-center gap-4 px-12 py-10">
        <div className="flex flex-col justify-center items-center">
          <HiUser className="text-[100px] text-white" />
          <h1 className="uppercase text-[25px] text-white">user login</h1>
        </div>

        <div className="flex flex-col gap-5 w-full">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
              {error}
            </div>
          )}
          <input
            type="text"
            className="w-full rounded-md outline-none py-2 px-3 border-2 border-white focus:shadow-md bg-[#fffffff5] text-gray-400"
            placeholder="Enter Email..."
            onChange={(e) => changeHandle(e)}
            name="email"
            value={inputValue?.email}
            autoComplete="email"
          />
          <div className="relative">
            <input
              type={`${eye ? "text" : "password"}`}
              className="w-full rounded-md outline-none py-2 px-3 border-2 border-white focus:shadow-md bg-[#fffffff5] text-gray-400"
              placeholder="Enter Password..."
              onChange={(e) => changeHandle(e)}
              name="password"
              value={inputValue?.password}
              autoComplete="password"
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

          <div className="flex justify-between items-center">
            <span className="text-gray-500 uppercase text-sm cursor-pointer select-none flex items-center gap-2">
              {/* {rememberMe ? <IoMdCheckmarkCircle className='text-[25px]' onClick={rememberMeHandle} /> : <MdCheckCircleOutline className='text-[25px]' onClick={rememberMeHandle} />} */}
              <input
                type="checkbox"
                className="w-[20px] h-[20px] border-2 border-white"
                checked={rememberMe}
                onChange={rememberMeHandle}
              />
              <span
                className="capitalize text-white text-[15px]"
                onClick={rememberMeHandle}
              >
                remember me
              </span>
            </span>
            <span className="text-blue-800 underline capitalize text-[15px] cursor-pointer select-none">
              forgot password?
            </span>
          </div>

          <button
            className={`mt-auto bg-[#0075ff] active:shadow-lg rounded-md text-white w-full py-2 ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={loginHandle}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <Link
            to="/register"
            className="text-blue-800 underline capitalize text-[15px] cursor-pointer select-none mx-auto"
          >
            Dont have an account? Register
          </Link>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
