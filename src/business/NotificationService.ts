import { injectable, inject } from 'inversify';
import { IOCTYPES } from '../ioc/ioc-types.enum';
import { INotificationService } from './interfaces';
import 'reflect-metadata';

@injectable()
export class NotificationService implements INotificationService {

    constructor() { }

    test(task) {
        var sendNotification = function (data) {
            var headers = {
                "Content-Type": "application/json; charset=utf-8",
                "Authorization": "Basic NTdlNmMyMWMtYTMwNi00ZTNjLTkwOGItOWY0NjY3M2UyYjEy"
            };

            var options = {
                host: "onesignal.com",
                port: 443,
                path: "/api/v1/notifications",
                method: "POST",
                headers: headers
            };

            var https = require('https');
            var req = https.request(options, function (res) {
                res.on('data', function (data) {
                    console.log("Response:");
                    console.log(JSON.parse(data));
                });
            });

            req.on('error', function (e) {
                console.log("ERROR:");
                console.log(e);
            });

            req.write(JSON.stringify(data));
            req.end();
        };

        var message = {
            app_id: "3aafce48-22c1-4de8-ac25-76d7c3689081",
            headings: { "en": "NodeJS'den test" },
            contents: { "en": task.content },
            included_segments: ["All"]
        };

        sendNotification(message);
    }
}