import { MongoClient } from "mongodb";
import { PrismaClient } from "@prisma/client";
// import Debug from "debug";
import {
  RawArea,
  RawDetection,
  RawRecording,
  MongoDetection,
  MongoRecording,
  MongoArea,
} from "./common";

import { dedupeByProp } from "./utils";

const uri = "mongodb://localhost:27017";
const prisma = new PrismaClient();
const mongo = new MongoClient(uri, { useUnifiedTopology: true });
const rawAreas: RawArea[] = [];
const rawTrackedObjects: RawDetection[] = [];
const rawRecordings: RawRecording[] = [];
let skippedRecordingsNum = 0;
let mongoRecordingsNum = 0;
let mongoTrackerNum = 0;
const trackerHash = ({ id }: { id: number }) => `${id}`;

/**
 * Can be used to create detections and a initial cam
 *
 */
async function _setupOnce(prisma: PrismaClient) {
  await prisma.detectionType.create({ data: { label: "car" } });
  await prisma.detectionType.create({ data: { label: "person" } });
  await prisma.detectionType.create({ data: { label: "bicycle" } });
  await prisma.detectionType.create({ data: { label: "truck" } });
  await prisma.detectionType.create({ data: { label: "bus" } });
  await prisma.detectionType.create({ data: { label: "motorbike" } });
  await prisma.camera.create({
    data: {
      name: "citylab tx2",
      location: "CityLAB",
      timezone: 1,
    },
  });
}

async function main() {
  // await setupOnce(prisma);
  try {
    await mongo.connect();
    const db = mongo.db("opendatacam");
    // TODO: Remove cleanup code
    await prisma.$executeRaw`DELETE from Detection;`;
    await prisma.$executeRaw`DELETE from Area;`;
    await prisma.$executeRaw`DELETE from Recording;`;
    const cameras = await prisma.camera.findMany({
      where: { name: "citylab tx2" },
    });
    if (cameras.length === 0) {
      throw new Error("Could not find camera");
    }

    mongoRecordingsNum = await db.collection("recordings").countDocuments();
    mongoTrackerNum = await db.collection("tracker").countDocuments();
    console.log("tracked objects", mongoTrackerNum);
    console.log("Start tracker processing");
    console.time("tracker");
    await db
      .collection("tracker")
      .find({})
      // .limit(10000)
      .forEach((doc) => {
        // console.log(doc);
        // console.log(typeof doc.recordingId);
        for (const obj of doc.objects) {
          const item: RawDetection = {
            ...(obj as MongoDetection),
            mongoId: doc._id as string,
            recordingId: doc.recordingId as string,
            frameId: doc.frameId as number,
            timestamp: doc.timestamp as Date,
          };
          // console.log(item);
          rawTrackedObjects.push(item);
        }
      });

    console.timeEnd("tracker");
    console.info("End tracker processing");
    console.time("create-index");
    const trackerIndex = Object.fromEntries(
      rawTrackedObjects.map((x) => [trackerHash(x), x]),
    );
    console.timeEnd("create-index");
    console.info("End tracker index creation");
    console.log("Index has", Object.keys(trackerIndex).length, "elements");

    //  ██▀███  ▓█████  ▄████▄   ▒█████   ██▀███  ▓█████▄
    // ▓██ ▒ ██▒▓█   ▀ ▒██▀ ▀█  ▒██▒  ██▒▓██ ▒ ██▒▒██▀ ██▌
    // ▓██ ░▄█ ▒▒███   ▒▓█    ▄ ▒██░  ██▒▓██ ░▄█ ▒░██   █▌
    // ▒██▀▀█▄  ▒▓█  ▄ ▒▓▓▄ ▄██▒▒██   ██░▒██▀▀█▄  ░▓█▄   ▌
    // ░██▓ ▒██▒░▒████▒▒ ▓███▀ ░░ ████▓▒░░██▓ ▒██▒░▒████▓
    // ░ ▒▓ ░▒▓░░░ ▒░ ░░ ░▒ ▒  ░░ ▒░▒░▒░ ░ ▒▓ ░▒▓░ ▒▒▓  ▒
    //   ░▒ ░ ▒░ ░ ░  ░  ░  ▒     ░ ▒ ▒░   ░▒ ░ ▒░ ░ ▒  ▒
    //   ░░   ░    ░   ░        ░ ░ ░ ▒    ░░   ░  ░ ░  ░
    //    ░        ░  ░░ ░          ░ ░     ░        ░
    //                 ░                           ░
    // process recordings
    await db
      .collection("recordings")
      .find({})
      // .limit(100)
      .forEach(function (doc: MongoRecording) {
        rawRecordings.push(doc);
        // get all the areas from all recordings
        // into counter
        // we reduce them later on by their mongo id
        for (const area in doc.areas) {
          const item: RawArea = {
            ...(doc.areas[area] as MongoArea),
            mongoId: area,
          };
          rawAreas.push(item);
        }
      });

    /**
     * this goes into the DB
     */
    const areas = dedupeByProp(rawAreas, "mongoId");
    for await (const area of areas) {
      await prisma.area.create({
        data: {
          street: "",
          streetId: "",
          x1: area.location.point1.x,
          y1: area.location.point1.y,
          x2: area.location.point2.x,
          y2: area.location.point2.y,
          line: "",
          direction: area.type,
          mongoId: area.mongoId,
        },
      });
    }
    console.log("start recording processing");
    console.time("recordings");
    let recCount = 0;
    for await (const recording of rawRecordings) {
      console.log("recording iteration", recCount++);

      if (recording.counterHistory === undefined) {
        skippedRecordingsNum++;
        continue;
      }

      // create recording
      const rec = await prisma.recording.create({
        data: {
          recordingStart: recording.dateStart,
          recordingEnd: recording.dateEnd,
          camera: { connect: { id: cameras[0].id } },
        },
      });

      for (const key of Object.keys(recording.areas)) {
        await prisma.area.update({
          where: { mongoId: key },
          data: {
            recording: { connect: { id: rec.id } },
          },
        });
      }

      const matches = recording.counterHistory.filter(
        (item) =>
          Object.prototype.hasOwnProperty.call(trackerIndex, trackerHash(item)),
        // item.hasOwnProperty(trackerHash(item)),
      );
      console.log("recording has", matches.length, "matches in tracker index");
      console.log(
        "recording history has",
        recording.counterHistory.length,
        "items",
      );
      for await (const item of matches) {
        const indexItem = trackerIndex[`${item.id}`];
        const associatedAreas = await prisma.area.findMany({
          where: { mongoId: item.area },
        });
        if (associatedAreas.length === 0) {
          console.error("No area found for counterObject?? huh?");
        } else {
          const _detection = await prisma.detection.create({
            data: {
              confidence: indexItem.confidence,
              detectedAt: item.timestamp,
              area: { connect: { id: associatedAreas[0].id } },
              detectionType: {
                connectOrCreate: {
                  where: {
                    label: item.name,
                  },
                  create: {
                    label: item.name,
                  },
                },
              },
            },
          });
        }
      }
    }
    console.timeEnd("recordings");
    console.log("end recordings processing");
    console.log(
      "Skipped recordings due to missing history",
      skippedRecordingsNum,
    );
    console.log("Recording Documents from mongo", mongoRecordingsNum);
    console.log("Tracker Documents from mongo", mongoTrackerNum);
  } catch (error) {
    console.error(error);
  } finally {
    await mongo.close();
    // prisma.$disconnect();
  }
}

main().catch(console.error);
