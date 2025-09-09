import mongoose, { Schema, Document } from "mongoose";

// Interface
export interface IMessageLimit extends Document {
  senderIp: string;
  date: string;
  count: number;
}

// Schema
const messageLimitSchema: Schema<IMessageLimit> = new Schema({
  senderIp: { type: String, required: true },
  date: { type: String, required: true },
  count: { type: Number, default: 0 },
});

// Unique index to prevent duplicates per IP per day
// data will be add in sorted order (asc)
messageLimitSchema.index({ senderIp: 1, date: 1 }, { unique: true });

// Model
const MessageLimit = mongoose.models.MessageLimit || mongoose.model<IMessageLimit>("MessageLimit", messageLimitSchema);

export default MessageLimit;
