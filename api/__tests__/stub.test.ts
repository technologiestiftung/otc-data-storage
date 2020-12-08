/* eslint-disable jest/prefer-inline-snapshots */
/* eslint-disable jest/no-hooks */
/* eslint-disable jest/prefer-todo */
/* eslint-disable jest/expect-expect */
/* eslint-disable jest/consistent-test-it */
// tests/foo.spec.ts
// this test runs without a db
// import { createTestContext } from "../tests/helpers";

// const ctx = createTestContext();
describe("stub group without a DB", () => {
  test("stub tests", async () => {
    expect(2 + 2).toBe(4);
    // use `ctx` in here
    //   await ctx.client.send(`
    //   mutation {
    //     insertCamera(data: {name: "foo", active: true, location:"street", timezone:0}) {
    //       id
    //       active
    //       name
    //       location
    //       timezone
    //     }
    //   }
    // `);
    // const allCamera = await ctx.client.send(`{ allCameras { id } }`);
    // expect(allCamera).toMatchInlineSnapshot();
    // const persistedData = await ctx.app.db.client.camera.findMany();
    // expect(persistedData).toMatchSnapshot();
    // done();
  });
});
