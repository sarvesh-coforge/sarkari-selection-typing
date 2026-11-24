import mongoose, { Schema, Document, Model } from "mongoose";

export interface IImportantDate {
  label: string;
  value: string;
}

export interface IApplicationFee {
  category: string;
  fee: string;
}

export interface IVacancyDetail {
  postName: string;
  totalPost: string;
  eligibility: string;
}

export interface IImportantLink {
  title: string;
  url: string;
  actionText?: string;
  isOfficial?: boolean;
}

export interface IPostDetail extends Document {
  slug: string;
  sourceUrl: string;
  boardName: string;
  postTitle: string;
  shortDetails: string;
  importantDates: IImportantDate[];
  applicationFee: IApplicationFee[];
  feePaymentNote?: string;
  ageLimit: {
    minAge?: string;
    maxAge?: string;
    asOfDate?: string;
    relaxationRules?: string;
  };
  totalPostsSummary?: string;
  vacancyDetails: IVacancyDetail[];
  howToFill: string[];
  importantLinks: IImportantLink[];
  fetchedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ImportantDateSchema = new Schema<IImportantDate>(
  {
    label: { type: String, required: true },
    value: { type: String, required: true },
  },
  { _id: false }
);

const ApplicationFeeSchema = new Schema<IApplicationFee>(
  {
    category: { type: String, required: true },
    fee: { type: String, required: true },
  },
  { _id: false }
);

const VacancyDetailSchema = new Schema<IVacancyDetail>(
  {
    postName: { type: String, required: true },
    totalPost: { type: String, default: "" },
    eligibility: { type: String, default: "" },
  },
  { _id: false }
);

const ImportantLinkSchema = new Schema<IImportantLink>(
  {
    title: { type: String, required: true },
    url: { type: String, required: true },
    actionText: { type: String, default: "Click Here" },
    isOfficial: { type: Boolean, default: true },
  },
  { _id: false }
);

const PostDetailSchema = new Schema<IPostDetail>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    sourceUrl: { type: String, default: "" },
    boardName: { type: String, required: true },
    postTitle: { type: String, required: true },
    shortDetails: { type: String, default: "" },
    importantDates: { type: [ImportantDateSchema], default: [] },
    applicationFee: { type: [ApplicationFeeSchema], default: [] },
    feePaymentNote: { type: String, default: "" },
    ageLimit: {
      minAge: { type: String, default: "" },
      maxAge: { type: String, default: "" },
      asOfDate: { type: String, default: "" },
      relaxationRules: { type: String, default: "" },
    },
    totalPostsSummary: { type: String, default: "" },
    vacancyDetails: { type: [VacancyDetailSchema], default: [] },
    howToFill: { type: [String], default: [] },
    importantLinks: { type: [ImportantLinkSchema], default: [] },
    fetchedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

const PostDetail: Model<IPostDetail> =
  mongoose.models.PostDetail || mongoose.model<IPostDetail>("PostDetail", PostDetailSchema);

export default PostDetail;
