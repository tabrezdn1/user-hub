












import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { authConfig } from './auth.config';
import { sql } from '@vercel/postgres';
import { z } from 'zod';
import type { User } from '@/app/lib/definitions';
import bcrypt from 'bcrypt';
 
async function getUser(email: string): Promise<User | undefined> {
  try {
    const user = await sql<User>`SELECT * from USERS where email=${email}`;
    return user.rows[0];
  } catch (error) {
    console.error('Failed to fetch user:', error);
    throw new Error('Failed to fetch user.');
  }
}
 
export const { auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: {
    strategy: 'jwt',
  },
  providers: [
    CredentialsProvider({
        credentials: {
            email: {},
            password: {},
        },
        authorize: async (credentials, req) => {
            const url = 'http://localhost:8000/login/';//this should be env variable. should match port backend service is running on
    
            try {
              const response = await fetch(url, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                  username: credentials?.email || '',
                  password: credentials?.password || '',
                }),
              });
    
              if (!response.ok) {
                throw new Error('Invalid credentials');
              }
    
              const data = await response.json();
    
              if (data.access_token) {
                // Return user object
                return {
                  id: data.user_id,
                  email: credentials.email,
                  accessToken: data.access_token,
                };
              } else {
                // Return null if user data could not be retrieved
                return null;
              }
            } catch (error) {
              console.error('Authorization error:', error);
              return null;
            }
          },
        }),
  ]
});