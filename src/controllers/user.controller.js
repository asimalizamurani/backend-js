import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js"
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler(async (req, res) => {
    // get user details from frontend
    // validation - not empty
    // check if user already exists: username, email
    // check for images, check for avatar
    // upload them to cloudinary, avatar
    // create user object - create entry in db
    // remove password and refresh token field from response
    // check for user creation
    // return res

    // 1-> get user details from frontend
    const { fullName, email, username, password } = req.body
    console.log("email: ", email)

    //2-> validation - not empty. Checking that filed are empty or not
    if (
        [fullName, email, username, password].some((field) =>
        field?.trim === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    // finding a user using findOne method
    const existedUser = User.findOne({
        // $or is a mongodb operator
        $or: [{ username }, { email }]
    })

    // 3-> check if user already exists: username, email
    if (existedUser) {
        throw new ApiError(409, "User with email or password already exists")
    }

    // 4-> check for images, check for avatar
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if (!avatarLocalPath) {
        throw new ApiError(400, "Avatar file is required")
    }

    //5-> upload them to cloudinary, avatar
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
   
    // check for avatar is it available or not
    if (!avatar) {
        throw new ApiError(400, "Avatar file is required")
    }

    //6-> create user object - create entry in db
    const user = await User.create({
        fullName,
        avatar: avatar.url,
         // Checking if coverImage exists upoload it othrewise make it empty
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase()
    })

    // 7-> remove password and refresh token field from response
    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    )

    //8-> check for user creation
    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    //9-> return res
    return res.status(201).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )
})

export {registerUser}