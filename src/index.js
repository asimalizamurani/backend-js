import dotenv from 'dotenv';
import connectDB from "./db/index.js";
import {app} from "./app.js";

const PORT = process.env.PORT || 8000;

dotenv.config({
    path: './env'
})

connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log(`Server is listening on port ${PORT}`);
    })
    app.on("error", (err) => {
        console.log("Error:", err)
        throw err;
    })
})
.catch((error) => {
    console.log("ERROR: MONGODB Connection Failed !!!", error);
})
