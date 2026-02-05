import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Municipio } from './entities/municipio.entity';
import type { Point } from 'geojson';

// 👇 CAMBIO CLAVE: Quitamos el "* as" para importar el arreglo directo
import municipiosData from './data/yucatan.json'; 

@Injectable()
export class MunicipiosService implements OnModuleInit {
  private readonly logger = new Logger('MunicipiosSystem');

  constructor(
    @InjectRepository(Municipio)
    private readonly municipioRepo: Repository<Municipio>,
  ) {}

  async onModuleInit() {
    await this.seedDatabase();
  }

  private async seedDatabase() {
    const total = await this.municipioRepo.count();
    
    // 🔍 LÓGICA DE AUTO-CORRECCIÓN
    if (total > 0 && total < 106) {
      this.logger.warn(`🧹 Detecté datos incompletos (${total} registros). Limpiando tabla para reinicio limpio...`);
      await this.municipioRepo.clear(); 
      this.logger.log('✨ Tabla limpia. Procediendo a la inyección oficial.');
    } else if (total >= 106) {
      this.logger.log('✅ Catálogo completo detectado. No se requieren cambios.');
      return;
    }

    // 2. Inyección de los 106 Municipios Oficiales
    this.logger.log(`🌱 Sembrando 106 municipios de Yucatán...`);

    // Hacemos un casting seguro por si acaso TypeScript se pone estricto
    const listaMunicipios = municipiosData as Array<{ nombre: string, lat: number, lng: number }>;

    const entidades = listaMunicipios.map(m => {
      const ubicacion: Point = {
        type: 'Point',
        coordinates: [m.lng, m.lat], 
      };

      return this.municipioRepo.create({
        nombre: m.nombre,
        ubicacion: ubicacion,
        activo: true
      });
    });

    await this.municipioRepo.save(entidades);
    this.logger.log(`🏁 ¡Éxito! Se han cargado ${entidades.length} municipios correctamente.`);
  }

  // --- MÉTODOS DE LECTURA ---

  async findAll() {
    return await this.municipioRepo.find({
      where: { activo: true },
      order: { nombre: 'ASC' } 
    });
  }

  async findOne(id: number) {
    return await this.municipioRepo.findOneBy({ id });
  }
}