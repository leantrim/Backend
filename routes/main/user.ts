import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import { validateUser as validate, User } from '../../model/main/User';
import auth from '../../middleware/auth';
import { UserType } from '@mediapartners/shared-types/types/panel';
import xss from 'xss';

const router = express.Router();

router.post('/', auth, async (req: Request, res: Response) => {
	const { error } = validate(req.body);
	if (error) return res.status(400).send(xss(error.message));

	const { email, password } = req.body;

	const existingUser = await User.findOne({ email });

	if (existingUser) return res.status(400).send('Email is already registered');

	const hashedPassword = await bcrypt.hash(password, await bcrypt.genSalt());
	const user: UserType = new User({ ...req.body, password: hashedPassword });

	try {
		await user.save();
		const token = user.generateAuthToken();
		return res.send(token);
	} catch (error) {
		console.error(error);
		return res.status(500).send('An error occurred. Please try again later.');
	}
});

router.get('/', auth, async (req: Request, res: Response) => {
	const user = await User.find().select('-password');
	if (!user) return res.status(404).send(xss('No users have been created'));

	return res.send(user);
});

router.get('/me', auth, async (req: Request, res: Response) => {
	const user = await User.findById(req.body.user._id).select('-password');
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
export default router;
