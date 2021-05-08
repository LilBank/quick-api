import mongoose from "mongoose";
const { Schema, model, ObjectId } = mongoose;

// to be embed in temple
const reviewSchema = new Schema(
  {
    userid: { type: ObjectId, required: true },
    stars: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, required: true },
    content: { type: String, required: true },
    date: { type: Date, required: true },
  },
  {
    timestamps: true,
  }
);

const Review = model("Review", reviewSchema);

export { Review, reviewSchema };
