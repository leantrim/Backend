"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const User_1 = require("../model/User");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
router.post("/", auth_1.default, async (req, res) => {
    const { error } = (0, User_1.validateUser)(req.body);
    if (error)
        return res.status(400).send(error.message);
    const { email, password } = req.body;
    const existingUser = await User_1.User.findOne({ email });
    if (existingUser)
        return res.status(400).send("Email is already registered");
    const hashedPassword = await bcrypt_1.default.hash(password, await bcrypt_1.default.genSalt());
    const user = new User_1.User({ ...req.body, password: hashedPassword });
    try {
        await user.save();
        const token = user.generateAuthToken();
        return res.send(token);
    }
    catch (err) {
        console.error("ERROR: Something went wrong with registering a user, please contact administrator and include this error:", err);
        return res.status(500).send(err);
    }
});
router.get("/", auth_1.default, async (req, res) => {
    const user = await User_1.User.find().select("-password");
    if (!user)
        return res.status(404).send("No sites have been created");
    return res.send(user);
});
router.get("/me", auth_1.default, async (req, res) => {
    const user = await User_1.User.findById(req.body.user._id).select("-password");
    return res.send(user);
});
/*const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendMail = (mail: string) => {
  const msg = {
    to: `${mail}`, // Change to your recipient
    from: "voip2g@voiplay.se", // Change to your verified sender
    subject: "Tack för att du registrerar dig",
    text: "thank you for registering, here is your code HBF539",
    html: "<strong>Tack för att du har valt att registrera ett konto hos oss :)</strong>",
  };
  sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent");
    })
    .catch((error: string) => {
      console.error(error);
    });
};
*/
exports.default = router;
