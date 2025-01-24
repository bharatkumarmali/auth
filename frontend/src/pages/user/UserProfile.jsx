import React, { useContext, useEffect, useRef, useState } from "react";
import Header from "../../components/Header";
import {
  getUserDetails,
  userUpdateDetails,
  userUpdatePhoto,
} from "../../api/api";
import { RxCross2 } from "react-icons/rx";
import { FaCheck } from "react-icons/fa6";
import { MyContext } from "../../context/MyContext";

function UserProfile() {
  const [userData, setUserData] = useState({});
  const { loggedInUserData, setLoggedInUserData } = useContext(MyContext);
  const [inputValue, setInputValue] = useState({
    fname: loggedInUserData?.fname || "",
    lname: loggedInUserData?.lname || "",
    gender: loggedInUserData.gender || "",
    username: loggedInUserData?.username || "",
    email: loggedInUserData?.email || "",
    mobile: loggedInUserData?.mobile || "",
    password: loggedInUserData?.password || "",
    cPassword: loggedInUserData?.password || "",
    avatar: loggedInUserData?.avatar || "",
  });

  const [isModalOpenEditUserDetails, setisModalOpenEditUserDetails] =
    useState(false);
  const [isModalOpenProfilePhoto, setIsModalOpenProfilePhoto] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [userProfileUrl, setUserProfileUrl] = useState(null);
  const [togglePhotoChange, setTogglePhotoChange] = useState(false);
  const profileInputRef = useRef(null);

  // useEffect(() => {
  //     getUserDetailsHandle();
  // }, []);

  useEffect(() => {
    if (loggedInUserData) {
      setInputValue({
        fname: loggedInUserData.fname || "",
        lname: loggedInUserData.lname || "",
        gender: loggedInUserData.gender || "",
        username: loggedInUserData.username || "",
        email: loggedInUserData.email || "",
        mobile: loggedInUserData.mobile || "",
        password: "", // Keep password fields empty for security
        cPassword: "",
        avatar: loggedInUserData.avatar || "",
      });
    }
  }, [loggedInUserData]);

  // toggle modal
  const toggleModalEditUserDetails = () => {
    setisModalOpenEditUserDetails(!isModalOpenEditUserDetails);
  };

  // toggle modal profile photo
  const toggleModalProfilePhoto = () => {
    setIsModalOpenProfilePhoto(!isModalOpenProfilePhoto);
    setUserProfileUrl("");
    setError("");
  };

  // handle change
  const changeHandle = (e) => {
    const { name, value } = e.target;
    setError("");

    setInputValue((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // handle change
  const changeImageHandle = (e) => {
    const { name, files } = e.target;
    setError("");

    if (files && files.length > 0) {
      setInputValue((prevState) => ({
        ...prevState,
        [name]: files[0],
      }));

      setTogglePhotoChange(true);

      setUserProfileUrl(URL.createObjectURL(files[0]));
    } else {
      setError("No file selected");
    }
  };

  // get user details api calling
  // const getUserDetailsHandle = async () => {
  //     try {
  //         const res = await getUserDetails();
  //         if (res.status === 200) {
  //             // setUserData(res.data.data);
  //         }
  //     } catch (error) {
  //         console.error("User details error:", error);
  //     }
  // }

  // update user api calling
  const userUpdateHandle = async () => {
    try {
      setError("");
      setLoading(true);

      if (!inputValue.fname) {
        setError("First name is required");
        setLoading(false);
        return;
      } else if (!inputValue.username) {
        setError("Username is required");
        setLoading(false);
        return;
      } else if (!inputValue.email) {
        setError("Email is required");
        setLoading(false);
        return;
      }

      // console.log("FormData before update:");
      // logFormData(formData);

      const data = {
        fname: inputValue.fname,
        lname: inputValue.lname,
        gender: inputValue.gender,
        username: inputValue.username,
        mobile: inputValue.mobile,
        email: inputValue.email,
      };

      const res = await userUpdateDetails(data);
      if (res.status === 200) {
        localStorage.setItem("user", JSON.stringify(res.data.data));

        setLoggedInUserData(res.data.data);
        toggleModalEditUserDetails();
        // getUserDetailsHandle();
        console.log("Update successful:", res);
      } else {
        console.error("Update failed with status:", res.status);
      }
    } catch (error) {
      console.error("Update error:", error);
      setError(`${error.response.data.message}`);
    } finally {
      setLoading(false);
    }
  };

  // update user photo api calling
  const userUpdatePhotoHandle = async () => {
    setLoading(true);
    const formData = new FormData();
    formData.append("avatar", inputValue.avatar);

    try {
      const res = await userUpdatePhoto(formData);
      if (res.status === 200) {
        console.log(res.data.data);

        localStorage.setItem("user", JSON.stringify(res.data.data));
        setLoggedInUserData(res.data.data);
        // getUserDetailsHandle();
        // toggleModalProfilePhoto();
        setError("");
        setTogglePhotoChange(false);

        console.log("Update photo successful:", res);
        setLoading(false);
      } else {
        console.error("Update photo failed with status:", res.status);
      }
    } catch (error) {
      console.error("Update photo error:", error);
      setError(`${error.response.data.message}`);
    }
  };

  console.log(inputValue);
  return (
    <div>
      <Header />

      <div className="container mx-auto flex items-top gap-10 w-full p-4 mt-16">
        <div>
          <div className="relative w-40 h-40">
            <img
              src={`${userProfileUrl || loggedInUserData?.avatar}`}
              alt="profile photo"
              className="w-full h-full object-cover"
            />
            <input
              type="file"
              className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
              onChange={(e) => changeImageHandle(e)}
              name="avatar"
              //   disabled={true}
              ref={profileInputRef}
              onClick={() => profileInputRef.current.click()}
            />
          </div>

          {togglePhotoChange ? (
            <div className="relative flex items-center gap-3">
              <span
                className="relative left-[5px] mt-[10px] mb-1 text-sm underline cursor-pointer active:text-blue-700 select-none w-fit"
                onClick={() => {
                  userUpdatePhotoHandle();
                }}
              >
                <FaCheck />
              </span>
              <span
                className="relative left-[5px] mt-[10px] mb-1 text-sm underline cursor-pointer active:text-blue-700 select-none w-fit"
                onClick={() => {
                  setTogglePhotoChange(false);
                  setUserProfileUrl("");
                }}
              >
                <RxCross2 className="text-[19px]" />
              </span>
            </div>
          ) : (
            <span
              className="text-sm underline capitalize text-blue-700 cursor-pointer w-fit"
              onClick={() => {
                // toggleModalProfilePhoto();
                profileInputRef.current.click();
                console.log(profileInputRef.current);
              }}
            >
              edit profile
            </span>
          )}
        </div>

        <table className="" cellPadding={5}>
          <tbody>
            <tr></tr>
            <tr>
              <td>
                <h3 className="font-semibold">Name : </h3>
              </td>
              <td>{loggedInUserData?.fname + " " + loggedInUserData?.lname}</td>
            </tr>
            <tr>
              <td>
                <h3 className="font-semibold">Gender : </h3>
              </td>
              <td>{loggedInUserData?.gender}</td>
            </tr>
            <tr>
              <td>
                <h3 className="font-semibold">Username : </h3>
              </td>
              <td>{loggedInUserData?.username}</td>
            </tr>
            <tr>
              <td>
                <h3 className="font-semibold">Mobile : </h3>
              </td>
              <td>{loggedInUserData?.mobile}</td>
            </tr>
            <tr>
              <td>
                <h3 className="font-semibold">Email : </h3>
              </td>
              <td>{loggedInUserData?.email}</td>
            </tr>
          </tbody>
        </table>

        <span
          className="h-fit ms-auto text-white bg-green-500 cursor-pointer uppercase rounded-md px-2 py-1"
          onClick={() => {
            toggleModalEditUserDetails();

            // getUserDetailsHandle();
            setError("");
            setUserProfileUrl("");
          }}
        >
          edit details
        </span>
      </div>

      {/* Modal backdrop */}
      {isModalOpenEditUserDetails && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleModalEditUserDetails}
        ></div>
      )}
      {/* Main modal - user details edit */}
      <div
        className={`${
          isModalOpenEditUserDetails ? "flex" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* Modal content */}
          <div className="relative bg-white border border-gray-300 rounded-lg shadow">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold ">Update Profile</h3>
              <button
                type="button"
                onClick={() => {
                  toggleModalEditUserDetails();
                  setError("");
                }}
                className="text-gray-400 bg-transparent hover:bg-gray-200  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="flex flex-col gap-5 w-full px-5 pt-3 pb-7">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded flex justify-between items-center">
                  {error}{" "}
                  <RxCross2
                    className="text-[20px] cursor-pointer"
                    onClick={() => setError("")}
                  />{" "}
                </div>
              )}

              <div className="grid grid-cols- sm:grid-cols-2 gap-4 sm:gap-3">
                <input
                  type="text"
                  className="w-full rounded-md outline-none py-2 px-3 border-2 border-gray-300 focus:shadow-md bg-[#fffffff5] text-gray-400"
                  placeholder="First name..."
                  onChange={(e) => changeHandle(e)}
                  name="fname"
                  value={inputValue?.fname}
                  autoComplete="fname"
                />

                <input
                  type="text"
                  className="w-full rounded-md outline-none py-2 px-3 border-2 border-gray-300 focus:shadow-md bg-[#fffffff5] text-gray-400"
                  placeholder="Last name..."
                  onChange={(e) => changeHandle(e)}
                  name="lname"
                  value={inputValue?.lname}
                  autoComplete="lname"
                />
              </div>

              <div className="flex gap-10 items-center rounded-md border-2 border-gray-300">
                <span className="flex items-center gap-2 select-none capitalize w-full">
                  <select
                    name="gender"
                    id="gender"
                    value={inputValue.gender}
                    onChange={(e) => changeHandle(e)}
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

              <div className="grid grid-cols- sm:grid-cols-2 gap-4 sm:gap-3">
                <input
                  type="text"
                  className="w-full rounded-md outline-none py-2 px-3 border-2 border-gray-300 focus:shadow-md bg-[#fffffff5] text-gray-400"
                  placeholder="Username..."
                  onChange={(e) => changeHandle(e)}
                  name="username"
                  value={inputValue?.username}
                  autoComplete="username"
                />

                <input
                  type="number"
                  className="w-full rounded-md outline-none py-2 px-3 border-2 border-gray-300 focus:shadow-md bg-[#fffffff5] text-gray-400"
                  placeholder="Mobile number..."
                  onChange={(e) => changeHandle(e)}
                  name="mobile"
                  value={inputValue?.mobile}
                  autoComplete="mobile"
                />
              </div>

              <input
                type="text"
                className="w-full rounded-md outline-none py-2 px-3 border-2 border-gray-300 focus:shadow-md bg-[#fffffff5] text-gray-400"
                placeholder="Email id..."
                onChange={(e) => changeHandle(e)}
                name="email"
                value={inputValue?.email}
                autoComplete="email"
              />

              <button
                className={`mt-auto bg-green-500 active:shadow-lg rounded-md text-white font-semibold w-full py-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={userUpdateHandle}
                disabled={loading}
              >
                {loading ? "Logging in..." : "Save"}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Modal backdrop profile photo */}
      {isModalOpenProfilePhoto && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleModalProfilePhoto}
        ></div>
      )}
      {/* Main modal profile photo */}
      <div
        className={`${
          isModalOpenProfilePhoto ? "flex" : "hidden"
        } overflow-y-auto overflow-x-hidden fixed top-0 right-0 left-0 z-50 justify-center items-center w-full md:inset-0 h-[calc(100%-1rem)] max-h-full`}
      >
        <div className="relative p-4 w-full max-w-md max-h-full">
          {/* Modal content */}
          <div className="relative bg-white rounded-lg shadow">
            {/* Modal header */}
            <div className="flex items-center justify-between p-4 md:p-5 border-b rounded-t">
              <h3 className="text-lg font-semibold ">
                Update user profile photo
              </h3>
              <button
                type="button"
                onClick={() => {
                  toggleModalProfilePhoto();
                }}
                className="text-gray-400 bg-transparent hover:bg-gray-200  rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:text-white"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
                <span className="sr-only">Close modal</span>
              </button>
            </div>

            <div className="flex flex-col gap-5 w-full px-4 py-1">
              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded flex justify-between items-center">
                  {error}{" "}
                  <RxCross2
                    className="text-[20px] cursor-pointer"
                    onClick={() => setError("")}
                  />{" "}
                </div>
              )}
              <div className="relative w-28 h-28 overflow-hidden mx-auto">
                {userProfileUrl ? (
                  <img
                    src={userProfileUrl}
                    alt="profile photo"
                    className="w-full h-full object-cover hover:opacity-50"
                  />
                ) : (
                  <img
                    src={loggedInUserData?.avatar}
                    alt="profile photo"
                    className="w-full h-full object-cover hover:opacity-50"
                  />
                )}
                {/* <input
                  type="file"
                  className="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
                  onChange={(e) => changeImageHandle(e)}
                  name="avatar"
                /> */}
              </div>

              <button
                className={`mt-auto bg-green-500 active:shadow-lg rounded-md text-white font-semibold w-full py-2 ${
                  loading ? "opacity-50 cursor-not-allowed" : ""
                }`}
                onClick={userUpdatePhotoHandle}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;


