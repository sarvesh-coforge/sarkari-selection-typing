import mongoose, { Schema, Document, Model } from "mongoose";

export interface ISarkariPostItem {
  title: string;
  slug: string;
  url: string;
  officialUrl: string;
  badge?: string;
  bgColor?: string;
}

export interface ISarkariCategories {
  result: ISarkariPostItem[];
  admitCard: ISarkariPostItem[];
  latestJob: ISarkariPostItem[];
  answerKey: ISarkariPostItem[];
  syllabus: ISarkariPostItem[];
  admission: ISarkariPostItem[];
  certificate: ISarkariPostItem[];
  important: ISarkariPostItem[];
  outsourcing: ISarkariPostItem[];
}

export interface ISarkariSnapshot extends Document {
  version: number;
  syncedAt: Date;
  isActive: boolean;
  hotUpdates: ISarkariPostItem[];
  categories: ISarkariCategories;
  createdAt: Date;
  updatedAt: Date;
}

const SarkariPostItemSchema = new Schema<ISarkariPostItem>(
  {
    title: { type: String, required: true, trim: true },
    slug: { type: String, required: true, trim: true },
    url: { type: String, required: true, trim: true },
    officialUrl: { type: String, required: true, trim: true },
    badge: { type: String, default: "" },
    bgColor: { type: String, default: "" },
  },
  { _id: false }
);

const SarkariSnapshotSchema = new Schema<ISarkariSnapshot>(
  {
    version: { type: Number, required: true, unique: true, index: true },
    syncedAt: { type: Date, default: Date.now },
    isActive: { type: Boolean, default: true, index: true },
    hotUpdates: { type: [SarkariPostItemSchema], default: [] },
    categories: {
      result: { type: [SarkariPostItemSchema], default: [] },
      admitCard: { type: [SarkariPostItemSchema], default: [] },
      latestJob: { type: [SarkariPostItemSchema], default: [] },
      answerKey: { type: [SarkariPostItemSchema], default: [] },
      syllabus: { type: [SarkariPostItemSchema], default: [] },
      admission: { type: [SarkariPostItemSchema], default: [] },
      certificate: { type: [SarkariPostItemSchema], default: [] },
      important: { type: [SarkariPostItemSchema], default: [] },
      outsourcing: { type: [SarkariPostItemSchema], default: [] },
    },
  },
  {
    timestamps: true,
    collection: "sarkari_snapshots",
  }
);

const SarkariSnapshot: Model<ISarkariSnapshot> =
  mongoose.models.SarkariSnapshot ||
  mongoose.model<ISarkariSnapshot>("SarkariSnapshot", SarkariSnapshotSchema);

export default SarkariSnapshot;
