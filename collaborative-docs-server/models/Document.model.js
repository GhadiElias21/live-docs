// models/Document.model.js
import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      default: "Untitled Document",
    },
    content: {
      type: String,
      default: "",
    },

    owner: {
      type: Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },

    sharedWith: [
      {
        user: { type: Schema.Types.ObjectId, ref: "Users" },
        role: { type: String, enum: ["viewer", "editor"], default: "editor" },
      },
    ],
  },
  { timestamps: true }
);

const Document = model("Document", DocumentSchema);
export default Document;
