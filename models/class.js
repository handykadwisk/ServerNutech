class User{
    #password
    constructor(email, first_name, last_name, password, profile_image){
        this.email = email,
        this.first_name = first_name,
        this.last_name = last_name,
        this.#password = password
        this.profile_image = profile_image
    }
}

class Factory{
    static user(email, first_name, last_name, password,profile_image){
        return new User(email, first_name, last_name, password,profile_image)
    }
}
module.exports = Factory
