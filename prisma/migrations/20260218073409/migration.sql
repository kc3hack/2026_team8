-- CreateTable
CREATE TABLE "USERS" (
    "user_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "name" VARCHAR NOT NULL,
    "email" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(6) NOT NULL,
    "clerk_id" VARCHAR NOT NULL,

    CONSTRAINT "USERS_pkey" PRIMARY KEY ("user_id")
);

-- CreateTable
CREATE TABLE "CHATLIST" (
    "chat_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_id" UUID NOT NULL,
    "is_pinned" BOOLEAN NOT NULL,
    "chat_title" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "CHATLIST_pkey" PRIMARY KEY ("chat_id")
);

-- CreateTable
CREATE TABLE "BRANCHES" (
    "branch_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "chat_id" UUID NOT NULL,
    "parent_branch_id" UUID,
    "parent_block_id" UUID,
    "branch_title" VARCHAR NOT NULL,
    "status" VARCHAR NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(6) NOT NULL,
    "depth" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "BRANCHES_pkey" PRIMARY KEY ("branch_id")
);

-- CreateTable
CREATE TABLE "BLOCK" (
    "block_id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "branch_id" UUID NOT NULL,
    "user_content" TEXT NOT NULL,
    "ai_content" TEXT NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "update_at" TIMESTAMP(6) NOT NULL,

    CONSTRAINT "BLOCK_pkey" PRIMARY KEY ("block_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "USERS_clerk_id_key" ON "USERS"("clerk_id");

-- AddForeignKey
ALTER TABLE "CHATLIST" ADD CONSTRAINT "CHATLIST_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "USERS"("user_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BRANCHES" ADD CONSTRAINT "BRANCHES_chat_id_fkey" FOREIGN KEY ("chat_id") REFERENCES "CHATLIST"("chat_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BRANCHES" ADD CONSTRAINT "BRANCHES_parent_block_id_fkey" FOREIGN KEY ("parent_block_id") REFERENCES "BLOCK"("block_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BRANCHES" ADD CONSTRAINT "BRANCHES_parent_branch_id_fkey" FOREIGN KEY ("parent_branch_id") REFERENCES "BRANCHES"("branch_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BLOCK" ADD CONSTRAINT "BLOCK_branch_id_fkey" FOREIGN KEY ("branch_id") REFERENCES "BRANCHES"("branch_id") ON DELETE RESTRICT ON UPDATE CASCADE;
