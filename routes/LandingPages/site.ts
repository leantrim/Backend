import express, { Request, Response } from 'express';
import { validateSite as validate, Site } from '../../model/LandingPages/Site';
import { WebsiteModel } from '@mediapartners/shared-types/types/panel/cms';
import auth from '../../middleware/auth';
import mongoose from 'mongoose';
import xss from 'xss';

const router = express.Router();
router.put('/', auth, async (req: Request, res: Response) => {
	const { user, ...webData } = req.body;
	const { error } = validate(webData);
	if (error) return res.status(400).send(xss(error.message));

	const { url } = webData;
	const existingSite = await Site.findOne({ url });
	if (!existingSite)
		return res.status(400).send({ message: 'site does not exist', url });

	try {
		const updatedSite = await Site.findByIdAndUpdate(webData._id, webData);
		return res.status(200).send(updatedSite);
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
	}
});

router.get('/', auth, async (req: Request, res: Response) => {
	// Introduce a delay of 2 seconds (2000 milliseconds) before fetching the sites
	const sites = await Site.find();
	if (!sites) return res.status(404).send(xss('No sites have been created'));

	return res.status(200).send(sites);
});

router.get('/sitebyname/:id', auth, async (req: Request, res: Response) => {
	const site: any = await Site.findOne({ url: req.params.id });

	if (!site)
		return res
			.status(404)
			.send(xss('The site with the given id was not found'));

	return res.send(site);
});

router.get('/:id', auth, async (req: Request, res: Response) => {
	const site: any = await Site.findById(req.params.id);

	if (!site)
		return res
			.status(404)
			.send(xss('The site with the given id was not found'));

	return res.send(site);
});

router.post('/', async (req: Request, res: Response) => {
	const { error } = validate(req.body);
	const { user, ...webData } = req.body;
	if (error) return res.status(400).send(xss(error.message));
	const existingSite: WebsiteModel | null = await Site.findOne({
		url: webData.url,
	});
	if (existingSite)
		return res.status(400).send(xss(`Hemsidan finns redan: ${webData.url}`));

	// Check if the URL is reachable
	/* const buildUrl = `https://${req.body.web.url}`;
  try {
    await fetch(buildUrl);
  } catch (error) {
    return res
      .status(400)
      .send(`Hemsidan ej nårbar. Är den upplagd på panelen?: ${buildUrl}`);
  }*/
	const site: WebsiteModel = new Site({
		_id: new mongoose.Types.ObjectId(),
		...webData,
	});

	try {
		await site.save();
		return res.status(200).send(site);
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
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
export default router;
