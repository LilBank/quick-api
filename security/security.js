import jwt from "jsonwebtoken"
import dotenv from "dotenv"

dotenv.config()

export const ensureToken = (req, res, next) => {
  const bearerHeader = req.headers["authorization"]

  if (!bearerHeader) return res.sendStatus(403)

  const bearerToken = bearerHeader.split(" ")[1]

  jwt.verify(bearerToken, process.env.SECRET_KEY, (err, result) => {
    return err ? res.sendStatus(403) : next()
  })
}

export const isAdmin = (role) => {
  return role.toLowerCase() === 'admin'
}
