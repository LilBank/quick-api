import express from "express"
import { User } from "../models/index.js"
import { ensureToken, isAdmin } from "../security/security.js"
import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

const router = express.Router()

router.post("/login", async (req, res, next) => {
  const { body: { email } } = req
  const response = await User.findOne({ email: email }).exec()

  if (response) {
    jwt.sign({ email: email }, process.env.SECRET_KEY, { expiresIn: "1h" }, (err, token) => {
      const message = token
        ? { ok: true, message: "Login successful", token: token }
        : { ok: false, message: "Not Authorized"}
      res.send(message)
    })
  } else {
    res.send({ ok: false, message: "Username or Password is incorrect" })
  }
})

router.get("/sample-users", ensureToken, async (req, res, next) => {
  // mocked user
  const tempUser = { email: "johndoe@example.com", role: 'Admin'}

  if (isAdmin(tempUser.role)) {
    res.json(await User.find())
  } else {
    res.status(401).send({ message: "You are not authorized for this endpoint"})
  }
})

export default router
