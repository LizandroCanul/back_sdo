# 📋 Contexto de Sesión - Back_SdO
> **Fecha:** 3 de marzo de 2026  
> **Proyecto:** API NestJS para gestión de obras públicas en Yucatán  
> **Base de datos:** PostgreSQL con TypeORM (synchronize: true)

---

## 🏗️ Arquitectura General

```
AppModule (raíz)
├── ConfigModule (.env global)
├── TypeORM (PostgreSQL)
├── AuthModule          → Autenticación JWT
├── UsersModule         → Gestión de usuarios + favoritos
├── ObrasModule         → CRUD de obras públicas
├── DependenciasModule  → Catálogo de dependencias gubernamentales
├── MunicipiosModule    → 106 municipios de Yucatán (auto-seeding)
├── LocalidadModule     → ⚠️ PENDIENTE DE DECISIÓN (ver abajo)
├── TipoProyectoModule  → Catálogo de tipos de proyecto
├── EstatusObraModule   → Catálogo de estatus de obra
└── EjercicioFiscalModule → Catálogo de ejercicios fiscales
```

---

## 🔑 Decisiones Arquitectónicas Tomadas

### 1. Flujo de Geolocalización (DEFINIDO)
```
1. Frontend: Obtiene lista de municipios (GET /municipios)
2. Frontend: Centra el mapa con coordenadas del municipio seleccionado
3. Frontend: Usuario marca un punto en el mapa
4. Frontend: SDK del mapa (Google Maps/Mapbox/etc.) hace REVERSE GEOCODING
   → Obtiene: calle, colonia, nombre del lugar, etc.
5. Frontend: Muestra formulario EDITABLE con datos obtenidos
   → El admin PUEDE modificar cualquier campo antes de guardar
6. Frontend: POST /obras → Envía texto libre + coordenadas al backend
7. Backend: Guarda en tabla obra_ubicaciones TAL CUAL llega
```

### 2. Localidad - API de Geolocalización va en el FRONTEND
- **Decisión:** La API de geolocalización se consume DIRECTAMENTE desde el frontend
- **Razón:** El mapa ya está en el frontend, menos latencia, los SDKs de mapas ya incluyen geocoding
- **El backend NO necesita ser proxy** de la API de geolocalización
- **LocalidadModule en backend:** No se necesita para este flujo

### 3. ObraUbicacion usa TEXTO LIBRE (NO FK a localidades)
- `direccion` → String editable (dato de la API, modificable por admin)
- `localidadReferencia` → String editable (colonia/localidad, modificable)
- `referenciaLugar` → String editable (referencia adicional, modificable)
- `geometriaJson` → JSON con coordenadas del punto marcado
- `municipioId` → FK real al catálogo de municipios
- **Razón:** El admin debe poder editar libremente los textos antes de guardar

### 4. Municipios como "Ancla" del Mapa
- 106 municipios precargados desde yucatan.json (auto-seeding)
- Cada municipio tiene un Point GeoJSON (centro geográfico)
- El mapa usa este punto para centrar/volar al polígono del municipio
- Índice espacial configurado

---

## 📊 Estado de Módulos

| Módulo | Estado | Notas |
|--------|--------|-------|
| **Auth** | ✅ Completo | JWT + Roles + Guards. Secret hardcodeado (cambiar en prod) |
| **Users** | ✅ Completo | CRUD + Favoritos (UserFavoriteObra) |
| **Obras** | ✅ Completo | CRUD + Filtros + Ubicaciones (ObraUbicacion) |
| **Dependencias** | ✅ Completo | CRUD básico |
| **Municipios** | ✅ Completo | Auto-seeding 106 municipios + GeoJSON Point |
| **TipoProyecto** | ✅ Completo | Catálogo CRUD |
| **EstatusObra** | ✅ Completo | Catálogo CRUD |
| **EjercicioFiscal** | ✅ Completo | Catálogo CRUD |
| **Localidad** | ⚠️ PENDIENTE | Servicio vacío, DTOs vacíos, sin TypeORM. Decidir: eliminar o limpiar |

---

## 🔗 Mapa de Relaciones (Entidades)

```
User ──1:N──> UserFavoriteObra <──N:1── Obra
                                         │
                    ┌────────────────────┤ (FKs)
                    │                    │
                    ▼                    ▼
              Municipio            EjercicioFiscal
              Dependencia          TipoProyecto
              EstatusObra
                    │
                    │ 1:N
                    ▼
              ObraUbicacion
                    │
                    ▼ (FK)
              Municipio
```

### Campos clave de ObraUbicacion:
- `municipioId` (FK → municipios)
- `direccion` (texto libre)
- `localidadReferencia` (texto libre)
- `referenciaLugar` (texto libre)
- `tipoGeometria` (PUNTO | RUTA | POLIGONO)
- `geometriaJson` (JSON con coordenadas)
- `orden` (posición)

---

## ⚠️ Pendientes Identificados

1. **LocalidadModule** → Decidir si eliminarlo o dejarlo como placeholder limpio
2. **JWT Secret** → Está hardcodeado en auth.module.ts, mover a .env para producción
3. **LocalidadEntity** → Si se elimina el módulo, limpiar la entity también
4. **Validaciones cruzadas** → Obras no valida que los IDs de catálogos existan antes de guardar

---

## 📁 Estructura de Archivos Relevante

```
src/
├── auth/           → Login, JWT, Guards, Decoradores de roles
├── users/          → Usuarios + UserFavoriteObra
├── obras/          → Obras + ObraUbicacion (punto principal del sistema)
├── dependencias/   → Catálogo independiente
├── municipios/     → 106 municipios con auto-seeding desde JSON
└── catalogos/
    ├── localidad/       → ⚠️ PENDIENTE
    ├── tipo-proyecto/   → Catálogo independiente
    ├── estatus-obra/    → Catálogo independiente
    └── ejercicio-fiscal/→ Catálogo independiente
```

---

> **Nota:** Este archivo fue generado como resumen de sesión de trabajo.
> Continuar desarrollo bajo este contexto.
