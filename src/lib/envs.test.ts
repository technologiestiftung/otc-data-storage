/* eslint-disable jest/no-hooks */
describe("envs test", () => {
  afterEach(() => {
    jest.resetModules();
  });
  test("should have APP_SECRET defined in env", async () => {
    const module = await import("./envs");
    expect(module.APP_SECRET).toBeDefined();
    expect(module.APP_SECRET).toBe("superdupersecret");
  });

  test("should have APP_SECRET defined from process.env", async () => {
    process.env["APP_SECRET"] = "secret";
    const module = await import("./envs");
    expect(module.APP_SECRET).toBeDefined();
    expect(module.APP_SECRET).not.toBe("superdupersecret");
    expect(module.APP_SECRET).toBe("secret");
    delete process.env.APP_SECRET;
  });
});
