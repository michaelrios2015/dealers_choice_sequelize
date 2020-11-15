const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4 } = Sequelize;
const conn =  new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    protocol: 'postgres',
    dialectOptions: {
        ssl: true
    }
});

// || 'postgres://postgres:JerryPine@localhost/country_club' 

const Bicycle = conn.define('bicycle', {
    name: {
        type: STRING(20)
    }
});

const Member = conn.define('member', {
    // id: {
    //     type: UUID,
    //     primaryKey: true,
    //     defaultValue: UUIDV4
    // },
    name: {
        type: STRING(20)
    }
});

const Booking = conn.define('booking', {
    start: {
        type: STRING(20)
    },
    end: {
        type: STRING(20)
    }
});

Booking.belongsTo(Member);
Booking.belongsTo(Bicycle);

//think this just makes it easier to seach later.... 
Member.hasMany(Booking);
Bicycle.hasMany(Booking);

Member.belongsTo(Member, {as: 'sponsor'});

const syncAndSeed = async()=>{
    await conn.sync({ force: true});
    const [dirt, uni, jumbo, mini, rusty, steve, earl, duke, shady] = await Promise.all([
        Bicycle.create({name: 'dirt'}),
        Bicycle.create({name: 'uni'}),
        Bicycle.create({name: 'jumbo'}),
        Bicycle.create({name: 'mini'}),
        Bicycle.create({name: 'rusty'}),
        Member.create({name: 'steve'}),
        Member.create({name: 'earl'}),
        Member.create({name: 'duke'}),
        Member.create({name: 'shady'})


    ]);

    // console.log('-------------------------');
    // console.log(JSON.stringify(steve, null, 2));
    steve.sponsorId = earl.id;
    await steve.save();
    duke.sponsorId = shady.id;
    await duke.save();

    await Booking.create({start: '1pm', end: '2pm', memberId: 1, bicycleId: 1});
    await Booking.create({start: '1:30pm', end: '5pm', memberId: 3, bicycleId: 5});
    await Booking.create({start: '7pm', end: '12am', memberId: 2, bicycleId: 3});
};

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

module.exports = { 
    conn,
    syncAndSeed,
    models: {
        Bicycle,
        Member,
        Booking
    }
}