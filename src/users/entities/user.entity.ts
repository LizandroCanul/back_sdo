import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { UserFavoriteObra } from './user-favorite-obra.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column('text')
  nombreCompleto: string;

  @Column('text', { unique: true })
  email: string;

  @Column('text', { select: false }) // Por seguridad, no se devuelve en consultas normales
  password: string;

  @Column('text', { default: 'user' }) // Roles: 'admin' | 'user'
  roles: string;

  @Column('bool', { default: true })
  isActive: boolean;

  @Column('bool', { default: true }) // Obliga a cambiar la contraseña al inicio
  mustChangePassword: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // --- RELACIÓN: OBRAS FAVORITAS ---
  @OneToMany(() => UserFavoriteObra, (fav) => fav.user, { cascade: true })
  favoritasObras: UserFavoriteObra[];
}