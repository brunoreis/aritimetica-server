-- CreateTable
CREATE TABLE "Lesson" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "assignerUuid" TEXT NOT NULL,
    "assigneeUuid" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lesson_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "User" (
    "uuid" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Permission" (
    "uuid" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "MembershipRole" (
    "uuid" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "MembershipRole_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Group" (
    "uuid" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Group_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "Membership" (
    "uuid" TEXT NOT NULL,
    "userUuid" TEXT NOT NULL,
    "membershipRoleUuid" TEXT NOT NULL,
    "groupUuid" TEXT NOT NULL,

    CONSTRAINT "Membership_pkey" PRIMARY KEY ("uuid")
);

-- CreateTable
CREATE TABLE "_MembershipRoleToPermission" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "_MembershipRoleToPermission_AB_unique" ON "_MembershipRoleToPermission"("A", "B");

-- CreateIndex
CREATE INDEX "_MembershipRoleToPermission_B_index" ON "_MembershipRoleToPermission"("B");

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_assignerUuid_fkey" FOREIGN KEY ("assignerUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lesson" ADD CONSTRAINT "Lesson_assigneeUuid_fkey" FOREIGN KEY ("assigneeUuid") REFERENCES "User"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_userUuid_fkey" FOREIGN KEY ("userUuid") REFERENCES "User"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_groupUuid_fkey" FOREIGN KEY ("groupUuid") REFERENCES "Group"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Membership" ADD CONSTRAINT "Membership_membershipRoleUuid_fkey" FOREIGN KEY ("membershipRoleUuid") REFERENCES "MembershipRole"("uuid") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembershipRoleToPermission" ADD CONSTRAINT "_MembershipRoleToPermission_A_fkey" FOREIGN KEY ("A") REFERENCES "MembershipRole"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MembershipRoleToPermission" ADD CONSTRAINT "_MembershipRoleToPermission_B_fkey" FOREIGN KEY ("B") REFERENCES "Permission"("uuid") ON DELETE CASCADE ON UPDATE CASCADE;
