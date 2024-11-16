//Class that represents a user object
class User{
    constructor (email, sp,pp,sg,pg){
        this.email = email
        this.sp = sp
        this.pp = pp
        this.sg = sg
        this.pg = pg
    }

    toString(){
        return this.email;
    }

}

// Firestore data converter- from user Object in js to Firebase User object.
const userConverter = {
    toFirestore: (user) => {
        return {
            email: user.email,
            sp: [],
            pp: [],
            sg: [],
            pg: [],
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.email, data.sp, data.pp, data.sg, data.pg);
    }
};

export { User, userConverter }