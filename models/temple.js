import mongoose from "mongoose";
import { reviewSchema } from "./review.js";
const { Schema, model } = mongoose;

const templeSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: false },
    address: { type: String, required: true },
    lat: { type: Number, required: true },
    long: { type: Number, required: true },
    nearby_temple: [{
      temple: {type: Schema.Types.ObjectId, ref: 'Temple'},
      distance: Number
    }],
    reviews: { type: [reviewSchema], required: false, default: [] }
  },
  {
    timestamps: true,
  }
);

const Temple = model("Temple", templeSchema);

export default Temple;
