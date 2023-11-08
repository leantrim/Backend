import express, { Request, Response } from 'express';
import auth from '../../middleware/auth';
import { Logging, validateLog } from 'model/main/Logging';
import { LoggingType } from '@mediapartners/shared-types/types/panel';

const router = express.Router();

router.get('/', auth, async (req: Request, res: Response) => {
	const logs = await Logging.find();

	if (!logs.length) return res.status(404).send('No logs have been created');

	return res.send(logs);
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
