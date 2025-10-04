import { integer, pgTable, varchar, text, timestamp, boolean } from "drizzle-orm/pg-core";

export const usersTable = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull(),
  age: integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
});

// Hackathon references table for storing IPNS/IPFS references
export const hackathonReferencesTable = pgTable("hackathon_references", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  hackathonId: varchar({ length: 255 }).notNull().unique(), // UUID or slug
  title: varchar({ length: 500 }).notNull(),
  slug: varchar({ length: 255 }).notNull().unique(), // URL-friendly identifier
  ipnsRecord: varchar({ length: 255 }), // IPNS record name (optional)
  ipfsHash: varchar({ length: 255 }).notNull(), // Current IPFS hash
  previousIpfsHash: varchar({ length: 255 }), // Previous IPFS hash for history
  status: varchar({ length: 50 }).notNull().default('active'), // active, archived, deleted
  createdBy: integer().references(() => usersTable.id), // Creator user ID
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  lastSyncedAt: timestamp(), // Last time synced with IPFS
  isPublished: boolean().notNull().default(false), // Whether published to IPNS
});

// Hackathon metadata for quick access without IPFS
export const hackathonMetadataTable = pgTable("hackathon_metadata", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  hackathonId: varchar({ length: 255 }).notNull().unique(),
  title: varchar({ length: 500 }).notNull(),
  description: text(),
  status: varchar({ length: 50 }).notNull(), // live, voting, ended
  registrationClose: timestamp(),
  registrationDaysLeft: integer().default(0),
  techStack: varchar({ length: 500 }),
  level: varchar({ length: 100 }),
  totalPrize: integer().default(0),
  location: varchar({ length: 255 }),
  image: varchar({ length: 1000 }), // Image URL
  subtitle: varchar({ length: 500 }),
  tags: text(), // JSON array of tags
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
});

// IPNS records table for managing IPNS names
export const ipnsRecordsTable = pgTable("ipns_records", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({ length: 255 }).notNull().unique(), // IPNS name (e.g., "hackathons")
  currentIpfsHash: varchar({ length: 255 }).notNull(), // Current IPFS hash
  previousIpfsHash: varchar({ length: 255 }), // Previous hash
  recordType: varchar({ length: 50 }).notNull().default('hackathons'), // Type of records
  isActive: boolean().notNull().default(true),
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp().notNull().defaultNow(),
  lastPublishedAt: timestamp(), // Last time published to IPNS
});
