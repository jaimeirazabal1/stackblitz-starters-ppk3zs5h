const express = require('express');
const cors = require('cors');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const path = require('path'); // Asegúrate de importar el módulo 'path'

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'pages')));

// Clase principal para manejar la encriptación adicional
class SuperToken {
  static #key = null;
  static #iv = null;

  static initialize() {
    if (!this.#key) {
      this.#key = crypto.randomBytes(32);
      this.#iv = crypto.randomBytes(16);
      console.log('🔐 Claves de encriptación inicializadas');
    }
  }

  static encrypt(data) {
    this.initialize();
    const cipher = crypto.createCipheriv('aes-256-gcm', this.#key, this.#iv);

    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');

    const authTag = cipher.getAuthTag();

    return {
      encrypted,
      tag: authTag.toString('hex'),
    };
  }

  static decrypt(encryptedData, authTag) {
    this.initialize();
    const decipher = crypto.createDecipheriv(
      'aes-256-gcm',
      this.#key,
      this.#iv
    );
    decipher.setAuthTag(Buffer.from(authTag, 'hex'));

    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    return JSON.parse(decrypted);
  }

  static rotate() {
    this.#key = crypto.randomBytes(32);
    this.#iv = crypto.randomBytes(16);
    console.log('🔄 Claves rotadas:', new Date().toISOString());
  }
}

// Gestor de tokens
class TokenManager {
  static #JWT_SECRET = 'tu-super-secreto-aqui'; // En producción usar env vars

  static createToken(payload) {
    const { encrypted, tag } = SuperToken.encrypt(payload);

    return jwt.sign(
      {
        data: encrypted,
        tag: tag,
      },
      this.#JWT_SECRET,
      {
        expiresIn: '15m',
      }
    );
  }

  static verifyToken(token) {
    try {
      const decoded = jwt.verify(token, this.#JWT_SECRET);
      return SuperToken.decrypt(decoded.data, decoded.tag);
    } catch (error) {
      throw new Error('Token inválido o expirado');
    }
  }
}

// Middleware de autenticación
const requireAuth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const userData = TokenManager.verifyToken(token);
    req.user = userData;
    next();
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'pages', 'index.html'));
});
// Rutas de ejemplo
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  // Aquí irían tus validaciones reales
  if (username === 'demo' && password === 'demo123') {
    const token = TokenManager.createToken({
      userId: 1,
      username,
      role: 'user',
      sessionId: crypto.randomBytes(16).toString('hex'),
    });

    res.json({ token });
  } else {
    res.status(401).json({ error: 'Credenciales inválidas' });
  }
});

app.get('/api/profile', requireAuth, (req, res) => {
  res.json({
    message: 'Datos protegidos',
    user: req.user,
  });
});

// Iniciar rotación de claves
setInterval(() => {
  SuperToken.rotate();
}, 3600000); // Cada hora

// Iniciar servidor
const PORT = process.env.PORT || 3010;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
  SuperToken.initialize();
});
