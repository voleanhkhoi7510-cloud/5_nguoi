-- DropForeignKey
ALTER TABLE "family_documents" DROP CONSTRAINT "family_documents_family_id_fkey";

-- DropForeignKey
ALTER TABLE "family_documents" DROP CONSTRAINT "family_documents_member_id_fkey";

-- DropForeignKey
ALTER TABLE "marriages" DROP CONSTRAINT "marriages_partner1_id_fkey";

-- DropForeignKey
ALTER TABLE "marriages" DROP CONSTRAINT "marriages_partner2_id_fkey";

-- DropForeignKey
ALTER TABLE "member_profiles" DROP CONSTRAINT "member_profiles_member_id_fkey";

-- DropForeignKey
ALTER TABLE "parent_child_relationships" DROP CONSTRAINT "parent_child_relationships_child_id_fkey";

-- DropForeignKey
ALTER TABLE "parent_child_relationships" DROP CONSTRAINT "parent_child_relationships_parent_id_fkey";

-- AlterTable
ALTER TABLE "family_documents" ADD COLUMN     "description" TEXT;

-- AlterTable
ALTER TABLE "family_members" ADD COLUMN     "status" VARCHAR(20) NOT NULL DEFAULT 'APPROVED';

-- AlterTable
ALTER TABLE "marriages" ALTER COLUMN "status" SET DEFAULT 'MARRIED';

-- AlterTable
ALTER TABLE "members" ADD COLUMN     "generation" INTEGER NOT NULL DEFAULT 1,
ADD COLUMN     "user_id" BIGINT;

-- AlterTable
ALTER TABLE "parent_child_relationships" ALTER COLUMN "relationship_type" SET DEFAULT 'father';

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "avatar_url" TEXT,
ADD COLUMN     "role" VARCHAR(30) NOT NULL DEFAULT 'MEMBER';

-- CreateTable
CREATE TABLE "posts" (
    "post_id" BIGSERIAL NOT NULL,
    "family_id" BIGINT NOT NULL,
    "author_id" BIGINT NOT NULL,
    "content" TEXT NOT NULL,
    "is_announcement" BOOLEAN NOT NULL DEFAULT false,
    "status" VARCHAR(20) NOT NULL DEFAULT 'ACTIVE',
    "media_urls" TEXT[],
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "posts_pkey" PRIMARY KEY ("post_id")
);

-- CreateTable
CREATE TABLE "post_comments" (
    "comment_id" BIGSERIAL NOT NULL,
    "post_id" BIGINT NOT NULL,
    "author_id" BIGINT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_comments_pkey" PRIMARY KEY ("comment_id")
);

-- CreateTable
CREATE TABLE "post_reactions" (
    "reaction_id" BIGSERIAL NOT NULL,
    "post_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "reaction_type" VARCHAR(20) NOT NULL DEFAULT 'LIKE',
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "post_reactions_pkey" PRIMARY KEY ("reaction_id")
);

-- CreateTable
CREATE TABLE "events" (
    "event_id" BIGSERIAL NOT NULL,
    "family_id" BIGINT NOT NULL,
    "creator_id" BIGINT NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "description" TEXT,
    "event_date" TIMESTAMP(6) NOT NULL,
    "location" VARCHAR(255),
    "media_urls" TEXT[],
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "events_pkey" PRIMARY KEY ("event_id")
);

-- CreateTable
CREATE TABLE "event_rsvps" (
    "rsvp_id" BIGSERIAL NOT NULL,
    "event_id" BIGINT NOT NULL,
    "user_id" BIGINT NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'GOING',
    "updated_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_rsvps_pkey" PRIMARY KEY ("rsvp_id")
);

-- CreateTable
CREATE TABLE "ai_chat_histories" (
    "chat_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT NOT NULL,
    "family_id" BIGINT,
    "conversation_id" VARCHAR(100) NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ai_chat_histories_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "log_id" BIGSERIAL NOT NULL,
    "user_id" BIGINT,
    "action" VARCHAR(50) NOT NULL,
    "entity_type" VARCHAR(50) NOT NULL,
    "entity_id" VARCHAR(50),
    "details" TEXT,
    "ip_address" VARCHAR(50),
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("log_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_post_user_reaction" ON "post_reactions"("post_id", "user_id");

-- CreateIndex
CREATE UNIQUE INDEX "uq_event_user_rsvp" ON "event_rsvps"("event_id", "user_id");

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "member_profiles" ADD CONSTRAINT "member_profiles_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marriages" ADD CONSTRAINT "marriages_partner1_id_fkey" FOREIGN KEY ("partner1_id") REFERENCES "members"("member_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marriages" ADD CONSTRAINT "marriages_partner2_id_fkey" FOREIGN KEY ("partner2_id") REFERENCES "members"("member_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent_child_relationships" ADD CONSTRAINT "parent_child_relationships_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "members"("member_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent_child_relationships" ADD CONSTRAINT "parent_child_relationships_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "members"("member_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "family_documents" ADD CONSTRAINT "family_documents_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "families"("family_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "family_documents" ADD CONSTRAINT "family_documents_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE SET NULL ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "families"("family_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "posts" ADD CONSTRAINT "posts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_comments" ADD CONSTRAINT "post_comments_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_post_id_fkey" FOREIGN KEY ("post_id") REFERENCES "posts"("post_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "post_reactions" ADD CONSTRAINT "post_reactions_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "families"("family_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_creator_id_fkey" FOREIGN KEY ("creator_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_event_id_fkey" FOREIGN KEY ("event_id") REFERENCES "events"("event_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "event_rsvps" ADD CONSTRAINT "event_rsvps_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ai_chat_histories" ADD CONSTRAINT "ai_chat_histories_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "ai_chat_histories" ADD CONSTRAINT "ai_chat_histories_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "families"("family_id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE NO ACTION;
