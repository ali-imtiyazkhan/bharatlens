import { Router } from 'express';
import { PrismaClient } from '@bharatlens/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const router: Router = Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';

// LOGIN ROUTE 

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        username: user.username,
        avatarUrl: user.avatarUrl,
        language: user.language,
      }
    });
  } catch (error) {
    console.error('Error during login:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

//  SIGNUP ROUTE 

router.post('/signup', async (req, res) => {
  try {
    const { name, email, password, language } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ error: 'Email is already in use' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate a unique-ish username from name (sanitize to alphanumeric)
    const baseUsername = name.toLowerCase().replace(/[^a-z0-9\s]/g, '').replace(/\s+/g, '_');
    const randomSuffix = Math.floor(Math.random() * 1000);
    const username = `${baseUsername}_${randomSuffix}`;

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        username,
        language: language || 'en',
      }
    });

    const token = jwt.sign({ userId: newUser.id }, JWT_SECRET, { expiresIn: '7d' });

    return res.status(201).json({
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        username: newUser.username,
        avatarUrl: newUser.avatarUrl,
        language: newUser.language,
      }
    });
  } catch (error: any) {
    console.error('Error during signup:', error);
    return res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message,
      message: 'Signup failed. This might be due to a duplicate email or invalid data.'
    });
  }
});

export default router;
