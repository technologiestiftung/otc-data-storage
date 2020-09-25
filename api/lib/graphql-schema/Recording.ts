import { schema } from "nexus";

schema.objectType({
  name: "Recording",
  definition(t) {
    t.model.id();
    // t.model.active();
    t.model.camera();
    t.model.cameraId();
    t.model.recordingStart();
    t.model.recordingEnd();
    t.model.counters({ type: "Counter" });
  },
});
