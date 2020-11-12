import { MongoClient } from "mongodb";
import { PrismaClient } from "@prisma/client";
import groupBy from "lodash/groupBy";
// import Debug from "debug";
import {
  RawArea,
  RawDetection,
  RawRecording,
  MongoDetection,
  MongoRecording,
  MongoArea,
  Dictionary,
} from "./common";

import { dedupeByProp, writeFileAsync } from "./utils";
import console from "console";

const uri = "mongodb://localhost:27017";
const prisma = new PrismaClient();
const mongo = new MongoClient(uri, { useUnifiedTopology: true });
const rawAreas: RawArea[] = [];
const rawTrackedObjects: RawDetection[] = [];
const rawRecordings: RawRecording[] = [];
let skippedRecordingsNum = 0;
let mongoRecordingsNum = 0;
let mongoTrackerNum = 0;
const trackerHash = ({
  id,
  frameId,
  recordingId,
  name,
}: {
  id: number;
  frameId: number;
  recordingId: string;
  name: string;
}) => `${id}|${frameId}|${recordingId}|${name}`;

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
  console.time("all");
  try {
    await _setupOnce(prisma);
    await mongo.connect();
    const db = mongo.db("opendatacam");
    // TODO: Remove cleanup code
    // await prisma.$executeRaw`DELETE from Detection;`;
    // await prisma.$executeRaw`DELETE from Area;`;
    // await prisma.$executeRaw`DELETE from Recording;`;
    // await prisma.$executeRaw`TRUNCATE TABLE Detection;`;
    // await prisma.$executeRaw`TRUNCATE TABLE Area;`;
    // await prisma.$executeRaw`TRUNCATE TABLE Recording;`;
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
      // .limit(100000)
      .forEach((doc) => {
        // console.log(doc);
        // console.log(typeof doc.recordingId);
        for (const obj of doc.objects) {
          const item: RawDetection = {
            ...(obj as MongoDetection),
            mongoId: doc._id.toString(),
            recordingId: doc.recordingId as string,
            frameId: doc.frameId as number,
            timestamp: doc.timestamp as Date,
          };
          // console.log(item);
          rawTrackedObjects.push(item);
        }
      });
    await writeFileAsync("raw-tracked-objects.json", rawTrackedObjects);
    console.timeEnd("tracker");
    console.info("End tracker processing");
    console.time("create-index");

    const trackerIndex = Object.fromEntries(
      rawTrackedObjects.map((x) => [trackerHash(x), x]),
    );

    console.timeEnd("create-index");
    console.info("End tracker index creation");
    console.log("Index has", Object.keys(trackerIndex).length, "elements");
    await writeFileAsync("tracker-index.json", trackerIndex);

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
      const rawRecordingHistoryItems = recording.counterHistory.map((item) => {
        return { ...item, recordingId: recording._id };
      });

      // create recording
      const rec = await prisma.recording.create({
        data: {
          recordingStart: recording.dateStart,
          recordingEnd: recording.dateEnd,
          camera: { connect: { id: cameras[0].id } },
          mongoId: recording._id.toString(),
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

      const matches = rawRecordingHistoryItems.filter(
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
        const indexItem =
          trackerIndex[
            `${item.id}|${item.frameId}|${item.recordingId}|${item.name}`
          ];
        const associatedAreas = await prisma.area.findMany({
          where: { mongoId: item.area },
        });
        if (associatedAreas.length === 0) {
          console.error("No area found for counterObject?? huh?");
        } else {
          const _detection = await prisma.detection.create({
            data: {
              mongoId: indexItem.mongoId,
              confidence: indexItem.confidence,
              detectedAt: item.timestamp,
              area: { connect: { id: associatedAreas[0].id } },
              Recording: { connect: { id: rec.id } },
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

    //    _|   _| _` | |   -_)   _|   _|   _ \   _| |   -_) (_-<
    //   |            _)             |             _)
    //  \__| _| \__,_| | \___| \__| \__| \___/ _|  _| \___| ___/
    //              __/
    //#region
    const calcTrajectories = async () => {
      const rawTrackerObjectsGroupedByRecordingId = groupBy(
        rawTrackedObjects,
        "recordingId",
      );
      const recFramesOfTrackedObject: Dictionary<Dictionary<
        RawDetection[]
      >> = {};

      for (const key of Object.keys(rawTrackerObjectsGroupedByRecordingId)) {
        const items = rawTrackerObjectsGroupedByRecordingId[key];
        const sortedByFrameId = groupBy(items, "frameId");
        recFramesOfTrackedObject[key] = sortedByFrameId;
      }

      // create a dictionary with the recording key as id
      // for the dictionaries created from the trajetories
      // throughout the frames
      // we have something like a raw trajetory
      const trajectoriesPerRecording: Dictionary<any> = {};
      for (const recKey in recFramesOfTrackedObject) {
        const recording = recFramesOfTrackedObject[recKey];
        const trajectories: Dictionary<any> = {};
        for (const frameKey in recording) {
          const frame = recording[frameKey];
          for (const item of frame) {
            if (
              Object.prototype.hasOwnProperty.call(trajectories, `${item.id}`)
            ) {
              trajectories[`${item.id}`].push(item);
            } else {
              trajectories[`${item.id}`] = [item];
            }
          }
        }
        trajectoriesPerRecording[recKey] = trajectories;
      }

      for await (const recordingId of Object.keys(trajectoriesPerRecording)) {
        // console.time("raw");
        // const recsRaw = await prisma.$queryRaw(
        //   "SELECT id FROM Recording WHERE  mongoId = $1",
        //   recordingId,
        // );
        // console.timeEnd("raw");
        // console.time("notraw");
        const recs = await prisma.recording.findMany({
          where: { mongoId: recordingId },
        });
        // console.timeEnd("notraw");
        // console.log(recsRaw);
        console.log(recs);
        if (recs.length === 0) {
          continue;
        }

        const trajectories = trajectoriesPerRecording[recordingId];
        for await (const trayKey of Object.keys(trajectories)) {
          const trajectory = await prisma.trajectory.create({
            data: {
              trajectory: "",
              geom: "",
              start: new Date().toISOString(),
              end: new Date().toISOString(),
              camera: { connect: { id: cameras[0].id } },
              Recording: { connect: { id: recs[0].id } },
            },
          });
          for await (const detection of trajectories[trayKey]) {
            const exitingDetection = await prisma.detection.findMany({
              where: { mongoId: detection.mongoId },
            });
            if (exitingDetection.length > 0) {
              await prisma.detection.update({
                where: { id: exitingDetection[0].id },
                data: {
                  trajectory: { connect: { id: trajectory.id } },
                },
              });
            } else {
              await prisma.detection.create({
                data: {
                  mongoId: detection.mongoId,
                  confidence: detection.confidence,
                  detectedAt: detection.timestamp,
                  detectionType: {
                    connectOrCreate: {
                      where: { label: detection.name },
                      create: { label: detection.name },
                    },
                  },
                  Recording: { connect: { id: recs[0].id } },
                  trajectory: { connect: { id: trajectory.id } },
                },
              });
            }
          }
        }
      }
    };
    // await calcTrajectories();
    //#endregion
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
    console.timeEnd("all");
  }
}

main().catch(console.error);
