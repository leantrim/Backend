"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const Site_1 = require("../model/Site");
const auth_1 = __importDefault(require("../middleware/auth"));
const mongoose_1 = __importDefault(require("mongoose"));
const router = express_1.default.Router();
router.put('/', auth_1.default, async (req, res) => {
    const { user, ...webData } = req.body;
    const { error } = (0, Site_1.validateSite)(webData);
    if (error)
        return res.status(400).send(error.message);
    const { url } = webData;
    const existingSite = await Site_1.Site.findOne({ url });
    if (!existingSite)
        return res.status(400).send({ message: 'site does not exist', url });
    try {
        const updatedSite = await Site_1.Site.findByIdAndUpdate(webData._id, webData);
        return res.status(200).send(updatedSite);
    }
    catch (err) {
        console.error('ERROR: Something went wrong with updating a website, please contact administrator and include this error:', err);
        return res.status(500).send(err);
    }
});
router.get('/', auth_1.default, async (req, res) => {
    // Introduce a delay of 2 seconds (2000 milliseconds) before fetching the sites
    setTimeout(async () => {
        const sites = await Site_1.Site.find();
        if (!sites)
            return res.status(404).send('No sites have been created');
        return res.status(200).send(sites);
    }, 10000); // Delay for 2 seconds
});
router.get('/sitebyname/:id', auth_1.default, async (req, res) => {
    const site = await Site_1.Site.findOne({ url: req.params.id });
    if (!site)
        return res.status(404).send('The site with the given id was not found');
    return res.send(site);
});
router.get('/:id', auth_1.default, async (req, res) => {
    const site = await Site_1.Site.findById(req.params.id);
    if (!site)
        return res.status(404).send('The site with the given id was not found');
    return res.send(site);
});
router.post('/', async (req, res) => {
    const { error } = (0, Site_1.validateSite)(req.body);
    const { user, ...webData } = req.body;
    if (error)
        return res.status(400).send(error.message);
    const existingSite = await Site_1.Site.findOne({
        url: webData.url,
    });
    if (existingSite)
        return res.status(400).send(`Hemsidan finns redan: ${webData.url}`);
    // Check if the URL is reachable
    /* const buildUrl = `https://${req.body.web.url}`;
    try {
      await fetch(buildUrl);
    } catch (error) {
      return res
        .status(400)
        .send(`Hemsidan ej nårbar. Är den upplagd på panelen?: ${buildUrl}`);
    }*/
    const site = new Site_1.Site({
        _id: new mongoose_1.default.Types.ObjectId(),
        ...webData,
    });
    try {
        await site.save();
        return res.status(200).send(site);
    }
    catch (err) {
        console.error('ERROR: Something went wrong with creating a website, please contact administrator and include this error:', err);
        return res.status(500).send(err);
    }
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
