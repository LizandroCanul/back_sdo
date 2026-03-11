import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ObrasModule } from './obras/obras.module';
import { DependenciasModule } from './dependencias/dependencias.module';
import { MunicipiosModule } from './municipios/municipios.module';
import { LocalidadModule } from './catalogos/localidad/localidad.module';
import { TipoProyectoModule } from './catalogos/tipo-proyecto/tipo-proyecto.module';
import { EstatusObraModule } from './catalogos/estatus-obra/estatus-obra.module';
import { EjercicioFiscalModule } from './catalogos/ejercicio-fiscal/ejercicio-fiscal.module';
import { SectorModule } from './catalogos/sector/sector.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { PresenceModule } from './presence/presence.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DATABASE_HOST || 'localhost',
      port: parseInt(process.env.DATABASE_PORT || '5432'),
      username: process.env.DATABASE_USER || 'admin',
      password: process.env.DATABASE_PASSWORD || 'password123',
      database: process.env.DATABASE_NAME || 'obras_yucatan_db',
      entities: ['dist/**/*.entity.js'],
      synchronize: true,
      logging: false,
    }),
    ObrasModule,
    DependenciasModule,
    MunicipiosModule,
    LocalidadModule,
    TipoProyectoModule,
    EstatusObraModule,
    EjercicioFiscalModule,
    SectorModule,
    AuthModule,
    UsersModule,
    PresenceModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
