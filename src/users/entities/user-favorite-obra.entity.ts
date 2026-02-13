import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn, CreateDateColumn, Unique, Column } from 'typeorm';
import { User } from './user.entity';
import { Obra } from '../../obras/entities/obra.entity';

@Entity('user_favorite_obra')
@Unique(['user', 'obra']) // Un usuario no puede marcar la misma obra como favorita dos veces
export class UserFavoriteObra {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.favoritasObras, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ name: 'user_id', type: 'uuid' })
  userId: string;

  @ManyToOne(() => Obra, (obra) => obra.usuariosQueLoMarcanFavorita, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'obra_id' })
  obra: Obra;

  @Column({ name: 'obra_id' })
  obraId: number;

  @CreateDateColumn()
  createdAt: Date;
}
