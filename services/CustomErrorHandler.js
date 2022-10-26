class CustonErrorHandler extends Error{
    constructor(status, message){
        super();
        this.status = status;
        this.message = message;
    }

    static alreadyExist(message){
        return new CustonErrorHandler(409, message);
    }

    static cannotFindUser(message = "Username or password is not correct"){
        return new CustonErrorHandler(401, message);
    }

    static unAuthorisedUser(message = "Unauthorised"){
        return new CustonErrorHandler(401, message);
    }

    static userNotFound(message = "404 Not Found"){
        return new CustonErrorHandler(404, message);
    }
}

export default CustonErrorHandler