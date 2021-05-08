import express from "express"
import { User } from "../models/index.js"

const router = express.Router()

router
  .route("/")
  .get((req, res) => {
    User.find()
      .then((users) => res.json(users))
      .catch((err) => res.status(400).json("Error: " + err))
  })
  .post((req, res) => {
    const { name, email, role } = req.body

    const newUser = new User({ name, email, role })

    User.findOne({ email: email }, function (err, user) {
      if (user) {
        let resBody = JSON.parse(JSON.stringify(user))
        resBody.message = "User already exists"
        res.status(200).json(resBody)
      } else {
        newUser
          .save()
          .then(() => res.status(201).json(newUser))
          .catch((err) => res.status(400).json("Error: " + err))
      }
    })
  })

router
  .route("/:id")
  .get((req, res) => {
    User.findById(req.params.id)
      .then((user) => {
        // const isAdmin = user.role === 'Admin'
        // return user.role === 'Admin' ? 'something_admin_do' : 'user_do'
        // return res.json(isAdmin ? { admin: 'admin'} : { user: 'user' })
      })
      .catch((err) => res.status(400).json("Error: " + err))
  })
  .delete((req, res) => {
    const {
      params: { id },
    } = req
    // User.findByIdAndDelete(req.params.id)
    //   .then(() => res.json(`User ${req.params.id} deleted`))
    //   .catch((err) => res.status(400).json("Error: " + err));
    User.findById(id)
      .then((user) => {
        const isAdmin = user.role === "Admin"
        if (isAdmin) {
          // ...user
          User.deleteOne(user).then(() => res.status(204).end())
        } else {
          res.status(401).end()
        }
      })
      .catch((err) => res.status(400).json(err))
  })

export default router
