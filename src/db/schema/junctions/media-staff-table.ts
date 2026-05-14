import { index, integer, pgTable, primaryKey, text } from 'drizzle-orm/pg-core';
import { mediaTable, staffTable } from '../tables';

export const mediaStaffTable = pgTable('media_staff',
  {
    mediaId: integer('media_id').notNull().references(() => mediaTable.id, { onDelete: 'cascade' }),
    staffId: integer('staff_id').notNull().references(() => staffTable.id, { onDelete: 'cascade' }),
    /** The staff member's role on this production */
    staffRole: text('staff_role').notNull(),
  },
  (t) => [
    // staffRole is part of the PK because one staff member can hold
    // multiple roles on the same media (e.g. Director + Script)
    primaryKey({ columns: [t.mediaId, t.staffId, t.staffRole] }),
    index('media_staff_media_idx').on(t.mediaId),
    index('media_staff_staff_idx').on(t.staffId),
  ]
);
