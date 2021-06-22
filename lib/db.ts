import { randomBytes } from 'crypto';
import { Pool } from 'pg';
import { BookInfo, createSerializableBookInfo, SerializableBookInfo } from './types';
const pool = new Pool();

// TODO database functions?

export async function createUserFromGoogle(gui) {
    const create_result = await pool.query("INSERT INTO users (google_user_id) VALUES ($1)", [gui]);
    if (create_result.rowCount == 0) {
        throw {
            message: "Unable to create user",
        };
    };
}

export async function findUserIdFromGoogle(gui) {
    const result = await pool.query("SELECT user_id FROM users WHERE google_user_id = $1", [gui]);

    if (result.rowCount > 1) {
        throw {
            message: "More than one account associated with this google user id??",
        };
    }
    if (result.rowCount == 0) {
        return null;
    }

    return result.rows[0].user_id;
}

export async function createSession(user_id: number) {
    const session_token = randomBytes(32).toString('hex');

    await pool.query("INSERT INTO sessions (user_id, session_token) VALUES ($1, $2)", [user_id, session_token]);

    return session_token;
}

export async function deleteSession(token: string) {
    await pool.query("DELETE FROM sessions WHERE session_token = $1", [token]);
}

export async function getUserIdFromstring(token: string) {
    const result = await pool.query("SELECT user_id FROM sessions WHERE session_token = $1", [token]);

    if (result.rowCount > 1) {
        throw {
            message: "More than one account associated with this token??",
        };
    }
    if (result.rowCount == 0) {
        return null;
    }

    return result.rows[0].user_id;
}


export async function getUserInfo(user_id: number) {
    const result = await pool.query("SELECT user_id, moderation_level, username FROM users WHERE user_id = $1", [user_id]);

    if (result.rowCount > 1) {
        throw {
            message: "More than one account associated with this user id??",
            user_id,
        };
    }
    if (result.rowCount == 0) {
        throw {
            message: "Unable to find a user with that user id",
            user_id,
        };
    }

    return result.rows[0];
}

export async function setUsername(user_id: number, username) {
    const result = await pool.query("UPDATE users SET username = $2 WHERE user_id = $1", [user_id, username]);

    if (result.rowCount > 1) {
        throw {
            message: "More than one account associated with this user id??",
            user_id,
        };
    }
    if (result.rowCount == 0) {
        throw {
            message: "Unable to find a user with that user id",
            user_id,
        };
    }
}

export async function createBook(bookDetails: SerializableBookInfo) {
    const result = await pool.query<{ book_id: number }>(
        "INSERT INTO books VALUES (DEFAULT, $1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING book_id",
        [
            bookDetails.cover_url,
            bookDetails.title,
            bookDetails.title_romanized,
            bookDetails.title_native,
            bookDetails.description,
            bookDetails.author,
            bookDetails.start_date,
            bookDetails.end_date,
            bookDetails.banner_url,
            bookDetails.release_status,
        ]
    );

    if (result.rowCount == 0) {
        throw {
            message: "Unable to create book",
        };
    }

    return result.rows[0].book_id;
}

export async function getBook(book_id: number) {
    const result = await pool.query<BookInfo>("SELECT * FROM books WHERE book_id = $1::integer", [book_id]);

    if (result.rowCount == 0) {
        throw {
            message: "Unable to find a book with that book id",
            book_id,
        };
    }

    const info = result.rows[0];

    return createSerializableBookInfo(info);
}

export async function getUserBookInfos(user_id: number) {
    const result = await pool.query<BookInfo>("SELECT * FROM user_books INNER JOIN books USING(book_id) WHERE user_id = $1::integer", [user_id]);

    return result.rows;
}

export async function getUserBooks(user_id: number) {
    const result = await pool.query("SELECT * FROM user_books WHERE user_id = $1::integer", [user_id]);

    return result.rows;
}

export async function addUserBooks(user_id: number, book_id: number) {
    const result = await pool.query("INSERT INTO user_books (user_id, book_id) VALUES ($1, $2)", [user_id, book_id]);

    if (result.rowCount == 0) {
        throw {
            message: "Unable to add book",
        };
    }
}

export async function deleteUserBooks(user_id: number, book_id: number) {
    await pool.query("DELETE FROM user_books WHERE user_id = $1 AND book_id = $2", [user_id, book_id]);
}

export async function updateUserBookChaptersRead(user_id: number, book_id: number, new_chapters_read: number) {
    const result = await pool.query("UPDATE user_books SET chapters_read = $3 WHERE user_id = $1 AND book_id = $2", [user_id, book_id, new_chapters_read]);

    if (result.rowCount > 1) {
        throw {
            message: "More than one user book associated with these ids??",
            user_id,
        };
    }
    if (result.rowCount == 0) {
        throw {
            message: "Unable to find a users book",
            user_id,
        };
    }
}

export async function getVolumeForChapters(book_id: number, chapters_read: number) {
    const result = await pool.query("SELECT volume_number, chapter_count FROM volumes WHERE book_id = $1 ORDER BY volume_number", [book_id]);
    const [volumes] = result.rows
        .reduce((acc, current, idx) => {
            const [, prev_total_chapters] = idx > 0 ? acc[idx - 1] : [0, 0];
            acc.push([current.volume_number, prev_total_chapters + current.chapter_count]);
            return acc;
        }, [])
        .filter(([, total_chapters]) => total_chapters <= chapters_read)
        .map(([volume_number]) => volume_number)
        .slice(-1);
    return volumes || 0;
}

export async function withUserId<T>(token: string, callback: (user_id: number) => Promise<T>) {
    const user_id = await getUserIdFromstring(token);
    if (user_id == null) {
        return null
    }

    return await callback(user_id);
}