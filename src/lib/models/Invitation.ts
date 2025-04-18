// src/lib/models/Invitation.ts

import mongoose from 'mongoose';

export interface IInvitation {
  lawFirmCode: string;
  invitedUserCode: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
}

const InvitationSchema = new mongoose.Schema<IInvitation>(
  {
    lawFirmCode: { type: String, required: true },
    invitedUserCode: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending',
    },
    createdAt: { type: Date, default: Date.now },
  },
  { collection: 'invitations' }
);

export const Invitation =
  mongoose.models.Invitation ||
  mongoose.model<IInvitation>('Invitation', InvitationSchema);
