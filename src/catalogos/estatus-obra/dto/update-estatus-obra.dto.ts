import { PartialType } from '@nestjs/mapped-types';
import { CreateEstatusObraDto } from './create-estatus-obra.dto';

export class UpdateEstatusObraDto extends PartialType(CreateEstatusObraDto) {}
