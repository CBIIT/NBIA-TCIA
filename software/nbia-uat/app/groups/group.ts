import {PgRole} from '../../app/pgRoles/pgRole';

export interface Group {
  userGroup: string;
  description: string;
  pgs: PgRole[];
}

