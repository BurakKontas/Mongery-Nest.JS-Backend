-- CreateTable
CREATE TABLE "Minio" (
    "id" SERIAL NOT NULL,
    "fileName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,

    CONSTRAINT "Minio_pkey" PRIMARY KEY ("id")
);
