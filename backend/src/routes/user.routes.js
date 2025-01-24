import { Router } from "express";
import {
    deleteUser,
    getUserDetails,
    loginUser,
    logoutUser,
    regenerateAccessToken,
    registerUser,
    updateCurrentPassword,
    updateUserAvatar,
    updateUserCoverImage,
    updateUserDetails
} from "../controllers/user.controller.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.middleware.js";

const userRouter = Router();


// routes declaration
userRouter.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1 }
    ]),
    registerUser
)
userRouter.route("/login").post(loginUser)

userRouter.route("/update-avatar").patch(verifyJWT, upload.single("avatar"), updateUserAvatar)
userRouter.route("/update-cover-image").patch(verifyJWT, upload.single("coverImage"), updateUserCoverImage)

userRouter.route("/logout").post(verifyJWT, logoutUser)
userRouter.route("/details").get(verifyJWT, getUserDetails)
userRouter.route("/change-password").patch(verifyJWT, updateCurrentPassword)
userRouter.route("/update-details").patch(verifyJWT, updateUserDetails)
userRouter.route("/regenerate-access-token").post(regenerateAccessToken)
userRouter.route("/:id").delete(verifyJWT, deleteUser)


export { userRouter }
