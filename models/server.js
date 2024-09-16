const express = require('express'); 
const dbConnect = require('../database/config');
require('../database/config.js')
const {getCeldas, getCelda, postCeldas, getCeldasDisponibles, putCeldas, deleteCeldas,
     parquear, calcularValorAPagar, salir}= require ('../controllers/celdasController.js')




class Server{
    constructor(){
        this.app = express();
        this.pathCeldas= '/api/celdas';
        this.pathParquear= '/api/parquear'
        this.pathSalida= '/api/salida'
        this.pathPagos = '/api/pagos'
        this.route()
        this.dbConnection();
        this.listen();
    }   

    
    async dbConnection() {
        await dbConnect()
    }
    
    route (){
        this.app.use(express.json())

        this.app.post(`${this.pathCeldas}`, postCeldas);
        this.app.get(`${this.pathCeldas}/:id`, getCelda);
        this.app.get(`${this.pathCeldas}`, getCeldas);
        this.app.get(`${this.pathCeldas}/:estado`, getCeldasDisponibles);
        this.app.put(`${this.pathCeldas}/:id`, putCeldas);
        this.app.delete(`${this.pathCeldas}/:id`, deleteCeldas);
        this.app.post(`${this.pathParquear}`, parquear);
        this.app.get(`${this.pathPagos }/:id`, calcularValorAPagar);
        this.app.post(`${this.pathSalida}/:id`, salir);

    }

    listen(){
        this.app.listen(process.env.PORT, () => {
            console.log(`Server is running`);  
        })
    }
}

module.exports =  Server 
    
 