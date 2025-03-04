import Database from 'better-sqlite3';

export type CategoryType = 'Special request' |
    "Website" |
    "Passes" |
    "Payment" |
    "Other" |
    "Organisation" |
    "Contests/ Contest results" |
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
    solved_by_email: string | null,
    comment: string | null
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
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP NOT NULL,
    solved BOOLEAN DEFAULT 0 NOT NULL,
    comment TEXT CHECK(LENGTH(comment) <= 100) DEFAULT ''
);
  `);
try {
    db.exec("ALTER TABLE tickets ADD COLUMN comment TEXT CHECK(LENGTH(comment) <= 100) DEFAULT '';")
} catch { }
export function addTicketToDB(ticket: ProblemTicket) {
    const stmt = db.prepare(`
        INSERT INTO tickets (name, description, college, problem, category, phone, ticketID, email, timestamp, solved, comment)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
        ticket.solved || 0,  // If 'solved' is not provided, default to 0 (unresolved)
        ticket.comment || '' // Default to empty string if not provided
    );
}

export function getTicketsFrom_Email(email: string) {
    const stmt = db.prepare('SELECT * FROM tickets WHERE email = ?');
    const tickets = stmt.all(email);
    return tickets as ProblemTicket[];
}

export function setTicket_Solved(ticketID: string, solved: boolean, comment: string) {
    const stmt = db.prepare(`
        UPDATE tickets 
        SET solved = ?, comment = ? 
        WHERE ticketID = ?
    `);
    stmt.run(solved ? 1 : 0, comment, ticketID);
}

export function getTicketBy_ID(ticketID: string): ProblemTicket | null {
    const stmt = db.prepare('SELECT * FROM tickets WHERE ticketID = ?');
    const ticket = stmt.get(ticketID) as ProblemTicket | undefined;
    return ticket ?? null;
}

export function getTicketsBy_Category(category: CategoryType): ProblemTicket[] {
    try {
        const stmt = db.prepare('SELECT * FROM tickets WHERE category = ? AND solved = 0');
        const tickets = stmt.all(category) as ProblemTicket[];
        return tickets;
    } catch (error) {
        console.error("Error fetching unsolved tickets by category:", error);
        return [];
    }
}

export function getUnsolved_Tickets(): ProblemTicket[] {
    try {
        const stmt = db.prepare('SELECT * FROM tickets');
        const tickets = stmt.all();
        return tickets as ProblemTicket[];
    } catch (error) {
        console.error("Error fetching unsolved tickets:", error);
        return [];
    }
}

export function updateTicketComment(ticketID: string, comment: string) {
    const stmt = db.prepare(`
        UPDATE tickets 
        SET comment = ? 
        WHERE ticketID = ?
    `);
    stmt.run(comment, ticketID);
}
