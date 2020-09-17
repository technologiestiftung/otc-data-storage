import { schema } from "nexus";

schema.objectType({
  name: "LightningCondition",
  definition(t) {
    t.model.id();
    t.model.camera();
    t.model.cameraId();
    t.model.recordedAt();
    t.model.value();
  },
});
