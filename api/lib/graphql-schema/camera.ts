import { schema } from "nexus";

schema.objectType({
  name: "Camera",
  definition(t) {
    t.model.id();
    t.model.active();
    t.model.name();
    t.model.location();
    t.model.transformationMatrix();
    t.model.owner();
    t.model.timezone();
    t.model.software();
    t.model.softwareHistory();
    t.model.hardware();
    t.model.angle();
    t.model.geom();
    t.model.recordings({ type: "Recording" });
    t.model.trajectories({ type: "Trajectory" });
    t.model.weathers({ type: "Weather" });
    t.model.lightningConditions({ type: "LightningCondition" });
  },
});
