import express from "express"
import { Review, Temple } from "../models/index.js"

const router = express.Router()

// create review by specified temple
router
  .route("/:templeId")
  .get((req, res) => {
    Temple.findById(req.params.templeId, (err, result) => {
      res.json(result.reviews)
    }).catch((err) => res.status(400).json("Error: " + err))
  })
  .post((req, res) => {
    const { userid, stars, title, content } = req.body
    const newReview = new Review({
      userid,
      stars: Number(stars),
      title,
      content,
      date: new Date(),
    })

    Temple.findByIdAndUpdate(req.params.templeId, {
      $push: { reviews: newReview },
    })
      .then(() => res.status(201).send("Review successfully created"))
      .catch((err) => res.status(400).json("Error: " + err))
  })

export default router
