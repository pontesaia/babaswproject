const express = require("express");
const bodyParser = require("body-parser");
const Waffle = require("../models/waffle");
const authenticate = require("../authenticate");

const waffleRouter = express.Router();

waffleRouter.use(bodyParser.json());

waffleRouter
  .route("/")
  .get((req, res, next) => {
    Waffle.find()
      .populate("waffles.description")
      .then((waffles) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(waffles);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Waffle.create(req.body)
      .then((waffle) => {
        console.log("Waffle Order Created ", waffle);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(waffle);
      })
      .catch((err) => next(err));
  })
  .put(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`Oooops! Babas says we are all out of those waffles! Can't update your order on /waffles/${req.params.waffleId}`);
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Campsite.deleteMany()
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );

waffleRouter
  .route("/:waffleId")
  .get((req, res, next) => {
    Waffle.findById(req.params.waffleId)
      .populate("waffles.description")
      .then((waffle) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(waffle);
      })
      .catch((err) => next(err));
  })
  .post(authenticate.verifyUser, (req, res) => {
    res.statusCode = 403;
    res.end(`Oooops! Babas says we are all out of those waffles! Can't post your order on /waffles/${req.params.waffleId}`);
  })
  .put(authenticate.verifyUser, authenticate.verifyAdmin, (req, res, next) => {
    Waffle.findByIdAndUpdate(
      req.params.waffleId,
      {
        $set: req.body,
      },
      { new: true }
    )
      .then((waffle) => {
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(waffle);
      })
      .catch((err) => next(err));
  })
  .delete(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Waffle.findByIdAndDelete(req.params.waffleId)
        .then((response) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(response);
        })
        .catch((err) => next(err));
    }
  );



module.exports = waffleRouter;
