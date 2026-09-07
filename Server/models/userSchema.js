import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
    },
    avatar: {
      type: String,
    },
    pronouns: {
      type: String,
      maxlength: [10, "Pronouns 10 characters se zyada nahi ho sakte"],
    },
    bio: {
      type: String,
      maxlength: [160, "Bio 160 characters se zyada nahi ho sakti"],
      trim: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    followers: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        followedAt: { type: Date, default: Date.now },
      },
    ],
    following: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        notifyByEmail: { type: Boolean, default: true },
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function () {

    if (!this.isModified("password")) return;

    this.password = await bcrypt.hash(this.password, 10);

});


userSchema.methods.generateToken = function(){
   return jwt.sign(
    {id:this._id},
    process.env.JWT_SECRET,
    {expiresIn : "7d"}
   );
}

export default mongoose.model("User",userSchema);