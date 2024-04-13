import path from 'node:path'
import multer from 'multer'
import crypto from 'node:crypto'

export const multerConfig = {
	storage: multer.diskStorage({
		destination: path.resolve(__dirname, '..', '..', 'uploads'),
		filename: (request, file, callback) => {
			const hash = crypto.randomBytes(6).toString('hex')

			const fileName = `${hash}-${file.originalname}`

			callback(null, fileName)
		}
	})
}
