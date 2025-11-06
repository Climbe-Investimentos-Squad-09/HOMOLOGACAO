import { CreateReuniaoDto } from './create-meeting.dto';
import { StatusReuniao, ModalidadeReuniao } from '../Entities/meeting.entity';

export interface UpdateReuniaoDto extends PartialType(CreateReuniaoDto) {  
  titulo?: string;

  pauta?: string;
    
  status?: StatusReuniao;
  
  modalidade?: ModalidadeReuniao;
  
  dataHoraInicio?: string;
  
  dataHoraFim?: string;

  local?: string;
    
  linkRemoto?: string;
}
