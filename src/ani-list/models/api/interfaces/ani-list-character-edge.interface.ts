import { ECharacterRole } from '../enums';
import { IAniListCharacter } from './ani-list-character.interface';
import { IAniListMedia } from './ani-list-media.interface';
import { IAniListStaffRoleType } from './ani-list-staff-role-type.interface';
import { IAniListStaff } from './ani-list-staff.interface';

export interface IAniListCharacterEdge {
  node?: IAniListCharacter;
  id?: number;
  role?: ECharacterRole;
  name?: string;
  voiceActors?: IAniListStaff[];
  voiceActorRoles?: IAniListStaffRoleType[];
  media?: IAniListMedia[];
  favouriteOrder?: number;
}