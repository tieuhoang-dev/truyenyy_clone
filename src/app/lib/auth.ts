// lib/auth.ts
import jwt from 'jsonwebtoken'

const SECRET = process.env.JWT_SECRET || 'your_secret'

export function verifyToken(token: string) {
  return jwt.verify(token, SECRET) as {
    id: string
    username: string
    role: string
  }
}
