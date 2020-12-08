import path from "path";
import fs from "fs";
import util from "util";
// import { nanoid } from "nanoid";
import { exec } from "child_process";
const execAsync = util.promisify(exec);

// const dbName = `test_${nanoid()}.db`;
// process.env.DATABASE_URL = `file:${dbName}`;
// global.process.env.DATABASE_URL = `file:${dbName}`;
// const dbPath = path.join(__dirname, dbName);
// const prismaBinary = path.join(
//   __dirname,
//   "../..",
//   "node_modules",
//   ".bin",
//   "prisma",
// );
/**
 * Deduplicate an array of Genrics by a specific id
 *
 */
export function dedupeByProp<T, U extends keyof T>(source: T[], prop: U): T[] {
  return source.filter((obj, pos, arr) => {
    return arr.map((mapObj) => mapObj[prop]).indexOf(obj[prop]) === pos;
  });
}

// export async function setup(): Promise<void> {
//   await execAsync(`${prismaBinary} migrate up --create-db --experimental`);
//   console.log("setup");
// }

// export async function teardown(): Promise<void> {
//   await fs.promises.unlink(dbPath);
// }

export async function writeFileAsync(fn: string, data: any): Promise<void> {
  await fs.promises.writeFile(
    path.resolve(__dirname, `./data/${fn}`),
    JSON.stringify(data),
    "utf8",
  );
}
