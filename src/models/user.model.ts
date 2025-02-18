import mongoose, { Document, Schema, Model } from "mongoose";
import bcrypt from "bcryptjs";
import { RoleType } from "../middleware/auth.middleware";

export interface ICreateUserRequest {
  name: string;
  email: string;
  password: string;
  role: RoleType;
}

export interface IUser extends Document<string> {
  name: string;
  email: string;
  password: string;
  role: RoleType;
  comparePassword(password: string): Promise<boolean>;
  createdAt: Date;
  updatedAt: Date;
}

export const UserSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: RoleType, default: RoleType.Employee },
  },
  { timestamps: true }
);

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export const User: Model<IUser> = mongoose.model<IUser>("User", UserSchema);
