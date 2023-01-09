// const express = require('express');
// const mongoose = require('mongoose');
import express from 'express';
import mongoose from 'mongoose';
const router = express.Router();

// Get Posts
router.get('/', async (req, res) => {
  const posts = await db.collection('posts');
  res.send(await posts.find({}).toArray());
});

// Add Posts
router.post('/', async (req, res) => {
  const posts = await db.collection('posts');
  await posts.insertOne({
    text: req.body.text,
    createAt: new Date(),
  });
  res.status(201).send();
});
// Delete Posts


const handleOpen = () => console.log("connected to DB!");
const handleError = (error) => console.log("DB Error", error);
const db = mongoose.connection;
db.on("error", handleError);
db.once("open", handleOpen);

export default router;

