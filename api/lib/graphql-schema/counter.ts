import { schema } from "nexus";

schema.objectType({
  name: "Counter",
  definition(t) {
    t.model.id();
    // t.model.active();
    t.model.camera();
    t.model.cameraId();
    t.model.street();
    t.model.streetId();
    t.model.x1();
    t.model.y1();
    t.model.x2();
    t.model.y2();
    t.model.line();
    t.model.direction();
    t.model.countDetections({ type: "CountDetection" });
  },
});
