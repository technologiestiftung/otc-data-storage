import { schema } from "nexus";

schema.objectType({
  name: "DetectionType",
  definition(t) {
    t.model.id();
    t.model.label();
    t.model.description();
    t.model.detections({ type: "Detection" });
    t.model.trajectories({ type: "Trajectory" });
  },
});
