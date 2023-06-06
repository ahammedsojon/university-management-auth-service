import express, { Application } from 'express'
import cors from 'cors'
import usersRoute from './app/modules/users/users.route'
const app: Application = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use('/api/v1/users/', usersRoute)
app.use('/api/v1/users/', usersRoute)

export default app
