export module Helpers {

    export function isJson(item) {
        item = typeof item !== "string"
            ? JSON.stringify(item)
            : item;

        try {
            item = JSON.parse(item);
        } catch (e) {
            return false;
        }

        if (typeof item === "object" && item !== null) {
            return true;
        }

        return false;
    }

    export function getMongooseObject<T>(object: any): T {
        let source: any = object;
        if (object.hasOwnProperty('_doc')) {
            source = object._doc;
            source.id = object.id;
        }

        if (source.hasOwnProperty('_id')) {
            delete source._id;
        }

        if (source.hasOwnProperty('__v')) {
            delete source.__v;
        }

        return <T>source;
    }



}