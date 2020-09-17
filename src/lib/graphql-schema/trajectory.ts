import { schema } from "nexus";

schema.objectType({
  name: "Trajectory",
  definition(t) {
    t.model.id();
    t.model.camera();
    t.model.cameraId();
    t.model.trajectory();
    t.model.geom();
    t.model.detectionType();
    t.model.detectionTypeId();
    t.model.start();
    t.model.end();
  },
});
