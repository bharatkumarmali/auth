import connectDB from "./db/index.js"
import { app } from "./app.js"
import dotenv from "dotenv"

dotenv.config({
    path: "./.env"
});



connectDB()
    .then(() => {
        app.on("error", (error) => {
            console.log("ERROR IN SERVER SETUP : ", error)
        })
        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port : ${process.env.PORT}`)
        })
    })
    .catch((error) => {
        console.log("Server running error : ", error)
        process.exit(1)
    })
