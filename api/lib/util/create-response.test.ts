import { createResponse } from "./create-response";
describe("create responses (generic function)", () => {
  test("shoud have an object called data and message", () => {
    const key = "something";
    const res = createResponse<number[]>("hello world", [], key);
    expect(res).toMatchObject({
      message: expect.any(String),
      data: { something: [] },
    });
    expect(res.data?.something).toBeDefined();
  });
  test("should not have data", () => {
    const message = "hello world";
    const res = createResponse<number[]>(message);
    expect(res).toMatchObject({
      message: expect.any(String),
    });
    expect(res.data).not.toBeDefined();
    expect(res.message).toBe(message);
  });
});
