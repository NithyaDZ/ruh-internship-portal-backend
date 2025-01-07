import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import db from "../config/db.js";

import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

const generateToken = (user) => {
  return jwt.sign(user, process.env.JWT_SECRET, { expiresIn: "1d" });
};

router.post("/register", async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await db.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);

  if (userExists.rows.length > 0) {
    return res.status(400).send("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = await db.query(
    "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *",
    [username, email, hashedPassword]
  );

  return res
    .status(201)
    .json({ message: "User created successfully", user: newUser.rows[0] });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await db.query("SELECT * FROM users WHERE email = $1", [email]);

  if (user.rows.length === 0) {
    return res.status(404).json({ message: "User not found" });
  }

  const validPassword = await bcrypt.compare(password, user.rows[0].password);

  if (!validPassword) {
    return res.status(400).send({ message: "Invalid credentials" });
  }

  const token = generateToken({
    id: user.rows[0].id,
    email: user.rows[0].email,
  });

  return res.status(200).json({ message: "Login successful", token });
});

router.get("/validate", async (req, res) => {
  const token = req.header("authorization");

  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const tokenData = token.split(" ")[1];
    const user = jwt.verify(tokenData, process.env.JWT_SECRET);

    return res.status(200).json({ ...user });
  } catch (error) {
    return res.status(403).json({ message: "Invalid token" });
  }
});

export default router;
