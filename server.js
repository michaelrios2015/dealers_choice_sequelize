const Sequelize = require('sequelize');
const conn = new Sequelize(process.env.Database_URL || 'postgres://postgres:JerryPine@localhost/')


const init = async()=> {

    try {
        await conn.authenticate();
    }
    catch(ex){
        console.log(ex);
    }

}

init();