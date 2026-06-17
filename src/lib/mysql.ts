import mysql from 'mysql2/promise';

let pool: mysql.Pool;

export function getDbConnection() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'localhost',
      port: Number(process.env.DB_PORT) || 3306,
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'test',
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return pool;
}

export async function initializeDatabase() {
  const connection = getDbConnection();
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS form_submissions (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      firm_name VARCHAR(255) NOT NULL,
      address TEXT NOT NULL,
      mobile_number VARCHAR(20) NOT NULL,
      gst_number VARCHAR(50) NULL,
      dealing_in TEXT NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )
  `;
  try {
    await connection.query(createTableQuery);
  } catch (error) {
    console.error('Failed to initialize database table:', error);
    throw error;
  }
}
