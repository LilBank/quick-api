import dotenv from "dotenv"
import express from "express"
import axios from "axios"
import { Temple } from "../models/index.js"

dotenv.config()
const openWeatherApiKey = process.env.OPENWEATHERKEY
const openUVApiKey = process.env.OPENUVKEY
const router = express.Router()

router
  .route("/")
  .get((req, res) => {
    Temple.find()
      .then((temples) => res.json(temples))
      .catch((err) => res.status(400).json("Error: " + err))
  })
  .post((req, res) => {
    const { name, description, address, lat, long } = req.body
    const reviews = []

    const newTemple = new Temple({
      name,
      description,
      address,
      lat,
      long,
      reviews,
    })

    newTemple
      .save()
      .then(() => res.json(newTemple))
      .catch((err) => res.status(400).json("Error: " + err))
  })

router
  .route("/:id")
  .get((req, res) => {
    Temple.findById(req.params.id)
      .then((temple) => res.json(temple))
      .catch((err) => res.status(400).json("Error: " + err))
  })
  .put((req, res) => {
    Temple.findByIdAndUpdate(req.params.id, req.body, (err, result) => {
      if (err) {
        res.status(400).json("Error: " + err)
      }
    }).then((temple) => res.json(temple))
  })
  .delete((req, res) => {
    Temple.findByIdAndDelete(req.params.id)
      .then(() => res.json(`Temple ${req.params.id} deleted`))
      .catch((err) => res.status(400).json("Error: " + err))
  })

router.route("/:id/templeInfo").get(async (req, res) => {
  let sumRating = 0
  let uvlevel = ""
  let uvRecommendation = ""
  const temple = await Temple.findById(req.params.id).exec()
  const responseWeather = await axios.get(
    `https://api.openweathermap.org/data/2.5/weather?lat=${temple.lat}&lon=${temple.long}&appid=${openWeatherApiKey}&units=metric`
  )
  const responseUV = await axios.get(
    `https://api.openuv.io/api/v1/uv?lng=${temple.long}&lat=${temple.lat}`,
    {
      headers: { "x-access-token": openUVApiKey },
    }
  )
  temple.reviews.forEach((review) => {
    sumRating += review.stars
  })
  let uv = responseUV.data.result.uv
  switch (true) {
    case uv < 3:
      uvlevel = "Low"
      uvRecommendation = "Sunscreen, SPF 30+, Sunglass"
      break
    case uv < 6:
      uvlevel = "Moderate"
      uvRecommendation =
        "Sunscreen, SPF 30+, Sunglass, Hat, Protective Clothing"
      break
    case uv < 8:
      uvlevel = "High"
      uvRecommendation =
        "Sunscreen, SPF 30+, Sunglass, Hat, Protective Clothing, Seek Shade"
      break
    case uv < 11:
      uvlevel = "Very High"
      uvRecommendation =
        "Sunscreen, SPF 30+, Sunglass, Hat, Protective Clothing, Seek Shade, Limit time outside between 10am-4pm"
      break
    case uv >= 11:
      uvlevel = "Extreme"
      uvRecommendation =
        "Sunscreen, SPF 30+, Sunglass, Hat, Protective Clothing, Seek Shade, Limit time outside between 10am-4pm"

      break
  }
  res.json({
    temple_name: temple.name,
    lat: temple.lat,
    long: temple.long,
    temp: responseWeather.data.main.temp,
    temp_feels_like: responseWeather.data.main.feels_like,
    temp_icon_image_path: `http://openweathermap.org/img/wn/${responseWeather.data.weather[0].icon}@2x.png`,
    weather_description: responseWeather.data.weather[0].main,
    uv: uv,
    uv_level: uvlevel,
    uv_recommendation: uvRecommendation,
    avg_rating: Math.floor(sumRating / temple.reviews.length),
    reviews: temple.reviews,
  })
})

router.route("/name/:templeName").get((req, res) => {
  Temple.find({ name: { $regex: req.params.templeName, $options: "i" } })
    .then((temples) => res.json(temples))
    .catch((err) => res.status(400).json("Error: " + err))
})

router.route("/nearby/:id").get((req, res) => {
  Temple.findById(req.params.id)
    .populate("nearby_temple.temple")
    .then((temple) => res.json(temple.nearby_temple))
    .catch((err) => res.status(400).json("Error: " + err))
})

export default router
