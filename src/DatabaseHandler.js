// get sql module
var sqlite3 = require("sqlite3").verbose();

module.exports = function () {
    var Logging = require('./Logging');

    var DatabaseHandler = {
        db: false,

        // Initiate the database
        init: (sqlite_location) => {
            this.db = new sqlite3.Database(sqlite_location);
            // this.db.run("CREATE TABLE IF NOT EXISTS submissions(id TEXT PRIMARY KEY NOT NULL)");
            this.db.run("CREATE TABLE IF NOT EXISTS comments(id TEXT PRIMARY KEY)");
            this.db.run("CREATE TABLE IF NOT EXISTS response(id TEXT PRIMARY KEY, markup TEXT, sent INTEGER)");
        },

        // Close database connection
        close: () => {
            this.db.close();
        },

        // Check if a reddit submission id is already stored
        is_checked: (id, callback) => {
            try {
                this.db.get("SELECT * FROM comments WHERE id = ?", id, (err, row) => {
                    if (err) {
                        Logging('red', err);
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
            Logging('cyan', 'Inserting ID into comment', id);
            this.db.run("INSERT INTO comments (id) VALUES (?)", [id]);
        },

        // Check if a reddit submission id is already stored
        insert_response: (id, markup) => {
            Logging('cyan', 'Inserting ID into response', id);
            this.db.run("INSERT INTO response (id, markup, sent) VALUES (?, ?, 0)", [id, markup]);
        },

        // Get all new responses which havn't been sent yet
        get_responses: (callback) => {
            try {
                this.db.all("SELECT * FROM response WHERE sent = 0 LIMIT 5", (err, rows) => {
                    if (err) {
                        Logging('red', err);
                        return;
                    }

                    callback(rows);
                });
            } catch (ex) {
                return callback({});
            }

        },

        set_response_sent: (id) => {
            // attempt to update the sent status on a response
            this.db.run("UPDATE response SET sent = 1 WHERE id = ?", [id]);
        }
    };

    return DatabaseHandler;
}