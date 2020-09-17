/* eslint-disable prefer-const */
/* eslint-disable jest/no-hooks */
/* eslint-disable jest/require-top-level-describe */
// tests/__helpers.ts
import {
  createTestContext as originalCreateTestContext,
  TestContext,
} from "nexus/testing";

export function createTestContext(): TestContext {
  let ctx = {} as TestContext;

  beforeAll(async () => {
    Object.assign(ctx, await originalCreateTestContext());
    await ctx.app.start();
  });

  afterAll(async () => {
    await ctx.app.stop();
    await ctx.app.db.client.$disconnect();
  });

  return ctx;
}
