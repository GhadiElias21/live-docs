import mongoose from "mongoose";
const { Schema, model } = mongoose;

const DocumentSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
      default: "Untitled Document",
    },
    content: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);
const Document = model("Document", DocumentSchema);
export default Document;
