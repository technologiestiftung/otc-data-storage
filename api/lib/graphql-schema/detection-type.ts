import { schema } from "nexus";

schema.objectType({
  name: "DetectionType",
  definition(t) {
    t.model.id();
    t.model.label();
    t.model.description();
    t.model.countDetections({ type: "CountDetection" });
    t.model.trajectories({ type: "Trajectory" });
  },
});
