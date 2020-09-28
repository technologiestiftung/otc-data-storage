/* eslint-disable prefer-const */
/* eslint-disable jest/no-hooks */
/* eslint-disable jest/require-top-level-describe */

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
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await ctx.app.db.client.$disconnect();
    await ctx.app.stop();
  });

  return ctx;
}
