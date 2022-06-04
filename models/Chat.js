import mongoose from "mongoose";

const Schema = mongoose.Schema;

const chatSchema = new Schema(
  {
    user_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    },
    USSER_ID: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "users",
    }
  },
  { timestamps: true }
);

export default mongoose.model('chats',chatSchema);