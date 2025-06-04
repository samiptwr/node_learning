const userDB ={
    users: require('../model/users.json'),
    setUser: function(data) {this.users = data}
}

const fsPromises = require('fs').promises
const path = require('path')
const bcrypt = require('bcrypt')

const handleNewUser = async (req, res) =>{
    const {user, pwd} = req.body
    if(!user || !pwd) return res.status(400).json({'message' : 'password and username required!!'})
    //check for duplicate user
    const duplicate = userDB.users.find(person => person.username === user)
    if(duplicate) return res.sendStatus(409) //this code is for conflict
    try{
        //encrypt password
        const hashedPass = await bcrypt.hash(pwd, 10)
        //store new user
        const newUser = {
            "username": user, 
            "roles":{"User":2001},
            "password":hashedPass
        }
        userDB.setUser([...userDB.users, newUser])
        await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users))
        console.log(userDB.users)
        res.status(201).json({"sucess": `New User ${user} Created!!`})
    } catch(err){
        return res.status(500).json({'message': err.message})
    }
}

module.exports = {handleNewUser}