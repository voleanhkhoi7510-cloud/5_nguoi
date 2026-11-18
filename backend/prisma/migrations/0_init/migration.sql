-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateTable
CREATE TABLE "families" (
    "family_id" BIGSERIAL NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "families_pkey" PRIMARY KEY ("family_id")
);

-- CreateTable
CREATE TABLE "family_branches" (
    "branch_id" BIGSERIAL NOT NULL,
    "family_id" BIGINT NOT NULL,
    "name" VARCHAR(150) NOT NULL,
    "description" TEXT,

    CONSTRAINT "family_branches_pkey" PRIMARY KEY ("branch_id")
);

-- CreateTable
CREATE TABLE "family_documents" (
    "document_id" BIGSERIAL NOT NULL,
    "family_id" BIGINT NOT NULL,
    "member_id" BIGINT,
    "title" VARCHAR(200) NOT NULL,
    "document_type" VARCHAR(50),
    "file_url" TEXT,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "family_documents_pkey" PRIMARY KEY ("document_id")
);

-- CreateTable
CREATE TABLE "marriages" (
    "marriage_id" BIGSERIAL NOT NULL,
    "partner1_id" BIGINT NOT NULL,
    "partner2_id" BIGINT NOT NULL,
    "start_date" DATE,
    "end_date" DATE,
    "status" VARCHAR(30),

    CONSTRAINT "marriages_pkey" PRIMARY KEY ("marriage_id")
);

-- CreateTable
CREATE TABLE "member_profiles" (
    "member_id" BIGINT NOT NULL,
    "occupation" VARCHAR(150),
    "education" VARCHAR(150),
    "biography" TEXT,

    CONSTRAINT "member_profiles_pkey" PRIMARY KEY ("member_id")
);

-- CreateTable
CREATE TABLE "members" (
    "member_id" BIGSERIAL NOT NULL,
    "family_id" BIGINT NOT NULL,
    "branch_id" BIGINT,
    "full_name" VARCHAR(150) NOT NULL,
    "gender" VARCHAR(20),
    "birth_date" DATE,
    "death_date" DATE,
    "created_at" TIMESTAMP(6) DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "members_pkey" PRIMARY KEY ("member_id")
);

-- CreateTable
CREATE TABLE "parent_child_relationships" (
    "relationship_id" BIGSERIAL NOT NULL,
    "parent_id" BIGINT NOT NULL,
    "child_id" BIGINT NOT NULL,
    "relationship_type" VARCHAR(30) NOT NULL,

    CONSTRAINT "parent_child_relationships_pkey" PRIMARY KEY ("relationship_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "uq_parent_child" ON "parent_child_relationships"("parent_id", "child_id");

-- AddForeignKey
ALTER TABLE "family_branches" ADD CONSTRAINT "family_branches_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "families"("family_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "family_documents" ADD CONSTRAINT "family_documents_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "families"("family_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "family_documents" ADD CONSTRAINT "family_documents_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marriages" ADD CONSTRAINT "marriages_partner1_id_fkey" FOREIGN KEY ("partner1_id") REFERENCES "members"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "marriages" ADD CONSTRAINT "marriages_partner2_id_fkey" FOREIGN KEY ("partner2_id") REFERENCES "members"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "member_profiles" ADD CONSTRAINT "member_profiles_member_id_fkey" FOREIGN KEY ("member_id") REFERENCES "members"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "family_branches"("branch_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "members" ADD CONSTRAINT "members_family_id_fkey" FOREIGN KEY ("family_id") REFERENCES "families"("family_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent_child_relationships" ADD CONSTRAINT "parent_child_relationships_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "members"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "parent_child_relationships" ADD CONSTRAINT "parent_child_relationships_parent_id_fkey" FOREIGN KEY ("parent_id") REFERENCES "members"("member_id") ON DELETE NO ACTION ON UPDATE NO ACTION;
