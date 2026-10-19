<<<<<<< HEAD

const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 10000;
const ROOT = __dirname;

app.disable('x-powered-by');
app.use(express.json({ limit: '50mb' }));

if (!process.env.DATABASE_URL) {
  console.error('Thieu bien moi truong DATABASE_URL');
  process.exit(1);
}

if (!process.env.ADMIN_PASSWORD) {
  console.error('Thieu bien moi truong ADMIN_PASSWORD');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : undefined
});

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      content JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function requireAdmin(req, res, next) {
  const password = req.get('x-admin-password');

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      ok: false,
      error: 'Mat khau quan tri khong dung'
    });
  }

  next();
}

app.get('/healthz', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, database: 'connected' });
  } catch (err) {
    res.status(503).json({ ok: false, error: 'Database unavailable' });
  }
});

app.get('/api/content', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT content, updated_at FROM site_content WHERE id = 1'
    );

    if (!result.rowCount) {
      return res.json({ content: null });
    }

    res.set('Cache-Control', 'no-store');
    res.json({
      content: result.rows[0].content,
      updatedAt: result.rows[0].updated_at
    });
  } catch (err) {
    next(err);
  }
});

// Tuong thich voi the script src="content.js" hien tai.
app.get('/content.js', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT content FROM site_content WHERE id = 1'
    );

    res.type('application/javascript');
    res.set('Cache-Control', 'no-store');

    if (!result.rowCount) {
      return res.send('');
    }

    const json = JSON.stringify(result.rows[0].content)
      .replace(/</g, '\\u003c')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');

    res.send(`window.CONTENT = ${json};`);
  } catch (err) {
    next(err);
  }
});

// Luu noi dung da xuat ban. Admin phai gui JSON:
// { "content": { ...du lieu website... } }
app.put('/api/admin/content', requireAdmin, async (req, res, next) => {
  try {
    const content = req.body && req.body.content;

    if (
      !content ||
      typeof content !== 'object' ||
      Array.isArray(content)
    ) {
      return res.status(400).json({
        ok: false,
        error: 'Du lieu content khong hop le'
      });
    }

    await pool.query(
      `INSERT INTO site_content (id, content, updated_at)
       VALUES (1, $1::jsonb, NOW())
       ON CONFLICT (id)
       DO UPDATE SET content = EXCLUDED.content,
                     updated_at = NOW()`,
      [JSON.stringify(content)]
    );

    res.json({ ok: true, message: 'Da xuat ban noi dung' });
  } catch (err) {
    next(err);
  }
});

app.use(express.static(ROOT, { index: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    ok: false,
    error: 'Loi may chu'
  });
});

initDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Website dang chay tren cong ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Khong the khoi tao database:', err.message);
    process.exit(1);
  });
=======

const express = require('express');
const path = require('path');
const { Pool } = require('pg');

const app = express();
const PORT = process.env.PORT || 10000;
const ROOT = __dirname;

app.disable('x-powered-by');
app.use(express.json({ limit: '50mb' }));

if (!process.env.DATABASE_URL) {
  console.error('Thieu bien moi truong DATABASE_URL');
  process.exit(1);
}

if (!process.env.ADMIN_PASSWORD) {
  console.error('Thieu bien moi truong ADMIN_PASSWORD');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production'
    ? { rejectUnauthorized: false }
    : undefined
});

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS site_content (
      id INTEGER PRIMARY KEY CHECK (id = 1),
      content JSONB NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

function requireAdmin(req, res, next) {
  const password = req.get('x-admin-password');

  if (!password || password !== process.env.ADMIN_PASSWORD) {
    return res.status(401).json({
      ok: false,
      error: 'Mat khau quan tri khong dung'
    });
  }

  next();
}

app.get('/healthz', async (req, res) => {
  try {
    await pool.query('SELECT 1');
    res.json({ ok: true, database: 'connected' });
  } catch (err) {
    res.status(503).json({ ok: false, error: 'Database unavailable' });
  }
});

app.get('/api/content', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT content, updated_at FROM site_content WHERE id = 1'
    );

    if (!result.rowCount) {
      return res.json({ content: null });
    }

    res.set('Cache-Control', 'no-store');
    res.json({
      content: result.rows[0].content,
      updatedAt: result.rows[0].updated_at
    });
  } catch (err) {
    next(err);
  }
});

// Tuong thich voi the script src="content.js" hien tai.
app.get('/content.js', async (req, res, next) => {
  try {
    const result = await pool.query(
      'SELECT content FROM site_content WHERE id = 1'
    );

    res.type('application/javascript');
    res.set('Cache-Control', 'no-store');

    if (!result.rowCount) {
      return res.send('');
    }

    const json = JSON.stringify(result.rows[0].content)
      .replace(/</g, '\\u003c')
      .replace(/\u2028/g, '\\u2028')
      .replace(/\u2029/g, '\\u2029');

    res.send(`window.CONTENT = ${json};`);
  } catch (err) {
    next(err);
  }
});

// Luu noi dung da xuat ban. Admin phai gui JSON:
// { "content": { ...du lieu website... } }
app.put('/api/admin/content', requireAdmin, async (req, res, next) => {
  try {
    const content = req.body && req.body.content;

    if (
      !content ||
      typeof content !== 'object' ||
      Array.isArray(content)
    ) {
      return res.status(400).json({
        ok: false,
        error: 'Du lieu content khong hop le'
      });
    }

    await pool.query(
      `INSERT INTO site_content (id, content, updated_at)
       VALUES (1, $1::jsonb, NOW())
       ON CONFLICT (id)
       DO UPDATE SET content = EXCLUDED.content,
                     updated_at = NOW()`,
      [JSON.stringify(content)]
    );

    res.json({ ok: true, message: 'Da xuat ban noi dung' });
  } catch (err) {
    next(err);
  }
});

app.use(express.static(ROOT, { index: false }));

app.get('/', (req, res) => {
  res.sendFile(path.join(ROOT, 'index.html'));
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({
    ok: false,
    error: 'Loi may chu'
  });
});

initDatabase()
  .then(() => {
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Website dang chay tren cong ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Khong the khoi tao database:', err.message);
    process.exit(1);
  });
>>>>>>> a29e4ea33c1f0f5b18faff8910ffdaf3a9d9c7f5
