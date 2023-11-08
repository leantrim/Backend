import express, { Request, Response } from 'express';

import sharp from 'sharp';
import { minioClient, upload } from './lib/Helper';
import auth from '../../middleware/auth';
import admin from '../../middleware/admin';
import { MinioObjectType } from '@mediapartners/shared-types/types/panel';

const router = express.Router();

router.post(
	'/',
	upload.single('file'),
	auth,
	admin,
	async (req: Request, res: Response) => {
		const file = req.file;
		const siteUrl = new URL(req.body.siteUrl).hostname;
		const fileType = file?.mimetype.split('/')[0];
		if (!siteUrl) {
			return res.status(400).json({ message: 'Site URL is required.' });
		}

		if (fileType !== 'image') {
			return res
				.status(400)
				.json({ message: 'Uploaded file is not an image.' });
		}
		if (!file) {
			return res.status(400).json({ message: 'No file uploaded.' });
		}

		const bucketName = 'mediapartners';
		let fileName = file.originalname;
		fileName = fileName.replace(/ /g, '_');
		fileName = fileName.replace(/\(/g, '').replace(/\)/g, '');
		const webpBuffer = await sharp(file.buffer) // Convert image to webp and compress it
			.webp({ quality: 100 })
			.toBuffer();

		// Upload the file to MinIO
		minioClient.putObject(bucketName, fileName, webpBuffer, (err, etag) => {
			if (err) {
				return res
					.status(500)
					.json({ message: 'Error uploading file to MinIO.', err });
			}
			// const fileUrl = `http://${process.env.MINIO_END_POINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;

			// Add tags after the object has been uploaded
			const tags = {
				site: siteUrl,
			};
			minioClient.setObjectTagging(bucketName, fileName, tags, function (err) {
				if (err) {
					return console.log(err);
				}
			});

			const fileUrl = `http://${process.env.MINIO_END_POINT}:${process.env.MINIO_PORT}/${bucketName}/${fileName}`;
			return res.status(200).json({ success: true, message: fileUrl });
		});
	}
);
// TODO: Add admin auth
router.get('/', auth, async (req: Request, res: Response) => {
	const files: MinioObjectType[] = [];
	const stream = minioClient.listObjects('mediapartners');
	stream.on('data', async function (obj: MinioObjectType) {
		if (obj.name) {
			files.push(obj);
		}
	});
	stream.on('end', function (obj: any) {
		return res.status(200).send(files);
	});
	stream.on('error', function (err) {
		console.log(err);
		return res.status(500).send(err);
	});
});

// TODO: Add admin auth
router.delete('/:name', auth, async (req: Request, res: Response) => {
	if (!req.params.name)
		return res
			.status(400)
			.send('File name needs to be included in the params.');
	try {
		// Check if the object exists
		await minioClient.statObject('mediapartners', req.params.name);

		// If the object exists, delete it
		await minioClient.removeObject('mediapartners', req.params.name);

		return res
			.status(200)
			.send(`File: ${req.params.name} was successfully deleted.`);
	} catch (error: any) {
		return res.status(404).send(error.code);
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
