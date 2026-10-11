import {
  pgTable,
  serial,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";

export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  company: text("company"),
  location: text("location"),
  salary: text("salary"),
  employmentType: text("employment_type"),
  description: text("description"),
  url: text("url").notNull().unique(),
  source: text("source").notNull().default("other"),
  postedAt: text("posted_at"),
  extra: jsonb("extra"),
  capturedAt: timestamp("captured_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
