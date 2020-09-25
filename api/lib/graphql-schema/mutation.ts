import { hash, compare } from "bcrypt";
import { sign } from "jsonwebtoken";
import { schema } from "nexus";
import { APP_SECRET } from "../envs";

schema.mutationType({
  definition(t) {
    t.crud.createOneCamera({ alias: "insertCamera" });
    t.crud.createOneCounter({ alias: "insertCounter" });
    t.crud.createOneDetection({ alias: "insertDetection" });
    t.crud.createOneDetectionType({ alias: "insertDetectionType" });
    t.crud.createOneTrajectory({ alias: "insertTrajectory" });
    t.crud.createOneWeather({ alias: "insertWeather" });
    // t.field("signup", {
    //   resolve: async () => {
    //     return { message: "no signup allowed" };
    //   },
    // });
    t.field("signup", {
      type: "AuthPayload",
      args: {
        name: schema.stringArg(),
        email: schema.stringArg({ nullable: false }),
        password: schema.stringArg({ nullable: false }),
      },
      resolve: async (_parent, { name, email, password }, ctx) => {
        const hashedPassword = await hash(password, 10);
        const user = await ctx.db.user.create({
          data: {
            name,
            email,
            password: hashedPassword,
          },
        });
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        };
      },
    });

    t.field("login", {
      type: "AuthPayload",
      args: {
        email: schema.stringArg({ nullable: false }),
        password: schema.stringArg({ nullable: false }),
      },
      resolve: async (_parent, { email, password }, context) => {
        const user = await context.db.user.findOne({
          where: {
            email,
          },
        });
        if (!user) {
          throw new Error(`No user found for email: ${email}`);
        }
        const passwordValid = await compare(password, user.password);
        if (!passwordValid) {
          throw new Error("Invalid password");
        }
        return {
          token: sign({ userId: user.id }, APP_SECRET),
          user,
        };
      },
    });
  },
});
