const handleVolunLogin = (db, bcrypt) => (req, res) => {
    const {email, password} = req.body;
    if(!email || !password) res.json("Incorrect format of credentials received");
    db.select("*").from("volunteers").where({
        email: email.toLowerCase()
    })
    .then(dbdata => {
        const validatepassword = bcrypt.compareSync(password, dbdata[0].password);
        if(validatepassword){
            res.json(({ 
                "name": dbdata[0].name,
                "email": dbdata[0].email,
                "users": dbdata[0].users,
                "current": dbdata[0].completedusers,
                "past": dbdata[0].userslen
            }))
        }else{
            res.status(400).json("Incorrect Password");
        }
    })
    .catch(e => res.status(400).json(`User doesn't exist`));
}

const handleVolunReg = (db, bcrypt) => (req, res) => {
    try{
        const { name, email, password } = req.body;
        const hash = bcrypt.hashSync(password);
        if(!name || !email || !password) return res.status(400).json("Incorrect format of credentials received");
        db.select("*").from("volunteers").where({
            email: email.toLowerCase()
        })
        .then(dbdata => {
            if(dbdata.length) res.status(400).json("You have already registered");
            else{
                let input = {
                    "email": email.toLowerCase(),
                    "name": name,
                    "password": hash
                }
                db("volunteers").insert(input)
                .returning("*")
                .then(user => {
                    res.json(({ 
                        "name": user[0].name,
                        "email": user[0].email,
                        "users": user[0].users,
                        "current": user[0].completedusers,
                        "past": user[0].userslen
                    }))
                })
                .catch(e => console.log(e));
            }   
        })
        .catch(e => {
            console.log(e);
        });
    }catch(e){
        res.status(400).json(`Error: ${e}`);
    }
}

module.exports = {
    handleVolunLogin: handleVolunLogin,
    handleVolunReg: handleVolunReg
}