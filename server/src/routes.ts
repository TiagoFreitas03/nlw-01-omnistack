import { Router } from 'express'
import multer from 'multer'
import { celebrate, Joi } from 'celebrate'

import { multerConfig } from './config/multer'
import { PointsController } from './controllers/points-controller'
import { ItemsControlelr } from './controllers/items-controller'

const pointsController = new PointsController()
const itemsController = new ItemsControlelr()

const routes = Router()
const upload = multer(multerConfig)

routes.get('/items', itemsController.index)

routes.post(
	'/points',
	upload.single('image'),
	celebrate({
		body: Joi.object().keys({
			name: Joi.string().required(),
			email: Joi.string().required().email(),
			whatsapp: Joi.number().required(),
			latitude: Joi.number().required(),
			longitude: Joi.number().required(),
			city: Joi.string().required(),
			uf: Joi.string().required().length(2),
			items: Joi.string().required(),
		})
	}, {
		abortEarly: false
	}),
	pointsController.create
)

routes.get('/points', pointsController.index)
routes.get('/points/:id', pointsController.show)

export { routes }
