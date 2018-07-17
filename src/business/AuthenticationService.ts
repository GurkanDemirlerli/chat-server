import { verify } from 'jsonwebtoken';
import { ILoginModel, ITokenModel } from '../models';
import { resolve } from 'path';

export class AuthenticationService {

    //ESKI
    public static checkAuthentication(req): Promise<ITokenModel | null> {
        let token: string = req.body.token || req.query.token ||
            req.get('x-access-token') || req.get('authentication') || req.get('authorization') || undefined;
        if (token === undefined) {
            return Promise.resolve(null)
        } else {
            return new Promise((resolve, reject) => {
                verify(token, 'MySecret', (err: Error, decoded: any): boolean | any => {
                    if (err) {
                        resolve(null);
                    } else {
                        req.decoded = decoded;
                        resolve(decoded);
                    }
                });
            }).then(result => {
                return result
            }).catch(err => {
                return err
            });
        }
    }

    //YENI
    public static decodeToken(req): Promise<ITokenModel | null> {
        return new Promise((resolve, reject) => {
            let token: string = req.body.token || req.query.token ||
                req.get('x-access-token') || req.get('authentication') || req.get('authorization') || req.get('Authorization') || undefined;
            if (token === undefined) {
                reject('Cant find token.')
            }
            verify(token, 'MySecret', (err: Error, decoded: any): boolean | any => {
                if (err) {
                    reject('UnAuthorized');
                }
                req.decoded = decoded;
                resolve(decoded);
            });
        });
    }



    public static checkAuthenticationForSocket(token): Promise<ITokenModel | null> {
        return new Promise((resolve, reject) => {
            if (token === undefined) {
                throw new Error('Cant find token');
            }
            verify(token, 'MySecret', (err: Error, decoded: any): boolean | any => {
                if (err) {
                    reject('UnAuthorized');
                }
                resolve(decoded);
            });
        });
    }

    public static authenticatedRoute(req, res, next): void {
        AuthenticationService.checkAuthentication(req).then(isAuth => {
            if (isAuth) {
                next();
            } else {
                console.log('unauthorized access! kicking the client out with 403');
                res.status(403).json({
                    message: 'Error: You need to authenticate to access this part of the API',
                    success: false
                });
            }
        });
    }

    public static isAuthenticated(req): Promise<any> {
        return new Promise((resolve, reject) => {
            let token: string = req.body.token || req.query.token ||
                req.get('x-access-token') || req.get('authentication') || req.get('authorization') || req.get('Authorization') || undefined;
            if (token === undefined) {
                resolve(false);
            }
            verify(token, 'MySecret', (err: Error, decoded: any): boolean | any => {
                if (err) {
                    resolve(false);
                }
                req.decoded = decoded;
                resolve(true);
            });
        });
    }

    // public static provideToken(req, res, next) {

    // }
}
