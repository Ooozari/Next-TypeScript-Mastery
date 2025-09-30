import mongoose, { Schema, Document } from "mongoose";

// Interface
export interface IMessageLimit extends Document {
  clientId: string;      // Unique token stored in cookie/localStorage
  fingerprint: string;   // Optional: UA + headers hash
  senderIp: string;      // Still keep IP as a secondary guardrail
  date: string;          // YYYY-MM-DD (for daily reset)
  count: number;         // Number of messages sent
  createdAt: Date;       // For TTL auto-expiry
}

// Schema
const messageLimitSchema: Schema<IMessageLimit> = new Schema({
  clientId: { type: String, required: true },
  fingerprint: { type: String, required: false },
  senderIp: { type: String, required: true },
  date: { type: String, required: true },
  count: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// ✅ Unique index per client per day
messageLimitSchema.index({ clientId: 1, date: 1 }, { unique: true });

// ✅ Secondary (non-unique) index per IP per day → used only for guardrail queries
messageLimitSchema.index({ senderIp: 1, date: 1 });

// ✅ TTL index (auto-expire after 30 days, instead of just 24h)
messageLimitSchema.index({ createdAt: 1 }, { expireAfterSeconds: 60 * 60 * 24 * 30 });

// Model
const MessageLimit =
  mongoose.models.MessageLimit ||
  mongoose.model<IMessageLimit>("MessageLimit", messageLimitSchema);

export default MessageLimit;
