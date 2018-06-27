import DataAccess = require('../Connection');
import { Schema } from 'mongoose';
import { IFriendShip } from '../../models';
var mongoose = DataAccess.mongooseInstance;
var mongooseConnection = DataAccess.mongooseConnection;

class FriendShipSchema {

    static get schema() {
        var schema = new Schema({
            sender: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            acceptor: {
                type: Schema.Types.ObjectId,
                ref: 'User'
            },
            createdAt: {
                type: Date,
                default: Date.now()
            },
        });

        //Zaten arkadaş olup olmadıkları kontrol ediliyor.
        schema.pre('save', function (next) {
            var self = this;

            this.constructor
                .find({})
                .or([{
                    sender: self.sender,
                    acceptor: self.acceptor
                }, {
                    sender: self.acceptor,
                    acceptor: self.sender
                }
                ])
                .exec(function (err, docs) {
                    if (!docs.length) {
                        console.log('users was not friends');
                        next();
                    } else {
                        console.log('users was already friends');
                        next(new Error("Users was already friends!"));
                    }
                });
        });

        //COK ÖNEMLİ: @types/mongoose ile mongoose uyumlu degil doc normalde mongoerror tipinde gözüküyor el ile değiştirildi.
        schema.post('save', function (doc: IFriendShip) {
            mongooseConnection.model('User')
                .findByIdAndUpdate(doc.sender, { $push: { SendedFriendShips: doc._id } }, { 'new': true, 'upsert': true, }, (err, res) => {
                    if (err) {
                        console.log('Yollayan Kullaniciya Arkadas eklenemedi', err);
                    } else {
                        console.log('Yollayan Kullaniciya Arkadas Eklendi', res);
                        mongooseConnection.model('User')
                            .findByIdAndUpdate(doc.acceptor, { $push: { AcceptedFriendShips: doc._id } }, { 'new': true }, (err, res) => {
                                if (err) {
                                    console.log('Kabul Eden Kullaniciya Arkadas eklenemedi', err);
                                } else {
                                    console.log('Kabul Eden Kullaniciya Arkadas Eklendi', res);
                                }
                            });
                    }
                });
        });
        return schema;
    }
}
var schema = mongooseConnection.model<IFriendShip>('FriendShip', FriendShipSchema.schema);
export = schema;
