import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

// USER SCHEMA
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: 6,
    },
    state: {
      type: String,
      default: "",
    },

    // Profile is OPTIONAL
    profile: {
      age: { type: Number, default: null },
      occupation: { type: String, default: "" },
      income: { type: String, default: "" },
      gender: { type: String, default: "" },
      category: { type: String, default: "" },
      disability: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// PASSWORD HASHING MIDDLEWARE
// Use async pre hook without the `next` callback (Mongoose handles async hooks)
userSchema.pre("save", async function () {
  // If password NOT modified → skip hashing
  if (!this.isModified("password")) {
    return;
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// COMPARE PASSWORDS
userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;
