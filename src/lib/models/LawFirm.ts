// src/lib/models/LawFirm.ts

import mongoose from 'mongoose';

export interface ILawFirm {
  name: string;
  code: string;
  managerCode: string;
  members: string[];
}

const LawFirmSchema = new mongoose.Schema<ILawFirm>(
  {
    name: { type: String, required: true },
    code: { type: String, required: true, unique: true },
    managerCode: { type: String, required: true },
    members: { type: [String], default: [] },
  },
  { collection: 'lawfirms' }
);

export const LawFirm =
  mongoose.models.LawFirm ||
  mongoose.model<ILawFirm>('LawFirm', LawFirmSchema);
