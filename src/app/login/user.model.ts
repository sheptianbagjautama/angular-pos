export class User { 
    constructor(
        public _accessToken:string,
        public tokenType:string,
        private _tokenExpirationDate:Date
    ){}

    get accessToken(){
        if (!this._tokenExpirationDate || new Date() > this._tokenExpirationDate) {
            return null;
        }

        return this._accessToken;
    }
}