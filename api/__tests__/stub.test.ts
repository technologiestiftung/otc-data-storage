/* eslint-disable jest/no-hooks */
/* eslint-disable jest/no-test-callback */
/* eslint-disable jest/prefer-todo */
/* eslint-disable jest/expect-expect */
/* eslint-disable jest/consistent-test-it */
// tests/foo.spec.ts
// this test runs without a db
import { createTestContext } from "../test/__helpers";

const ctx = createTestContext();
describe("stub group without a DB", () => {
  test("stub tests", async (done) => {
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
    const createdCamera = await ctx.client.send(`{ allCameras { id } }`);
    expect(createdCamera).toMatchInlineSnapshot();
    done();
  });
});
