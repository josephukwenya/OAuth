import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  providerId: string;
  email?: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'facebook';
  googleId: string;
}

const UserSchema = new Schema<IUser>({
  providerId: { type: String, required: true },
  email: { type: String },
  name: { type: String, required: true },
  avatar: { type: String },
  provider: { type: String, required: true },
  googleId: { type: String },
});

export const User = mongoose.model<IUser>('User', UserSchema);
