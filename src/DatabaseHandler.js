// get sql module
var sqlite3 = require("sqlite3").verbose();

module.exports = {
    db: false,

    // Initiate the database
    init: (sqlite_location) => {
        this.db = new sqlite3.Database(sqlite_location);
        // this.db.run("CREATE TABLE IF NOT EXISTS submissions(id TEXT PRIMARY KEY NOT NULL)");
        this.db.run("CREATE TABLE IF NOT EXISTS comments(id TEXT PRIMARY KEY, status INTEGER)");
        this.db.run("CREATE TABLE IF NOT EXISTS response(id TEXT PRIMARY KEY, status INTEGER)");
    },

    // Close database connection
    close: () => {
        this.db.close();
    },

    // Check if a reddit submission id is already stored
    is_checked: (id, callback) => {
        try {
            this.db.get("SELECT * FROM comments WHERE id = ?", id, (err, row) => {
                if(err){
                    console.log(err);
                    return;
                }

                var found = true;
                if (!row) {
                    found = false;
                }

                callback({id: id, found: found});
            });
        } catch (ex) {
            return callback({id: id, found: false});
        }

    },

    // Check if a reddit submission id is already stored
    insert_id: (id) => {
        this.db.run("INSERT INTO comments (id, status) VALUES (?, 0)", [id]);
    },

    // Check if a reddit submission id is already stored
    insert_response: (id) => {
        this.db.run("INSERT INTO comments (id, status) VALUES (?, 0)", [id]);
    }
};