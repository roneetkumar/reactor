const express = require("express");
const router = express.Router();
const config = require("config");
const { check, validationResult } = require("express-validator");
const auth = require("../../middleware/auth.middleware");
const User = require("../../models/User.model");
const Component = require("../../models/Component.model");
