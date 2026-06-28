export function createRoutesService(db) {

  async function existeRegistro(esquema, tabla, campo, valor, operador = 'eq') {
    return db.existeRegistro(esquema, tabla, campo, valor, operador)
  }

  async function insertarRuta(payload) {
    const yaExiste = await existeRegistro(
      'tracking',
      'routes',
      'name',
      payload.name,
      'ilike'
    )

    if (yaExiste) {
      throw new Error(`La ruta "${payload.name}" ya existe`)
    }

    return db.insertarRuta(payload)
  }

  async function getRoutes() {
    const data = await db.getRoutes()

    return data.map(route => ({
      id: route.id,
      name: route.name,
      geometry: [],
      distance_m: Number(route.distance_m || 0),
      puntos: 0,
      date: route.date,
      created_at: route.created_at
    }))
  }

  async function getRouteById(id) {
    const data = await db.getRouteById(id)

    return {
      ...data,
      geometry: Array.isArray(data.geometry) ? data.geometry : [],
      puntos: Array.isArray(data.geometry) ? data.geometry.length : 0
    }
  }

  async function actualizarNombreRuta(id, nombre) {
    return db.actualizarNombreRuta(id, nombre)
  }

  async function borrarRuta(schema, table, id) {
    return db.borrarRuta(schema, table, id)
  }

  async function getActivityTypes() {
    return db.getActivityTypes()
  }

  return {
    insertarRuta,
    getRoutes,
    getRouteById,
    actualizarNombreRuta,
    borrarRuta,
    getActivityTypes
  }
}