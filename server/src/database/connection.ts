import path from 'node:path'
import knex from 'knex'

export const connection = knex({
	client: 'sqlite3',
	connection: {
		filename: path.resolve(__dirname, 'database.sqlite')
	},
	useNullAsDefault: true,
})
