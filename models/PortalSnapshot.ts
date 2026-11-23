import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPortalItem {
  title: string;
  url: string;
  category: "result" | "admit_card" | "latest_job" | "answer_key" | "syllabus" | "admission" | "hot_update" | string;
  badge?: string;
}

export interface IPortalSnapshot extends Document {
  versionNumber: number;
  sourceUrl: string;
  status: "published" | "archived";
  items: IPortalItem[];
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PortalItemSchema = new Schema<IPortalItem>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    category: { type: String, required: true, index: true },
    badge: { type: String, default: "" },
  },
  { _id: false }
);

const PortalSnapshotSchema = new Schema<IPortalSnapshot>(
  {
    versionNumber: { type: Number, required: true, unique: true, index: true },
    sourceUrl: { type: String, default: "https://www.sarkariresult.com/" },
    status: {
      type: String,
      enum: ["published", "archived"],
      default: "published",
      index: true,
    },
    items: { type: [PortalItemSchema], default: [] },
    fetchedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const PortalSnapshot: Model<IPortalSnapshot> =
  mongoose.models.PortalSnapshot ||
  mongoose.model<IPortalSnapshot>("PortalSnapshot", PortalSnapshotSchema);

export default PortalSnapshot;
