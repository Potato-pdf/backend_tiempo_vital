import "reflect-metadata";
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { logger } from 'hono/logger'
import { prettyJSON } from 'hono/pretty-json'
import { UserRoutes } from './application/routes/user/user.routes'
import { AppDataSource } from './infrestructure/db/database.connection'

const app = new Hono()
const port = 7000
//((middleware
app.use(cors())
app.use(logger())
app.use(prettyJSON())

//routes
app.route("/user", UserRoutes);
//server
AppDataSource.initialize()
    .then(() => {
        console.log("Database connected")
        Bun.serve({
            fetch: app.fetch,
            port: port,
        })
        console.log(`Server running on port ${port}`)
    })
    .catch((error) => {
        console.log("Database connection error: ", error)
    })




export default app
