"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Site_1 = require("../model/Site");
const auth_1 = __importDefault(require("../middleware/auth"));
const router = express_1.default.Router();
// TODO: Add authentication once user system is setup in the CMS.
router.post("/", async (req, res) => {
    const { error } = (0, Site_1.validateSite)(req.body);
    if (error)
        return res.status(400).send(error.message);
    const { site: url } = req.body;
    const existingSite = await Site_1.Site.findOne({ url });
    if (existingSite)
        return res.status(400).send({ message: "site already exists", url });
    const site = new Site_1.Site({ ...req.body });
    try {
        await site.save();
        return res.status(200).send(site);
    }
    catch (err) {
        console.error("ERROR: Something went wrong with creating a website, please contact administrator and include this error:", err);
        return res.status(500).send(err);
    }
});
// TODO: Add authentication
router.get("/", async (req, res) => {
    const sites = await Site_1.Site.find();
    if (!sites)
        return res.status(404).send("No sites have been created");
    return res.status(200).send(sites);
});
router.get("/site", auth_1.default, async (req, res) => {
    const site = await Site_1.Site.findById(req.body.site._id);
    return res.send(site);
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
