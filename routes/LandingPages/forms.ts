import express, { Request, Response } from 'express';
import { validateForm as validate, Form } from '../../model/LandingPages/Forms';
import { FormTypes } from '@mediapartners/shared-types/types/panel';
import auth from '../auth';
import xss from 'xss';

const router = express.Router();

router.post('/', async (req: Request, res: Response) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(xss(error.message));

	const form: FormTypes = new Form({ ...req.body, dateSubmitted: new Date() });

	try {
		await form.save();
		return res.send(form);
	} catch (err) {
		console.error(err);
		return res.status(500).send(`An unknown error has occured`);
	}
});

// TODO: Add authentication (user, admin)
router.get('/', auth, async (req: Request, res: Response) => {
	const forms = await Form.find();
	if (!forms) return res.status(404).send('No forms have been created');

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
export default router;
