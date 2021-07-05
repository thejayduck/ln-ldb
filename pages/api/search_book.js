const { Pool } = require('pg');
const pool = new Pool();

export default async function searchBook({ query }, res) {
    const result = await pool.query("SELECT book_id, title, cover_url FROM books WHERE title ILIKE upper('%' || $1 || '%')", [query.title]);
    res.status(200).json({ status: "OK", data: result.rows });
}