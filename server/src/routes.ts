import { Router } from 'express'

import { PointsController } from './controllers/points-controller'
import { ItemsControlelr } from './controllers/items-controller'

const pointsController = new PointsController()
const itemsController = new ItemsControlelr()

const routes = Router()

routes.get('/items', itemsController.index)

routes.post('/points', pointsController.create)
routes.get('/points', pointsController.index)
routes.get('/points/:id', pointsController.show)

export { routes }
