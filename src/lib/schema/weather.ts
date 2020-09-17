import { schema } from "nexus";

schema.objectType({
  name: "Weather",
  definition(t) {
    t.model.id();
    t.model.camera();
    t.model.cameraId();
    t.model.recordedAt();
    t.model.humidity();
    t.model.pressure();
    t.model.cloudCoverage();
    t.model.rain();
    t.model.temperature();
    t.model.wind();
    t.model.windDirection();
  },
});
