import essenProvincias from '../constants/essenProvincias.json'
import essenLocalidades from '../constants/essenLocalidades.json'

const provincias = essenProvincias.provincias
const localidades = essenLocalidades.localidades

const CAPITAL_FEDERAL_ID = 1

export function getProvincias() {
  return provincias.map((p) => ({ nombre: p.nombre, id: p.id }))
}

export function getLocalidadesOf(provinciaId) {
  // Capital federal es un caso especial ya que solo tiene una localidad.
  // El usuario debe elegir el barrio.
  if (provinciaId === CAPITAL_FEDERAL_ID) {
    return provincias.filter((p) => p.id === CAPITAL_FEDERAL_ID)[0].barrios
  }

  const partidosIds = provincias.filter((p) => p.id === provinciaId)[0].partidos.map((p) => p.id)
  return localidades.filter((l) => partidosIds.includes(l.partido))
}

export function getDireccionObject(provinciaId, localidadId) {
  const provincia = provincias.filter((p) => p.id === provinciaId)[0]

  if (provinciaId === CAPITAL_FEDERAL_ID) {
    const barrio = provincia.barrios.filter((b) => b.id === localidadId)[0]
    const partido = provincia.partidos[0]
    const localidad = localidades.filter((l) => l.partido === partido.id)[0]

    return {
      provincia: provincia.nombre,
      provinciaId: provincia.id,
      barrio: barrio.nombre,
      barrioId: barrio.id,
      partido: partido.nombre,
      partidoId: partido.id,
      localidad: localidad.nombre,
      localidadId: localidad.id,
    }
  }

  const localidad = localidades.filter((l) => l.id === localidadId)[0]
  const partido = provincia.partidos.filter((p) => p.id === localidad.partido)[0]
  return {
    provincia: provincia.nombre,
    provinciaId: provincia.id,
    barrio: '',
    barrioId: '',
    partido: partido.nombre,
    partidoId: partido.id,
    localidad: localidad.nombre,
    localidadId: localidad.id,
  }
}
