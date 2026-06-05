const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { randomUUID } = require('node:crypto');

const secret = process.env.JWT_SECRET;
if (!secret || Buffer.byteLength(secret) < 32) {
    throw new Error('JWT_SECRET must contain at least 32 bytes');
}

// ponytail: single-process demo; use a DB unique constraint before multi-worker deployment.
const users = [];

exports.register = async (username, password) => {
    const existing = users.find(u => u.username === username);
    if (existing) throw Object.assign(new Error('Username already taken'), { status: 409 });

    const hashedPassword = await bcrypt.hash(password, 10);
    // Hashing yields; recheck uniqueness before committing to the in-memory store.
    if (users.some(u => u.username === username)) throw Object.assign(new Error('Username already taken'), { status: 409 });
    const user = { id: randomUUID(), username, password: hashedPassword };
    users.push(user);
    return user;
};

exports.login = async (username, password) => {
    const user = users.find(u => u.username === username);
    if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

    return jwt.sign({ id: user.id }, secret, { algorithm: 'HS256', expiresIn: '1h' });
};
