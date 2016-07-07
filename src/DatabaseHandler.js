// get sql module
var sqlite3 = require("sqlite3").verbose();

module.exports = {
    db: false,

    // Initiate the database
    init: (sqlite_location) => {
        this.db = new sqlite3.Database(sqlite_location);
        // this.db.run("CREATE TABLE IF NOT EXISTS submissions(id TEXT PRIMARY KEY NOT NULL)");
        this.db.run("CREATE TABLE IF NOT EXISTS comments(id TEXT PRIMARY KEY)");
    },

    // Close database connection
    close: () => {
        this.db.close();
    },

    // Check if a reddit submission id is already stored
    is_checked: (id, callback) => {
        this.db.run("SELECT * FROM comments WHERE id = ?", [id], (result) => {
            callback(!result);
        });
    },

    // Check if a reddit submission id is already stored
    insert_id: (id) => {
        this.db.run("INSERT INTO comments (id) VALUES (?)", [id]);
    }
};