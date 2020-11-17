const { conn, syncAndSeed, models: {Bicycle, Member, Booking  }, Op } = require('./db');
const express = require('express');
//const { INTEGER } = require('sequelize/types');
//const { Where } = require('sequelize/types/lib/utils');
//more confused by this than i should be
const app = express();

const nav = `<nav> <a href = '/'>bikes</a> <a href = '/members'>members</a> <a href = '/bookings'>bookings</a></nav>`;

app.use(express.urlencoded({extended:false}));

app.use(express.json());


app.post('/add_bike', async(req, res, next)=> {
    try {

        console.log(req.body);
        await Bicycle.create(req.body);
        res.redirect('/bikes');
    }
    catch(ex){

    }

});

app.get('/', (req, res, next)=>{

    try {
    res.redirect('/bikes');
    }
    catch(ex){
        next(ex);
    }   
});


app.get('/bikes', async(req, res, next)=> {
    try {
 
        const bicycle = await Bicycle.findAll(); 
        res.send(`
            <html>
                <head>
                </head>
                <body>
                ${nav}    
                <h1>OUR BIKES</h1>
                        <ul>
                            ${
                                bicycle.map( bike =>`<li> ${bike.name} </li>`).join(' ')
                            }
                        </ul>    
                            
                        <p>Add a Bike</p>
                       
                        <form action='/add_bike' method='post'>
                            <input type="text" name="name">
                            </input>
                            <button type='submit'>Submit</button>
                            </form>
                
                </body>
            </html>`);
     
    }
    catch(ex){
        //seems to send error message to the website which is maybe why we use it here and
        //console.log in other places
        next(ex);

    }

});

app.get('/members', async(req, res, next)=> {
    try {
 

     
        const member = await Member.findAll({
            include: [ //Member, Bicycle
                //not needed for this but if you renamed foriegn key you need to let sequilize know 
                {
                   model: Member,
                    //lets  postgres know you renamed a foriegn key so it can join properly
                   as: 'sponsor',
                   //where: null

                } 
                
            ],
            where: {sponsorId: null}
        }); 
        const membersWithSpon = await Member.findAll({
            include: [ //Member, Bicycle
                //not needed for this but if you renamed foriegn key you need to let sequilize know 
                {
                   model: Member,
                    //lets  postgres know you renamed a foriegn key so it can join properly
                   as: 'sponsor',
                   //where: null

                } 
                
            ],
            //this is supposed to work???
            where: {sponsorId:{ [Op.ne]: null}}
        });

        // const test = [...membersWithSpon]
        // console.log(test);
        res.send(`
            <html>
                <head>
                </head>
                <body>
                    ${nav}  
                    <h1>OUR MEMBERS</h1>
                        <ul>
                        ${
                            member.map( member =>`<li> ${member.name}</li>`).join(' ')
                        }
                            ${
                                membersWithSpon.map( member =>`<li> ${member.name} sponsor ${member.sponsor.name}</li>`).join(' ')
                            }
                        </ul>    
                </body>
            </html>`);

    }
    catch(ex){
        //seems to send error message to the website which is maybe why we use it here and
        //console.log in other places
        next(ex);

    }

});

app.get('/bookings', async(req, res, next)=> {
    
    const booking = await Booking.findAll({
        include: [ Member, Bicycle]});
    

    try { 
        res.send(`
            <html>
            <head>
            </head>
            <body>
                ${nav}  
                <h1>BOOKINGS</h1>
                    <ul>
                        ${
                            booking.map( booking =>`<li> member: ${booking.member.name}  bike: ${booking.bicycle.name}  start ${booking.start} end ${booking.end}</li>`).join(' ')
                        }
                    </ul>    
            </body>
        </html>`
        );
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
        //if it's not listening get does not work?? it does not 
        app.listen(port, ()=>console.log(`listening on port ${port}`));
    }
    catch(ex){
        console.log(ex);
    }

}

init();