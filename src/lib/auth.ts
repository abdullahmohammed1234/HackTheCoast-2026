import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import User, { IUser } from '@/models/User';
import connectDB from '@/lib/mongodb';
import { Document, Types } from 'mongoose';

// Session timeout in milliseconds (15 minutes)
const SESSION_TIMEOUT = 15 * 60 * 1000;

interface UserWithPassword extends Omit<IUser, '_id'> {
  _id: Types.ObjectId;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Please enter email and password');
        }

        await connectDB();

        const user = await User.findOne({ email: credentials.email }).select('+password') as UserWithPassword | null;

        if (!user || !user.password) {
          throw new Error('Invalid email or password');
        }

        const isPasswordValid = await user.comparePassword(credentials.password);

        if (!isPasswordValid) {
          throw new Error('Invalid email or password');
        }

        return {
          id: user._id.toString(),
          email: user.email,
          name: user.name,
        };
      },
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 15 * 60, // 15 minutes in seconds
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/login',
    error: '/login',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.lastActivity = Date.now();
      } else if (token.id) {
        // Check session timeout
        const lastActivity = (token.lastActivity as number) || 0;
        if (Date.now() - lastActivity > SESSION_TIMEOUT) {
          // Return a token without id to force logout
          return { ...token, id: '' };
        }
        token.lastActivity = Date.now();
      }
      return token;
    },
    async session({ session, token }) {
      if (!token.id) {
        // Session expired or invalid
        return session;
      }
      if (session.user) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
};
