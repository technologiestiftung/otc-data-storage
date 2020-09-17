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
    await ctx.client.send(`
    mutation {
      insertCamera(data: {name: "foo", active: true, location:"street", timezone:0}) {
        id
        active
        name
        location
        timezone
      }
    }
  `);
    const createdCamera = await ctx.client.send(`{ allCameras { id } }`);
    expect(createdCamera).toMatchInlineSnapshot(`
      Object {
        "allCameras": Array [
          Object {
            "id": 1,
          },
          Object {
            "id": 2,
          },
          Object {
            "id": 3,
          },
          Object {
            "id": 4,
          },
          Object {
            "id": 5,
          },
          Object {
            "id": 6,
          },
          Object {
            "id": 7,
          },
          Object {
            "id": 8,
          },
          Object {
            "id": 9,
          },
          Object {
            "id": 10,
          },
          Object {
            "id": 11,
          },
          Object {
            "id": 12,
          },
          Object {
            "id": 13,
          },
          Object {
            "id": 14,
          },
          Object {
            "id": 15,
          },
          Object {
            "id": 16,
          },
          Object {
            "id": 17,
          },
          Object {
            "id": 18,
          },
        ],
      }
    `);
    done();
  });
});
