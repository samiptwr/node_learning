const userDB ={
    users: require('../model/users.json'),
    setUser: function(data) {this.users = data}
}

const fsPromises = require('fs').promises
const path = require('path')

const handleLogout = async (req, res) => {
    const cookies = req.cookies
    if(!cookies) return res.sendStatus(204)  //no content
    const refreshToken = cookies.jwt

    //is refreshtoken in db?
    const foundUser = userDB.users.find(person => person.refreshToken === refreshToken)
    if(!foundUser) {
        res.clearCookie('jwt', {httpOnly : true})
        return res.sendStatus(204)
    }
    
    //delete the refresh token
    const otherUsers = userDB.users.filter(person => person.refreshToken !== foundUser.refreshToken)
    const currentUser = {...foundUser, refreshToken: ''}
    userDB.setUser([...otherUsers, currentUser])
    await fsPromises.writeFile(path.join(__dirname, '..', 'model', 'users.json'), JSON.stringify(userDB.users))

    res.clearCookie('jwt', {httpOnly: true})
    res.sendStatus(204)
}

module.exports = {handleLogout}