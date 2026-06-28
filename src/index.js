import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { adapter } from './factory.js'
import { createRoutesService } from './basedatos/routesService.js'

const app = express()
app.use(cors())
app.use(express.json())

const routesService = createRoutesService(adapter)

app.get('/health', (req, res) => res.json({ ok: true }))

app.get('/routes', async (req, res) => {
  try {
    const data = await routesService.getRoutes()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(process.env.PORT, () => {
  console.log(`✅ API en puerto ${process.env.PORT}`)
})