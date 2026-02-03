import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import crypto from 'crypto';

// Interface for User document methods
export interface IUserMethods {
  matchPassword(enteredPassword: string): Promise<boolean>;
  getResetPasswordToken(): string;
}

// Interface for User document
export interface IUserDocument extends mongoose.Document, IUserMethods {
  name: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  lastLogin?: Date;
  loginCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// Schema definition
const userSchema = new mongoose.Schema<IUserDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    lastLogin: Date,
    loginCount: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Pre-save middleware for password hashing
userSchema.pre('save', async function () {
  if (!this.isModified('password')) {
    return;
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Method to compare passwords
userSchema.methods.matchPassword = async function (enteredPassword: string): Promise<boolean> {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate reset password token
userSchema.methods.getResetPasswordToken = function (): string {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = new Date(Date.now() + 10 * 60 * 1000);
  return resetToken;
};

const User = mongoose.model<IUserDocument>('User', userSchema);
export default User;
