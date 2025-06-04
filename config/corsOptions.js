const whitelist = ['https://www.freegems.xyz', 'http://localhost:5000', 'http://www.127.0.0.1:5000', 'http://127.0.0.1:5500']

const corsOption = { 
    origin: (origin, callback) => {
        if(whitelist.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        } else {
            callback(new Error('Not Allowed by CORS!'))
        }
    },
    optionsSuccessStatus : 200
}

module.exports = corsOption