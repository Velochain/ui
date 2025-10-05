import mongoose, { Schema, Document } from "mongoose";

export interface IUser extends Document {
  address: string;
  stravaId?: string;
  createdAt: Date;
  updatedAt: Date;
  accessToken: string;
  refreshToken: string;
  expiresAt: Date;
  activities: mongoose.Types.ObjectId[];
  claimedIds: string[];
}

const UserSchema = new Schema<IUser>(
  {
    address: {
      type: String,
      required: true,
      unique: true,
    },
    stravaId: {
      type: String,
      unique: true,
      sparse: true,
    },
    accessToken: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    activities: [
      {
        type: Schema.Types.ObjectId,
        ref: "Activity",
      },
    ],
    claimedIds: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.User ||
  mongoose.model<IUser>("User", UserSchema);
