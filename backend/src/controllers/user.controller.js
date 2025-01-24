import { User } from "../models/user.models.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import {
  uploadOnCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinary.js";
import { Todo } from "../models/todo.models.js";

const generateAccessAndRefreshToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    // refresh token send in existing user
    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    // access token and refresh token return
    return { accessToken, refreshToken };
  } catch (error) {
    // throw new ApiError(500, "something went wrong while generating access and refresh token")
    return res
      .status(500)
      .json(
        new ApiError(
          500,
          "something went wrong while generating access and refresh token"
        )
      );
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const {
    fname,
    lname,
    gender,
    mobile,
    email,
    username,
    password,
    termsCondition,
  } = req.body;

  // Validate required fields
  if (!fname)
    return res.status(400).json(new ApiError(400, "first name is required"));
  if (!lname)
    return res.status(400).json(new ApiError(400, "last name is required"));
  if (!gender)
    return res.status(400).json(new ApiError(400, "gender is required"));
  if (!mobile)
    return res.status(400).json(new ApiError(400, "mobile no. is required"));
  if (!email)
    return res.status(400).json(new ApiError(400, "email is required"));
  if (!username)
    return res.status(400).json(new ApiError(400, "username is required"));
  if (!password)
    return res.status(400).json(new ApiError(400, "password is required"));
  if (!termsCondition)
    return res
      .status(400)
      .json(new ApiError(400, "Terms and condition is required"));

  if (gender !== "male" && gender !== "female" && gender !== "other") {
    return res.status(400).json(new ApiError(400, "gender is required"));
  }

  //   if (termsCondition !== "true") {
  //     return res
  //       .status(400)
  //       .json(new ApiError(400, "Please accept terms and condition"));
  //   }

  // check if user already exists
  const existingUser = await User.findOne({
    $or: [{ email }, { username }],
  });
  if (existingUser) {
    return res.status(400).json(new ApiError(400, "User already exists"));
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage
    ? req.files?.coverImage[0]?.path
    : "";

  if (!avatarLocalPath) {
    console.error("Avatar file path is required");
    return res.status(400).json(new ApiError(400, "Avatar file is required"));
  }

  console.log("Avatar file path:", avatarLocalPath);

  const avatar = await uploadOnCloudinary(avatarLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar || undefined) {
    return res.status(400).json(new ApiError(400, "avatar upload failed"));
  }

  // create user
  const user = await User.create({
    fname,
    lname,
    gender,
    mobile,
    email,
    username,
    password,
    termsCondition,
    avatar: avatar?.url,
    coverImage: coverImage?.url || "",
  });

  // remove password and refreshToken from user
  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  if (!createdUser) {
    return res.status(500).json(new ApiError(500, "Failed to create user"));
  }

  return res
    .status(200)
    .json(new ApiResponse(200, createdUser, "User registered successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;

  // all fields are required
  if (!(username || email)) {
    return res
      .status(400)
      .json(new ApiError(400, "Username or Email is required"));
  }

  // check username or email
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (!user) {
    return res
      .status(400)
      .json(new ApiError(400, "username or email is incorrect"));
  }

  // check password
  const isPasswordCorrect = await user.isPasswordCorrect(password);
  if (!isPasswordCorrect) {
    return res.status(400).json(new ApiError(400, "Password is incorrect"));
  }

  // generate access and refresh token
  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  // remove password and refreshToken from user
  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  // access token and refresh token send in cookies
  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(
      new ApiResponse(
        200,
        {
          user: loggedInUser,
          accessToken,
          refreshToken,
        },
        "User logged in successfully"
      )
    );
});

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { refreshToken: "" },
    { new: true }
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  // If using cookies, clear them
  if (req.cookies?.accessToken || req.cookies?.refreshToken) {
    return res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json(new ApiResponse(200, null, "User logged out successfully"));
  }

  // If using Bearer token, just send success response
  return res
    .status(200)
    .json(new ApiResponse(200, null, "User logged out successfully"));
});

