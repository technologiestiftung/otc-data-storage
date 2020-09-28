/* eslint-disable prefer-const */
import { PrismaClient } from "@prisma/client";
import process from "process";
const db = new PrismaClient();

export async function seed(): Promise<void> {
  try {
    if (process.env.SEED_DATA) {
      console.log("Seeding data");
      let res: any;
      // eslint-disable-next-line prefer-const
      // res = await db.camera.create({
      //   data: {
      //     name: "Test cam",
      //     active: true,
      //     location: "123 Fakestreet",
      //     timezone: 1,
      //   },
      // });
      // res = await db.recording.create({
      //   data: {
      //     recordingStart: new Date("2020-01-01T01:00:00.000Z"),
      //     recordingEnd: new Date("2020-01-01T02:00:00.000Z"),
      //     camera: {
      //       connect: { id: 1 },
      //     },
      //   },
      // });
      // const dtypePerson = await db.detectionType.create({
      //   data: {
      //     label: "Person",
      //   },
      // });
      await db.detectionType.create({
        data: {
          label: "Car",
        },
      });
      await db.detectionType.create({
        data: {
          label: "Truck",
        },
      });
      await db.detectionType.create({
        data: {
          label: "Bike",
        },
      });
      await db.detectionType.create({
        data: {
          label: "Bus",
        },
      });
      await db.detectionType.create({
        data: {
          label: "Motorbike",
        },
      });
      // res = await db.counter.create({
      //   data: {
      //     street: "123 Fakestreet",
      //     streetId: "_abc",
      //     x1: 0,
      //     y1: 0,
      //     x2: 1,
      //     y2: 1,
      //     line: "linestring",
      //     direction: "left top",
      //     detectionType: { connect: { id: 1 } },
      //     recording: { connect: { id: 1 } },
      //   },
      // });
      console.log(res);

      db.$disconnect();
    }
  } catch (error) {
    console.error(error);
    throw error;
  }
}

if (require.main === module) {
  console.log("This is a CLI tool!");
  seed().catch(console.error);
}
