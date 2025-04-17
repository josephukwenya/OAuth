import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  providerId: string;
  email?: string;
  name: string;
  avatar?: string;
  provider: 'google' | 'facebook' | 'github';
  googleId: string;
  githubId: string;
  facebookId: string;
  profileUrl: string;
}

const UserSchema = new Schema<IUser>({
  providerId: { type: String, required: true },
  email: { type: String },
  name: { type: String, required: true },
  avatar: { type: String },
  provider: { type: String, required: true },
  googleId: { type: String, unique: true, sparse: true },
  githubId: { type: String, unique: true, sparse: true },
  facebookId: { type: String, unique: true, sparse: true },
  profileUrl: { type: String },
});

export const User = mongoose.model<IUser>('User', UserSchema);
