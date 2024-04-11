import { Request, Response } from 'express'

import { connection as knex } from '../database/connection'

export class ItemsControlelr {
	async index(_: Request, response: Response) {
		const items = await knex('items').select('*')

		return response.json(items.map(item => {
			return {
				id: item.id,
				title: item.title,
				image: `http://localhost:3333/uploads/${item.image}`,
			}
		}))
	}
}
