import Database from 'better-sqlite3';

export type CategoryType = 'Special request' |
    "Website" |
    "Passes" |
    "Payment" |
    "Other" |
    "Organisation" |
    "Contests/ Contest results"|
    'Event';
export interface ProblemTicket {
    name: string;
    description: string;
    college: string;
    problem: string;
    category: CategoryType;
    phone: string;
    ticketID: string;
    email: string;
    timestamp: string;
    solved: boolean;
    solved_by_email: string | null
}

// Connect to the SQLite database
const db = new Database('database.db');
db.pragma('journal_mode = WAL');

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
      solved BOOLEAN DEFAULT 0 NOT NULL
    );
  `);


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


export function getTicketsFromEmail(email: string) {
    const stmt = db.prepare('SELECT * FROM tickets WHERE email = ?');
    const tickets = stmt.all(email);
    return tickets as ProblemTicket[];
}

export function setTicketSolved(ticketID: string, solved: boolean) {
    const stmt = db.prepare(`
        UPDATE tickets 
        SET solved = ? 
        WHERE ticketID = ?
    `);
    stmt.run(solved ? 1 : 0, ticketID);
}

export function getTicketByID(ticketID: string): ProblemTicket | null {
    const stmt = db.prepare('SELECT * FROM tickets WHERE ticketID = ?');
    const ticket = stmt.get(ticketID) as ProblemTicket | undefined;
    return ticket ?? null;
}