const updateCurrentPassword = asyncHandler(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json(new ApiError(400, "All fields are required"));
  }

  const user = await User.findById(req.user._id);

  const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
  if (!isPasswordCorrect) {
    return res.status(400).json(new ApiError(400, "Old password is incorrect"));
  }

  // await User.findByIdAndUpdate(req.user._id, { password: newPassword }, { new: true })
  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, null, "Password updated successfully"));
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const { fname, lname, email, mobile, username, gender } = req.body;

  if (!fname)
    return res.status(400).json(new ApiError(400, "first name is required"));
  if (!lname)
    return res.status(400).json(new ApiError(400, "last name is required"));
  if (!gender)
    return res.status(400).json(new ApiError(400, "gender is required"));
  if (!username)
    return res.status(400).json(new ApiError(400, "username is required"));
  if (!mobile)
    return res.status(400).json(new ApiError(400, "mobile no. is required"));
  if (!email)
    return res.status(400).json(new ApiError(400, "email is required"));

  const currentUser = await User.findById(req.user._id);

  if (username !== currentUser.username) {
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      return res.status(400).json(new ApiError(400, "Username already exists"));
    }
  }

  if (email !== currentUser.email) {
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json(new ApiError(400, "Email already exists"));
    }
  }

  if (mobile !== currentUser.mobile) {
    const existingMobile = await User.findOne({ mobile });
    if (existingMobile) {
      return res
        .status(400)
        .json(new ApiError(400, "Mobile number already exists"));
    }
  }

  // Update user details // const updatedUser = await User.findByIdAndUpdate(req.user._id, { fname, lname, email, mobile, username }, { new: true })

  currentUser.fname = fname;
  currentUser.lname = lname;
  currentUser.gender = gender;
  currentUser.username = username;
  currentUser.mobile = mobile;
  currentUser.email = email;
  await currentUser.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(currentUser._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "User profile updated successfully")
    );
});

const regenerateAccessToken = asyncHandler(async (req, res) => {
  const incomignRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomignRefreshToken) {
    return res.status(400).json(new ApiError(400, "Refresh token is required"));
  }

  const decoded = jwt.verify(
    incomignRefreshToken,
    process.env.REFRESH_TOKEN_SECRET
  );

  const user = await User.findById(decoded._id);
  if (!user) {
    return res.status(401).json(new ApiError(401, "Unauthorized"));
  }

  if (incomignRefreshToken !== user.refreshToken) {
    return res
      .status(401)
      .json(new ApiError(401, "Refresh token is invalid or expired"));
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    user._id
  );

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, null, "Access token regenerated successfully"));
});

const getUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select(
    "-password -refreshToken"
  );
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User details fetched successfully"));
});

const updateUserAvatar = asyncHandler(async (req, res) => {
  const avatarLocalPath = req.file?.path;

  if (!avatarLocalPath) {
    return res.status(400).json(new ApiError(400, "avatar file is required"));
  }

  const avatar = await uploadOnCloudinary(avatarLocalPath);

  if (!avatar) {
    return res.status(400).json(new ApiError(400, "avatar upload failed"));
  }

  // const user = await User.findByIdAndUpdate(req.user._id, { avatar: avatar?.url }, { new: true })

  const user = await User.findById(req.user._id);
  user.avatar = avatar?.url;
  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(new ApiResponse(200, updatedUser, "Avatar updated successfully"));
});

const updateUserCoverImage = asyncHandler(async (req, res) => {
  const coverImageLocalPath = req.file?.path;

  if (!coverImageLocalPath) {
    return res
      .status(400)
      .json(new ApiError(400, "cover image file is required"));
  }

  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!coverImage) {
    return res.status(400).json(new ApiError(400, "Cover image upload failed"));
  }

  // const user = await User.findByIdAndUpdate(req.user._id, { coverImage: coverImage?.url }, { new: true })

  const user = await User.findById(req.user._id);
  user.coverImage = coverImage?.url;
  await user.save({ validateBeforeSave: false });

  const updatedUser = await User.findById(user._id).select(
    "-password -refreshToken"
  );

  return res
    .status(200)
    .json(
      new ApiResponse(200, updatedUser, "Cover image updated successfully")
    );
});

const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json(new ApiError(400, "User ID is required"));
  }

  const user = await User.findById(id);

  if (!user) {
    return res.status(404).json(new ApiError(404, "User not found"));
  }

  // Delete avatar and cover image from cloudinary
  if (user.avatar) {
    await deleteFromCloudinary(user.avatar);
  }

  if (user.coverImage) {
    await deleteFromCloudinary(user.coverImage);
  }

  // Delete user from database
  await user.deleteOne();

  // Delete all todos of the user
  await Todo.deleteMany({ user_id: user._id });

  const options = {
    httpOnly: true,
    secure: true,
  };

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, null, "User deleted successfully"));
});

export {
  registerUser,
  loginUser,
  logoutUser,
  getUserDetails,
  updateCurrentPassword,
  updateUserDetails,
  regenerateAccessToken,
  updateUserAvatar,
  updateUserCoverImage,
  deleteUser,
};
