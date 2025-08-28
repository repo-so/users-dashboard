

import mongoose, { Schema, //defines the structure of documents
                   Document //for document type declaration
                 } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
}

const UserSchema: Schema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
  },
  { timestamps: true } // adds createdAt and updatedAt
);

export default mongoose.model<IUser>("User", UserSchema);
