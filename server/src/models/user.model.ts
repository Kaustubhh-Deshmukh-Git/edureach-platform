import type { Document } from "mongoose";
import { model, Schema } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  created_at: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 80,
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
      required: true,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
    },
    created_at: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret["id"] = ret["_id"]?.toString();
        delete ret["_id"];
        delete ret["__v"];
        delete ret["password"];
        return ret;
      },
    },
  },
);

export const User = model<IUser>("User", userSchema);
