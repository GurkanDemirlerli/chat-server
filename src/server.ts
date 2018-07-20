import 'reflect-metadata';
import * as path from 'path';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as cors from 'cors';
import * as errorhandler from 'errorhandler';
import * as logger from 'morgan';
import { createServer, Server as httpServer } from 'http';
import chalk from 'chalk';

import { GLOBAL } from './global';
import { IOC } from './ioc';
import { RouteBinder } from './app/routes';

import * as socketIo from 'socket.io';
import { Socket, Server as socketIoServer } from 'socket.io';
import { SocketHandler } from './socket/socket-handler';
// import { AutoMapperBootstraper } from './mapping/AutoMapperBootstraper';


let app: express.Application = express();
let server: httpServer = createServer(app);
//ASAGIDAKI SATIR CIRCULAR DEPENDENCY OLUSTURUYOR .......DIKKAT........
export let io: socketIoServer = socketIo(server/*, { 'pingInterval': 2000, 'pingTimeout': 5000 }*/);



const port = process.env.PORT || GLOBAL.PORT;
const environment = process.env.NODE_ENV || GLOBAL.DEVELOPMENT;
const log = console.log;
const success = chalk.green;
/* ==========================================================================
	-- Configs
========================================================================== */
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, PUT, POST, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');
    next();
});
app.set('socketio', io);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

if (environment === 'development') {
    app.use(logger('dev'));
    app.use(errorhandler());
}
// app.use(cors({ origin: true, credentials: true }));
/* ==========================================================================
	-- Routes
========================================================================== */

export const container = IOC.configureContainer();
let chatSocket = container.get(SocketHandler);
RouteBinder.configureRoutes(app, container);


/* ==========================================================================
	-- Server
========================================================================== */

server.listen(port, (err: any) => {
    // const AMB: AutoMapperBootstraper = new AutoMapperBootstraper();
    // AMB.init();
    if (err)
        return console.log(err);
    log(success(`Chat-App server listening on port ${GLOBAL.PORT} in ${environment} mode`));
});