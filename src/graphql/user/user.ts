import { Schema, model } from "mongoose";

export interface IUser {
  id: string;
  name: string;
  email: string;
  expenses: string[];
}

const userSchema = new Schema<IUser>({
  name: { type: String },
  email: { type: String, required: true },
  expenses: [{ type: Schema.Types.ObjectId }],
});

export const UserModel = model<IUser>("User", userSchema);
