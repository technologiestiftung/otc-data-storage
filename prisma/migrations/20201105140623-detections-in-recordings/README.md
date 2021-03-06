# Migration `20201105140623-detections-in-recordings`

This migration has been generated by ff6347 at 11/5/2020, 3:06:23 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Detection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detectedAt" DATETIME NOT NULL,
    "confidence" INTEGER NOT NULL,
    "trajectoryId" INTEGER,
    "areaId" INTEGER,
    "detectionTypeId" INTEGER,
    "mongoId" TEXT NOT NULL,
    "recordingId" INTEGER,

    FOREIGN KEY ("trajectoryId") REFERENCES "Trajectory"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("areaId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("detectionTypeId") REFERENCES "DetectionType"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("recordingId") REFERENCES "Recording"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Detection" ("id", "createdAt", "detectedAt", "detectionTypeId", "confidence", "trajectoryId", "areaId", "mongoId") SELECT "id", "createdAt", "detectedAt", "detectionTypeId", "confidence", "trajectoryId", "areaId", "mongoId" FROM "Detection";
DROP TABLE "Detection";
ALTER TABLE "new_Detection" RENAME TO "Detection";
CREATE UNIQUE INDEX "Detection.id_mongoId_unique" ON "Detection"("id", "mongoId");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201105140156-unique-id-and-mongoid..20201105140623-detections-in-recordings
--- datamodel.dml
+++ datamodel.dml
@@ -1,12 +1,12 @@
 datasource db {
   provider = "sqlite"
-  url = "***"
+  url = "***"
 }
 // datasource db {
 //   provider = "postgresql"
-//   url = "***"
+//   url = "***"
 // }
 generator client {
   provider        = "prisma-client-js"
@@ -38,18 +38,20 @@
   trajectories         Trajectory[]
   weathers             Weather[]
   lightningConditions  LightningCondition[]
   recordings           Recording[]
+
 }
 model Recording {
-  id             Int      @id @default(autoincrement())
-  createdAt      DateTime @default(now())
+  id             Int         @id @default(autoincrement())
+  createdAt      DateTime    @default(now())
   recordingStart DateTime
   recordingEnd   DateTime
   areas          Area[]
-  camera         Camera?  @relation(fields: [cameraId], references: [id])
+  camera         Camera?     @relation(fields: [cameraId], references: [id])
   cameraId       Int?
+  detections     Detection[]
 }
 // Area should be equivalent to Area
 // https://opendatacam.github.io/opendatacam/apidoc/#api-Area
@@ -99,8 +101,10 @@
   detectionTypeId Int?
   mongoId         String
   @@unique([id, mongoId])
+  Recording   Recording? @relation(fields: [recordingId], references: [id])
+  recordingId Int?
 }
 model DetectionType {
   id           Int          @id @default(autoincrement())
```
