const { randomUUID } = require('crypto');

const handleUserRegister = (db) => (req, res) => {
    try{
        let data = (req.body);
        const id = randomUUID();
        let input = {
            "id": id,
            "responses": JSON.stringify(data.responses),
            "advisor": null
        }
        
        db("userdata").insert(input).catch(e => console.log(e));
        // res.json(`Your data was successfully saved in our database your unique ID is ${id}, please store this somewhere for your reference, you will be alloted with an advisor soon`);
        res.json({
            "id": id,
            "advisor": null
        })
    }catch(e){
        res.status(400).send(`Error: ${e}`);
    }
}

const handleUserDelete = (db) => (req, res) => {
    const delId = req.params.id;
    db.select("*").from("userdata").where({
        id: delId
    })
    .then(dbdata => {
        if(dbdata.length){
            db("userdata").where({id: delId}).del().catch(e => console.log(e))
            res.json("Your account has been deleted");
        }else{
            res.json("You haven't used our service yet or your data has been deleted")
        }
    })
    .catch(e => res.status(400).send(`Error: ${e}`));
}

const getAdvisor = (db) => (req, res) => {
    const {id} = req.params;
    db.select("*").from("userdata").where({
        id: id
    })
    .then(dbdata => {
        if(dbdata.length){
            if(dbdata[0].advisor){
                res.json({
                    "advisor": dbdata[0].advisor
                });
            }
            else{
                //Code for finding the advisor goes here
                db.min('userslen').from('volunteers')
                .then(result => {
                    const minUsersLen = result[0].min;
                    db.select("*").from("volunteers").where({
                        userslen: parseInt(minUsersLen)
                    })
                    .then(advisor => {
                        const advemail = advisor[0].email;
                        const advname = advisor[0].name;

                        //Updating data for user
                        db('userdata').where({id: id})
                        .update({ advisor: advemail })
                        .catch(e => console.log("Unable to update advisor"));

                        //Updating data for volunteers
                        let volunteerUsers;
                        db.select("*").from("volunteers")
                        .where({email: advemail})
                        .then(volun => {
                            volunteerUsers = volun[0].users;
                            dataToSend = dbdata[0];
                            dataToSend.advisor = advemail;

                            if(!volunteerUsers){
                                volunteerUsers = [ dataToSend ]
                            }else{
                                volunteerUsers.push(dataToSend)
                            }

                            db('volunteers').where({email: advemail})
                            .update({
                                userslen: minUsersLen+1,
                                users: volunteerUsers
                            })
                            .catch(e => console.log("Unable to update advisor details"));
                        });


                        res.json({
                            "advisor": advemail
                        });
                    })
                    .catch(e => res.status(400).send(`Error while finding advisor: ${e}`))
                })
                .catch(e => res.status(400).send(`Error: ${e}`))
            }
        }else{
            res.status(400).json("You haven't signed up yet, please try again");
        }
    })
    .catch(e => res.status(400).send(`Error: ${e}`));
}

module.exports = {
    handleUserRegister: handleUserRegister,
    handleUserDelete: handleUserDelete,
    getAdvisor: getAdvisor
}