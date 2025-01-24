import React, { useState } from 'react'
import Header from '../components/Header'

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [inputValue, setInputValue] = useState({
    fname: "",
    lname: "",
    username: "",
    email: "",
    mobile: "",
    password: "",
    cPassword: "",
    avatar: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [eye, setEye] = useState(false);

  // toggle modal
  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };


  // handle change
  const changeHandle = (e) => {
    const { name, value, files } = e.target;
    setError("");
    setInputValue({
      ...inputValue,
      [name]: files ? files[0] : value
    });
  };

  // handle show or hide password
  const eyeHandle = () => {
    setEye(!eye);
  };


  // update user api calling
  const userUpdateHandle = async () => {
    try {
      setError("");
      setLoading(true);

      if (!inputValue.fname) {
        setError("First name is required");
        setLoading(false);
        return;
      }
      else if (!inputValue.username) {
        setError("Username is required");
        setLoading(false);
        return;
      }
      else if (!inputValue.email) {
        setError("Email is required");
        setLoading(false);
        return;
      }
      else if (!inputValue.password) {
        setError("Password is required");
        setLoading(false);
        return;
      }
      else if (!inputValue.cPassword) {
        setError("Confirm password is required");
        setLoading(false);
        return;
      }
      else if (inputValue.password !== inputValue.cPassword) {
        setError("Password and confirm password do not match");
        setLoading(false);
        return;
      }



      const formData = new FormData();
      formData.append("fname", inputValue.fname);
      formData.append("lname", inputValue.lname);
      formData.append("username", inputValue.username);
      formData.append("email", inputValue.email);
      formData.append("mobile", inputValue.mobile);
      formData.append("password", inputValue.password);
      formData.append("avatar", inputValue.avatar);

      console.log(formData)

      const res = await register(formData);
      if (res.status === 200) {
        console.log(res);
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <Header />

     
    </div>
  )
}

export default Dashboard