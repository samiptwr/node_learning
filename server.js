require('dotenv').config()
const express = require('express')
const app = express()
const path = require('path')
const cors = require('cors')
const errorHandler = require('./middlewares/errorHandler')
const {logger} = require('./middlewares/logEvent')
const verifyJWT = require('./middlewares/verifyJWT')
const corsOption = require('./config/corsOptions')
const cookieParser = require('cookie-parser')
const mongoose = require('mongoose')
const connectDB = require('./config/dbCon')
const PORT = process.env.PORT || 5000

//connect to mongo db
connectDB()

//built-in middleware to handle urlencoded form data
app.use(express.urlencoded({extended: false }))

app.use(cors(corsOption)) 

//builtin middleware for json
app.use(express.json())

//middleware for cookies
app.use(cookieParser())

app.use(express.static(path.join(__dirname, 'public')))
app.use('/subdir',express.static(path.join(__dirname, 'public')))

//routes
app.use('/', require('./routes/root'))
app.use('/register', require('./routes/register'))
app.use('/login', require('./routes/auth'))
app.use('/refresh', require('./routes/refresh'))
app.use('/logout', require('./routes/logout'))

app.use(verifyJWT)
app.use('/employees', require('./routes/api/employees'))

//custom middlewares
app.use(logger)

app.all('*', (req, res) =>{
    res.status(404)
    if(req.accepts('html')){
        res.sendFile(path.join(__dirname, 'views', '404.html'))
    } else if(req.accepts('json')){
        res.json({"error":"404 Page Not Found!!"})
    } else {
        res.type('txt').send('Page Not Found!!')
    }
})

app.use(errorHandler)

mongoose.connection.once('open', () => {
    console.log('MongoDB connected sucessfully!!!')
    app.listen(PORT, ()=> console.log(`Server listening at port ${PORT}`))
})

