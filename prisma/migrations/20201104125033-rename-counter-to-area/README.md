# Migration `20201104125033-rename-counter-to-area`

This migration has been generated by fabianmoronzirfas at 11/4/2020, 1:50:33 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TABLE "Area" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "street" TEXT NOT NULL,
    "streetId" TEXT NOT NULL,
    "x1" REAL NOT NULL,
    "y1" REAL NOT NULL,
    "x2" REAL NOT NULL,
    "y2" REAL NOT NULL,
    "line" TEXT NOT NULL,
    "direction" TEXT NOT NULL,
    "recordingId" INTEGER,
    "comment" TEXT,

    FOREIGN KEY ("recordingId") REFERENCES "Recording"("id") ON DELETE SET NULL ON UPDATE CASCADE
)

PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Detection" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "detectedAt" DATETIME NOT NULL,
    "confidence" INTEGER NOT NULL,
    "trajectoryId" INTEGER,
    "counterId" INTEGER,
    "detectionTypeId" INTEGER,

    FOREIGN KEY ("trajectoryId") REFERENCES "Trajectory"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("counterId") REFERENCES "Area"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    FOREIGN KEY ("detectionTypeId") REFERENCES "DetectionType"("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Detection" ("id", "createdAt", "detectedAt", "counterId", "detectionTypeId", "confidence", "trajectoryId") SELECT "id", "createdAt", "detectedAt", "counterId", "detectionTypeId", "confidence", "trajectoryId" FROM "Detection";
DROP TABLE "Detection";
ALTER TABLE "new_Detection" RENAME TO "Detection";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON

PRAGMA foreign_keys=off;
DROP TABLE "Counter";
PRAGMA foreign_keys=on
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration 20201103180237-counter-comment..20201104125033-rename-counter-to-area
--- datamodel.dml
+++ datamodel.dml
@@ -2,14 +2,14 @@
 // learn more about it in the docs: https://pris.ly/d/prisma-schema
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
   provider = "prisma-client-js"
@@ -39,26 +39,26 @@
   angle                String?
   trajectories         Trajectory[]
   weathers             Weather[]
   lightningConditions  LightningCondition[]
-  // Counter              Counter[]
+  // Area              Area[]
   recordings           Recording[]
 }
 model Recording {
-  id             Int       @id @default(autoincrement())
-  createdAt      DateTime  @default(now())
+  id             Int      @id @default(autoincrement())
+  createdAt      DateTime @default(now())
   recordingStart DateTime
   recordingEnd   DateTime
-  counters       Counter[]
-  camera         Camera?   @relation(fields: [cameraId], references: [id])
+  areas          Area[]
+  camera         Camera?  @relation(fields: [cameraId], references: [id])
   cameraId       Int?
 }
-// Counter should be equivalent to Counter
-// https://opendatacam.github.io/opendatacam/apidoc/#api-Counter
+// Area should be equivalent to Area
+// https://opendatacam.github.io/opendatacam/apidoc/#api-Area
 // curl "http://192.168.1.210:8080/counter/areas"
-model Counter {
+model Area {
   id        Int      @id @default(autoincrement())
   createdAt DateTime @default(now())
   street    String
   // manually
@@ -86,18 +86,18 @@
 }
 // is there also a detection object which holds all the objects
 // of every frame detected?
-// https://opendatacam.github.io/opendatacam/apidoc/#api-Recording-Counter_data
+// https://opendatacam.github.io/opendatacam/apidoc/#api-Recording-Area_data
 model Detection {
   id              Int            @id @default(autoincrement())
   createdAt       DateTime       @default(now())
   detectedAt      DateTime
   confidence      Int
   // could have a relation to the trajectories
   trajectory      Trajectory?    @relation(fields: [trajectoryId], references: [id])
   trajectoryId    Int?
-  counter         Counter?       @relation(fields: [counterId], references: [id])
+  counter         Area?          @relation(fields: [counterId], references: [id])
   counterId       Int?
   detectionType   DetectionType? @relation(fields: [detectionTypeId], references: [id])
   detectionTypeId Int?
 }
```
