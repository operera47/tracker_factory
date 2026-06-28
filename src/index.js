import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { adapter } from './factory.js'
import { createRoutesService } from './basedatos/routesService.js'

const app = express()
app.use(cors())
app.use(express.json())

const routesService = createRoutesService(adapter)

// Health check (sin autenticación)
app.get('/health', (req, res) => res.json({ ok: true }))

// Activity Types
app.get('/activity-types', async (req, res) => {
  try {
    const data = await routesService.getActivityTypes()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

// Routes
app.get('/routes', async (req, res) => {
  try {
    const data = await routesService.getRoutes()
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.get('/routes/:id', async (req, res) => {
  try {
    const data = await routesService.getRouteById(req.params.id)
    if (!data) return res.status(404).json({ error: 'Ruta no encontrada' })
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.post('/routes', async (req, res) => {
  try {
    const data = await routesService.insertarRuta(req.body)
    res.status(201).json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.patch('/routes/:id', async (req, res) => {
  try {
    const data = await routesService.actualizarRuta(req.params.id, req.body)
    res.json(data)
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.delete('/routes/:id', async (req, res) => {
  try {
    await routesService.borrarRuta('tracking', 'routes', req.params.id)
    res.status(204).send()
  } catch (err) {
    res.status(500).json({ error: err.message })
  }
})

app.listen(process.env.PORT, () => {
  console.log(`✅ API en puerto ${process.env.PORT}`)
})