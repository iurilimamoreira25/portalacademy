-- AlterTable
ALTER TABLE "TrainingSession" ADD COLUMN     "moduleId" TEXT;

-- CreateTable
CREATE TABLE "Module" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "summary" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "estimatedMinutes" INTEGER NOT NULL DEFAULT 6,
    "objective" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "whenToUse" TEXT NOT NULL,
    "whenToAvoid" TEXT NOT NULL,
    "practicalExample" TEXT NOT NULL,
    "commonMistakes" JSONB NOT NULL,
    "tips" JSONB NOT NULL,
    "practiceBriefing" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Module_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuizQuestion" (
    "id" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "question" TEXT NOT NULL,
    "options" JSONB NOT NULL,
    "correctIndex" INTEGER NOT NULL,
    "explanation" TEXT,

    CONSTRAINT "QuizQuestion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserModuleProgress" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "moduleId" TEXT NOT NULL,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completedAt" TIMESTAMP(3),
    "quizScore" INTEGER,
    "quizPassed" BOOLEAN NOT NULL DEFAULT false,
    "practiceSessions" INTEGER NOT NULL DEFAULT 0,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserModuleProgress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Module_slug_key" ON "Module"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "UserModuleProgress_userId_moduleId_key" ON "UserModuleProgress"("userId", "moduleId");

-- AddForeignKey
ALTER TABLE "TrainingSession" ADD CONSTRAINT "TrainingSession_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizQuestion" ADD CONSTRAINT "QuizQuestion_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserModuleProgress" ADD CONSTRAINT "UserModuleProgress_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserModuleProgress" ADD CONSTRAINT "UserModuleProgress_moduleId_fkey" FOREIGN KEY ("moduleId") REFERENCES "Module"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
