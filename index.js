import dotenv from "dotenv"
import express from "express"
import mongoose from "mongoose"
import cors from "cors"
import templeRouter from "./routes/temple.js"
import usersRouter from "./routes/user.js"
import reviewRouter from "./routes/review.js"
import authenticationRouter from "./routes/authentication.js"
import { createRequire } from "module"

dotenv.config()

const app = express()
const port = process.env.PORT || 5000
const require = createRequire(import.meta.url)
const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./swagger.json")
const mongooseUri = process.env.ATLAS_URI
const mongooseOptions = {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: true,
}
mongoose.connect(mongooseUri, mongooseOptions)
mongoose.connection.once("open", () => {
  console.log("MongoDB database connection established successfully")
})

app.use(cors())
app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use("/temples", templeRouter)
app.use("/users", usersRouter)
app.use("/reviews", reviewRouter)
app.use("/auth", authenticationRouter)
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`)
})
