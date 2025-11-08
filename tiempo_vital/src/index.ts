import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'

const app = new Hono()
const port = 7000
//((middleware
app.use(cors())
app.use(logger())
app.use(prettyJSON())

//routes

//server




export default app
