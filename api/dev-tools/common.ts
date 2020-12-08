export interface XBounds {
  xMin: number;
  xMax: number;
}
export interface Resolution {
  w: number;
  h: number;
}
export interface Location {
  point1: Point;
  point2: Point;
  refResolution: Resolution;
}
export interface Point {
  x: number;
  y: number;
}
export interface RawArea {
  color: string;
  type: string;
  location: Location;
  computed: {
    a: number;
    b: number;
    xBounds: XBounds;
    lineBearings: number[];
  };
  name: string;
  mongoId: string;
}
export type MongoArea = Omit<RawArea, "mongoId">;

export interface RawDetection {
  id: number;
  x: number;
  y: number;
  w: number;
  h: number;
  bearing: number | typeof NaN;
  confidence: number;
  name: "car" | "person" | "bicycle" | "truck" | "bus" | "motorbike";
  mongoId: string;
  recordingId: string;
  frameId: number;
  timestamp: Date;
}

/**
 *
 * Nice one. Thanks lodash
 */
export interface Dictionary<T> {
  [index: string]: T;
}
export type MongoDetection = Omit<
  RawDetection,
  "mongoId" | "recordingId" | "frameId" | "timestamp"
>;

export interface MongoHistoryDetecion
  extends Omit<
    RawDetection,
    "x" | "y" | "w" | "h" | "confidence" | "recordingId"
  > {
  countingDirection: "leftright_topbottom" | "rightleft_bottomtop";
  area: "string";
}
export interface MongoRecording {
  _id: string;
  dateStart: Date;
  dateEnd: Date;
  areas: {
    [key: string]: MongoArea;
  };
  videoResolution: Resolution;
  filename: string;
  counterSummary: { [key: string]: { _total: number; car?: number } };
  trackerSummary: { totalItemsTracked: number };
  counterHistory?: MongoHistoryDetecion[];
}

export type RawRecording = MongoRecording;
