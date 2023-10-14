"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Forms_1 = require("../model/Forms");
const auth_1 = __importDefault(require("src/middleware/auth"));
const router = express_1.default.Router();
router.post('/', async (req, res) => {
    const { error } = (0, Forms_1.validateForm)(req.body);
    if (error)
        return res.status(400).send(error.message);
    const form = new Forms_1.Form({ ...req.body, dateSubmitted: new Date() });
    try {
        await form.save();
        return res.send(form);
    }
    catch (err) {
        console.error('ERROR: Something went wrong with registering a form, please contact administrator and include this error:', err);
        return res.status(500).send(err);
    }
});
// TODO: Add authentication (user, admin)
router.get('/', auth_1.default, async (req, res) => {
    const forms = await Forms_1.Form.find();
    if (!forms)
        return res.status(404).send('No forms have been created');
    return res.status(200).send(forms);
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
