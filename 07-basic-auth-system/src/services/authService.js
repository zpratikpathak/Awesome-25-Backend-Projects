const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock DB
const users = [];

exports.register = async (username, password) => {
    const existing = users.find(u => u.username === username);
    if (existing) throw new Error('Username already taken');

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = { id: Date.now().toString(), username, password: hashedPassword };
    users.push(user);
    return user;
};

exports.login = async (username, password) => {
    const user = users.find(u => u.username === username);
    if (!user) throw new Error('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');

    return jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret', { expiresIn: '1h' });
};
