import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { calculateTargets } from '../utils/nutrition.js';

function signAccessToken(userId) {
  return jwt.sign({ sub: userId }, process.env.JWT_SECRET, { expiresIn: '1h' });
}

function signRefreshToken(userId) {
  return jwt.sign({ sub: userId, type: 'refresh' }, process.env.JWT_REFRESH_SECRET, { expiresIn: '30d' });
}

export async function register(req, res, next) {
  try {
    const { email, password, ...profile } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ message: 'User already exists' });
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const targets = calculateTargets(profile);
    const user = await User.create({ email, passwordHash, targets, ...profile });

    return res.status(201).json({
      user,
      accessToken: signAccessToken(user.id),
      refreshToken: signRefreshToken(user.id),
    });
  } catch (error) {
    return next(error);
  }
}

export async function login(req, res, next) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email?.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const passwordMatches = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatches) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    return res.json({
      user,
      accessToken: signAccessToken(user.id),
      refreshToken: signRefreshToken(user.id),
    });
  } catch (error) {
    return next(error);
  }
}

export async function refreshToken(req, res) {
  const { refreshToken: providedToken } = req.body;
  if (!providedToken) {
    return res.status(400).json({ message: 'Refresh token is required' });
  }

  try {
    const decoded = jwt.verify(providedToken, process.env.JWT_REFRESH_SECRET);
    if (decoded.type !== 'refresh') {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    return res.json({ accessToken: signAccessToken(decoded.sub) });
  } catch {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }
}
