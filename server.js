const Sequelize = require('sequelize');
const { STRING, UUID, UUIDV4 } = Sequelize;
const conn = new Sequelize(process.env.Database_URL || 'postgres://postgres:JerryPine@localhost/country_club')


const Bicycle = conn.define('bicycle', {
    name: {
        type: STRING(20)
    }
});

const Member = conn.define('member', {
    id: {
        type: UUID,
        primaryKey: true,
        defaultValue: UUIDV4
    },
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

Member.hasMany(Booking);
Member.hasMany(Bicycle);

Member.belongsTo(Member, {as: 'sponsor'});

const syncAndSeed = async()=>{
    await conn.sync({ force: true});
    const [dirt, uni, jumbo, steve, earl] = await Promise.all([
        Bicycle.create({name: 'dirt'}),
        Bicycle.create({name: 'uni'}),
        Bicycle.create({name: 'jumbo'}),
        Member.create({name: 'steve'}),
        Member.create({name: 'earl'})

    ]);

    console.log('-------------------------');
    console.log(steve.id);
    steve.sponsorId = earl.id;
    await steve.save();

};

const init = async()=> {

    try {
        await conn.authenticate();
        console.log("autheniticated :)")
        syncAndSeed();
    }
    catch(ex){
        console.log(ex);
    }

}

init();