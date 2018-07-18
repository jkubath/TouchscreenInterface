export class Return<T> {
    public success: boolean;
    public message: string;
    public data: T;

    constructor(result: any, success?: boolean, message?: string, data?: any) {
        this.success = (success) ? success : this.success;
        this.message = (message) ? message : this.message;
        this.data = (data) ? data : this.data;
    }

    public handleError(exitOnError: boolean, callback?: any): any {
        if(this.success === false){
            if(callback){
                return callback();
            }
            else {
                console.log(this.message);
            }
            if(exitOnError === true){
                process.exit();
            }
        }
    }

}
