import { ECharacterRole, EMediaRelationType } from '../enums';
import { IAniListCharacter } from './ani-list-character.interface';
import { IAniListMedia } from './ani-list-media.interface';
import { IAniListStaffRoleType } from './ani-list-staff-role-type.interface';
import { IAniListStaff } from './ani-list-staff.interface';

export interface IAniListMediaEdge {
  node?: IAniListMedia
  id?: number;
  relationType?: EMediaRelationType;
  isMainStudio?: boolean;
  characters?: IAniListCharacter[];
  characterRole?: ECharacterRole;
  characterName?: string;
  roleNotes?: string;
  dubGroup?: string;
  staffRole?: string;
  voiceActors?: IAniListStaff[];
  voiceActorRoles?: IAniListStaffRoleType[];
  favouriteOrder?: number;
}