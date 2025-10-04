CREATE TABLE "hackathon_metadata" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "hackathon_metadata_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"hackathonId" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"description" text,
	"status" varchar(50) NOT NULL,
	"registrationClose" timestamp,
	"registrationDaysLeft" integer DEFAULT 0,
	"techStack" varchar(500),
	"level" varchar(100),
	"totalPrize" integer DEFAULT 0,
	"location" varchar(255),
	"image" varchar(1000),
	"subtitle" varchar(500),
	"tags" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "hackathon_metadata_hackathonId_unique" UNIQUE("hackathonId")
);
--> statement-breakpoint
CREATE TABLE "hackathon_references" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "hackathon_references_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"hackathonId" varchar(255) NOT NULL,
	"title" varchar(500) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"ipnsRecord" varchar(255),
	"ipfsHash" varchar(255) NOT NULL,
	"previousIpfsHash" varchar(255),
	"status" varchar(50) DEFAULT 'active' NOT NULL,
	"createdBy" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastSyncedAt" timestamp,
	"isPublished" boolean DEFAULT false NOT NULL,
	CONSTRAINT "hackathon_references_hackathonId_unique" UNIQUE("hackathonId"),
	CONSTRAINT "hackathon_references_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "ipns_records" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "ipns_records_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" varchar(255) NOT NULL,
	"currentIpfsHash" varchar(255) NOT NULL,
	"previousIpfsHash" varchar(255),
	"recordType" varchar(50) DEFAULT 'hackathons' NOT NULL,
	"isActive" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL,
	"lastPublishedAt" timestamp,
	CONSTRAINT "ipns_records_name_unique" UNIQUE("name")
);
--> statement-breakpoint
ALTER TABLE "hackathon_references" ADD CONSTRAINT "hackathon_references_createdBy_users_id_fk" FOREIGN KEY ("createdBy") REFERENCES "public"."users"("id") ON DELETE no action ON UPDATE no action;