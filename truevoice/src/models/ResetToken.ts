import mongoose, { Document, Schema } from "mongoose";

// create an interface
export interface IResetToken extends Document {
  userId: mongoose.Types.ObjectId;
  token: string;
  expiry: Date;
}

const resetTokenSchema = new Schema<IResetToken>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  token: {
    type: String,
    required: true,
  },
  expiry: {
    type: Date,
    required: true,
  },
});


resetTokenSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 });


export const ResetToken =
  mongoose.models.ResetToken ||
  mongoose.model<IResetToken>("ResetToken", resetTokenSchema);
