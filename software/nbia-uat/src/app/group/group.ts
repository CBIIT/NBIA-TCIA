import {PgRole} from '../pgRole/pgRole';

export interface Group {
  userGroup: string;
  description: string;
  pgs: PgRole[];
}

