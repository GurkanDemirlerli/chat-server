import DataAccess = require('../Connection');
import { Schema } from 'mongoose';
import { IFriendRequest } from '../../models';
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class FriendRequestSchema {

    static get schema() {
        var schema = new Schema({
            sender: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            receiver: {
                type: Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            requestMessage: {
                type: String,
                default: 'Arkadaş Olalım Mı?'
            },
            requestTime: {
                type: Date,
                default: Date.now()
            },
            //0 beklemede
            //1 kabul
            //2 ret
            //daha sonra enum yapılacaktır.
            status: {
                type: Number,
                default: 0
            }
        });

        //Zaten arkadaş olup olmadıkları kontrol ediliyor.
        schema.pre('save', function (next) {
            var self = this;

            mongooseConnection.model('FriendShip')
                .find({})
                .or([{
                    sender: self.sender,
                    acceptor: self.receiver
                }, {
                    sender: self.receiver,
                    acceptor: self.sender
                }
                ])
                .exec(function (err, docs) {
                    if (!docs.length) {
                        console.log('users was not friends');
                        mongooseConnection.model('FriendRequest')
                            .find({})
                            .or([{
                                sender: self.sender,
                                receiver: self.receiver,
                                status: 0
                            }, {
                                receiver: self.receiver,
                                acceptor: self.sender,
                                status: 0
                            }
                            ])
                            .exec(function (err, docs) {
                                if (!docs.length) {
                                    console.log('Beklemede olan arkadaşlık isteği yok.');
                                    next();
                                } else {
                                    console.log('Zaten beklemede olan bir arkadaşlık isteği var.');
                                    next(new Error("Zaten beklemede olan bir arkadaşlık isteği var!"));
                                }
                            })
                    } else {
                        console.log('users was already friends');
                        next(new Error("Users was already friends!"));
                    }
                });
        });
        return schema;
    }
}
var schema = mongooseConnection.model<IFriendRequest>('FriendRequest', FriendRequestSchema.schema);
export = schema;
