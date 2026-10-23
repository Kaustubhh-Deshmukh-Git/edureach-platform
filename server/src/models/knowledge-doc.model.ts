import type { Document } from "mongoose";
import { model, Schema } from "mongoose";

export interface IKnowledgeDoc extends Document {
  text: string;
  embedding: number[];
  metadata: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

const knowledgeDocSchema = new Schema<IKnowledgeDoc>(
  {
    text: {
      type: String,
      required: true,
    },
    embedding: {
      type: [Number],
      required: true,
      validate: {
        validator: (v: number[]) => Array.isArray(v) && v.length > 0,
        message: "Embedding must be a non-empty array of numbers",
      },
    },
    metadata: {
      type: Schema.Types.Mixed,
      default: {},
    },
  },
  {
    collection: "knowledge_docs",
    timestamps: true,
  },
);

export const KnowledgeDoc = model<IKnowledgeDoc>("KnowledgeDoc", knowledgeDocSchema);
