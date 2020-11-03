import { MongoClient } from "mongodb";
const uri = "mongodb://localhost:27017";
import { PrismaClient } from "@prisma/client";
import {
  RawCounter,
  RawDetection,
  RawRecording,
  MongoDetection,
  MongoRecording,
  MongoCounter,
} from "./common";

import { dedupeByProp } from "./utils";
import { count } from "console";

const prisma = new PrismaClient();
const client = new MongoClient(uri, { useUnifiedTopology: true });
const rawCounter: RawCounter[] = [];
const rawTrackedObjects: RawDetection[] = [];
const rawRecordings: RawRecording[] = [];

async function setupOnce(prisma: PrismaClient) {
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
    // TODO: Remove cleanup code
    await prisma.$executeRaw`DELETE from Detection;`;
    await prisma.$executeRaw`DELETE from Counter;`;
    await client.connect();
    const db = client.db("opendatacam");

    console.log(
      "recordings documents",
      await db.collection("recordings").countDocuments(),
    );
    console.log(
      "tracker documents ",
      await db.collection("tracker").countDocuments(),
    );

    // let countTracker = 0;
    console.log("Start tracker processing");
    console.time("tracker");
    await db
      .collection("tracker")
      .find({})
      .limit(1000)
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
      .limit(10)
      .forEach(function (doc: MongoRecording) {
        rawRecordings.push(doc);
        // get all the areas from all recordings
        // into counter
        // we reduce them later on by their mongo id
        for (const area in doc.areas) {
          const item: RawCounter = {
            ...(doc.areas[area] as MongoCounter),
            mongoId: area,
          };
          rawCounter.push(item);
          // console.log(area);
          // console.log(doc.areas[area].name);
          // console.log(doc.areas[area]);
        }
      });

    /**
     * this goes into the DB
     */
    const counters = dedupeByProp(rawCounter, "mongoId");
    console.log(counters);
    for await (const counter of counters) {
      await prisma.counter.create({
        data: {
          street: "",
          streetId: "",
          x1: counter.location.point1.x,
          y1: counter.location.point1.y,
          x2: counter.location.point2.x,
          y2: counter.location.point2.y,
          line: "",
          direction: counter.type,
          comment: counter.mongoId,
        },
      });
    }
    console.log("start detection processing");
    let debug = 0;
    console.time("detections");
    for await (const recording of rawRecordings) {
      if (debug === 0) {
        console.log(recording);
        debug = 1;
      }
      if (!recording.counterHistory) {
        continue;
      }
      // create recording
      // connect to counter
      // connect to camera
      for await (const item of recording.counterHistory) {
        for await (const trackItem of rawTrackedObjects) {
          if (item.id === trackItem.id) {
            // connect detection to counter by mongoid
            await prisma.detection.create({
              data: {
                confidence: trackItem.confidence,
                detectedAt: item.timestamp,
                detectionType: {
                  connect: {
                    label: item.name,
                  },
                },
              },
            });
          }
        }
      }
    }
    console.timeEnd("detections");
    console.log("end detection processing");
  } catch (error) {
    console.error(error);
  } finally {
    await client.close();
    // prisma.$disconnect();
  }
}

main().catch(console.error);
