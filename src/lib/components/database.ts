import Database from 'better-sqlite3';
import type { UserProfile } from './GAuth';
import { v4 as uuidv4 } from 'uuid';
import type { ProblemTicket } from '../../routes/support/+page.server';
import { tick } from 'svelte';


// Connect to the SQLite database
const db = new Database('./database.db');
db.pragma('journal_mode = WAL');
export interface UsersTable {
    userID: string;
    email: string;
    name: string;
    passID: string;
    guserid: string;
}
export interface QuerryResult {
    success: boolean;
    value?: any;
}


db.exec(`
    CREATE TABLE IF NOT EXISTS tickets (
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      college TEXT NOT NULL,
      problem TEXT NOT NULL,
      category TEXT NOT NULL,
      phone TEXT NOT NULL,
      ticketID TEXT PRIMARY KEY NOT NULL,
      email TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL
    );
  `);
  try {
    db.exec('ALTER TABLE tickets ADD COLUMN solved BOOLEAN DEFAULT 0 NOT NULL');
    console.log('Column "solved" added successfully.');
  } catch (err:any) {
    console.error('Error adding column:', err.message);
  }

export function userExistsGSub(guserid: string): QuerryResult {
    try {
        const stmt = db.prepare('SELECT * FROM users WHERE guserid = ?');
        const user = stmt.get(guserid); // `.get()` retrieves a single row
        if (!user) {
            return { success: false }
        }
        return { success: true, value: (user as UsersTable) };
    } catch {
        return { success: false };
    }
}
export function userExistsUserID(userID: string): QuerryResult {
    try {
        const stmt = db.prepare('SELECT * FROM users WHERE userID = ?');
        const user = stmt.get(userID); // `.get()` retrieves a single row
        if (!user) {
            return { success: false }
        }
        return { success: true, value: (user as UsersTable) };
    } catch {
        return { success: false };
    }
}
export function userExistsEmail(email: string): QuerryResult {
    try {
        const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
        const user = stmt.get(email); // `.get()` retrieves a single row
        if (!user) {
            return { success: false }
        }
        return { success: true, value: (user as UsersTable) };
    } catch {
        return { success: false };
    }
}
export function addUserToTable(user: UsersTable) {
    const stmt = db.prepare('INSERT INTO users (userID, email, name, passID, guserid) VALUES (?, ?, ?, ?, ?)');
    stmt.run(user.userID, user.email, user.name, user.passID, user.guserid);
}
export function manageUserLogin(userProfile: UserProfile) {
    const exists = userExistsEmail(userProfile.email);

    if (!exists.success) {
        const userID = uuidv4(), passID = '@none';
        const user: UsersTable = {
            userID: userID,
            passID: passID,
            name: userProfile.name,
            guserid: userProfile.sub,
            email: userProfile.email
        };

        addUserToTable(user);
        return;
    }
}
export function addTicketToDB(ticket: ProblemTicket) {
    const stmt = db.prepare(`
        INSERT INTO tickets (name, description, college, problem, category, phone, ticketID, email, timestamp, solved)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    
    stmt.run(
        ticket.name,
        ticket.description,
        ticket.college,
        ticket.problem || ticket.category,
        ticket.category,
        ticket.phone,
        ticket.ticketID,
        ticket.email,
        ticket.timestamp || new Date().toISOString(), // Use provided timestamp or default to current time
        ticket.solved || 0  // If 'solved' is not provided, default to 0 (unresolved)
    );
}


export function getTicketsFromEmail(email:string)
{
    const stmt = db.prepare('SELECT * FROM tickets WHERE email = ?');
    const tickets = stmt.all(email);
    return tickets;
}