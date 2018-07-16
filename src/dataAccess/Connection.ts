import Mongoose = require("mongoose");
import chalk from 'chalk';
class DataAccess {
    static mongooseInstance: any;
    static mongooseConnection: Mongoose.Connection;

    constructor() {
        DataAccess.connect();
    }

    static connect(): Mongoose.Connection {
        if (this.mongooseInstance) return this.mongooseInstance;

        this.mongooseConnection = Mongoose.connection;
        this.mongooseConnection.once("open", () => {
            console.log(chalk.green("MongoDB connected."));
        });

        this.mongooseInstance = Mongoose.connect("mongodb://localhost/chat-app").catch((error) => {
            console.log(chalk.red('Failed to Connect MongoDB'));
        });
        this.mongooseInstance.Promise = global.Promise;
        return this.mongooseInstance;


    }
}

DataAccess.connect();
export = DataAccess;

