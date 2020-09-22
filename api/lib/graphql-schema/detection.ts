import { schema } from "nexus";

schema.objectType({
  name: "CountDetection",
  definition(t) {
    t.model.id();
    t.model.detectedAt();
    t.model.counter();
    t.model.counterId();
    t.model.detectionType();
    t.model.detectionTypeId();
    t.model.confidence();
    // t.model.x();
    // t.model.y();
  },
});
