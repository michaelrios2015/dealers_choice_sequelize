const { conn, syncAndSeed, models: {Bicycle, Member, Booking  }} = require('./db');
const express = require('express');
//more confused by this than i should be
const app = express();


app.get('/bikes', async(req, res, next)=> {
    try {
 
        res.send(await Bicycle.findAll());

        
    }
    catch(ex){
        //seems to send error message to the website which is maybe why we use it here and
        //console.log in other places
        next(ex);

    }

});

app.get('/members', async(req, res, next)=> {
    try {
 
         res.send(await Member.findAll({
            include: [ //Member, Bicycle
                //not needed for this but if you renamed foriegn key you need to let sequilize know 
                {
                   model: Member,
                    //lets  postgres know you renamed a foriegn key so it can join properly
                   as: 'sponsor'

                }
            ]
        }));
        
    }
    catch(ex){
        //seems to send error message to the website which is maybe why we use it here and
        //console.log in other places
        next(ex);

    }

});

app.get('/bookings', async(req, res, next)=> {
    try {
 
 
        res.send(await Booking.findAll({
            include: [ Member, Bicycle]}));
        
    }
    catch(ex){
        //seems to send error message to the website which is maybe why we use it here and
        //console.log in other places
        next(ex);

    }

});


const init = async()=> {

    try {
        await conn.authenticate();
        console.log("autheniticated :)")
        syncAndSeed();
        //dont actually know what a port is just a place a computer and send a recieve info??
        const port = process.env.PORT || 3000;
        //if it's not listening get does not work??
        app.listen(port, ()=>console.log(`listening on port ${port}`));
    }
    catch(ex){
        console.log(ex);
    }

}

init();