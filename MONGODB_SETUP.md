# MongoDB Connection Setup Guide

This guide will help you connect your love story website to MongoDB for production use.

## Prerequisites

1. MongoDB Atlas account (free tier available)
2. Vercel account for deployment

## Step 1: Create MongoDB Atlas Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with username and password
4. Whitelist your IP address (or use 0.0.0.0/0 for all IPs)
5. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

## Step 2: Add Environment Variable

Add this to your Vercel project environment variables:

\`\`\`
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/love-story?retryWrites=true&w=majority
\`\`\`

## Step 3: Install MongoDB Driver

The project is ready for MongoDB. When you're ready to switch from localStorage to MongoDB:

\`\`\`bash
npm install mongodb
\`\`\`

## Step 4: Replace Storage Implementation

Update `lib/db/storage.ts` to use MongoDB instead of localStorage:

\`\`\`typescript
import { MongoClient } from 'mongodb'

const client = new MongoClient(process.env.MONGODB_URI!)
const db = client.db('love-story')

export const storage = {
  users: db.collection('users'),
  posts: db.collection('posts'),
  replies: db.collection('replies'),
  sessions: db.collection('sessions'),
  messages: db.collection('messages'),
  albums: db.collection('albums'),
}
\`\`\`

## Current Setup

The website currently uses localStorage for development. All data structures are MongoDB-ready:

- Users collection with authentication
- Forum posts with categories, tags, moods
- Reactions and social sharing
- Private messaging
- Gallery albums
- Online status tracking

## Features Ready for MongoDB

All features are designed to work seamlessly with MongoDB:
- User authentication with email verification
- Forum discussions with categories
- Private messaging between Nazzel and Avionna
- Photo gallery with albums
- Admin panel with analytics
- Notification system

## Admin Credentials

Username: `admin`
Password: `Nazzelandavionna62529`

## Support

For MongoDB connection issues, check:
1. Connection string is correct
2. Database user has proper permissions
3. IP whitelist includes your deployment IP
4. Environment variable is set in Vercel
