//Class that represents a user object
class User{
    // constructor (email, sp,pp,sg,pg){
    //     this.email = email
    //     this.sp = sp
    //     this.pp = pp
    //     this.sg = sg
    //     this.pg = pg
    // }
    constructor (uid,email,displayName,pods){
        this.uid = uid
        this.email = email
        this.displayName = displayName
        this.pods = pods
    }

    toString(){
        return this.email;
    }

}

// Firestore data converter- from user Object in js to Firebase User object.
const userConverter = {
    toFirestore: (user) => {
        return {
            uid: user.uid,
            email: user.email,
            displayName : user.displayName,
            pods : []
            };
    },
    fromFirestore: (snapshot, options) => {
        const data = snapshot.data(options);
        return new User(data.uid, data.email, data.displayName, data.pods);
    }
};

export { User, userConverter }