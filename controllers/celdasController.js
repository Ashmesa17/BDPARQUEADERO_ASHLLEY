const Celdas= require('../models/celdas.js');

const postCeldas= async (req,res)=>{
  let msg='celda inserted'
  const body= req.body
  try{
      const celdas = new Celdas (body)
      await celdas.save() 
  }catch(error){
      msg=error
  }
  res.json({msg:msg})
}

const getCeldas = async (req, res)=> {
    const celdas = await Celdas.find()

    res.json(celdas)
}

const getCelda = async (req, res) => {
    const id = req.params.id;
    const celda = await Celdas.findById(id);
    if (!celda) {
      res.status(404).json({ mensaje: 'Celda no encontrada' });
    } else {
      res.json(celda);
    }
  };

  const getCeldasDisponibles = async (req, res) => {
    const estado = req.params.estado;
    const celda = await Celdas.find({ estado });
    res.json(celda);
  };

  const putCeldas = async (req, res) => {
    const id = req.params.id;
    const celda = await Celdas.findById(id);
    if (!celda) {
      res.status(404).json({ mensaje: 'Celda no encontrada' });
    } else {
      celda.estado = req.body.estado;
      celda.placaVehiculo = req.body.placaVehiculo;
      celda.fechaIngreso = req.body.fechaIngreso;
      celda.fechaSalida = req.body.fechaSalida;
      celda.pin = req.body.pin;
      await celda.save();
      res.json(celda);
    }
  };

  const deleteCeldas = async (req, res) => {
    const id = req.params.id;
    await Celdas.findOneAndDelete(id);
    res.json({ mensaje: 'Celda eliminada' });
  };

  //Metodos

  //limite de 10 celdas 

  const maxCeldas = process.env.MAX_CELDAS || 10; 
    const limiteCeldas = async (req, res) => {
    const count = await Celdas.countDocuments();
    if (count >= maxCeldas) {
        res.status(403).json({ mensaje: `No se pueden crear más de ${maxCeldas} celdas` });
    } else {
        const celda = new Celdas({
        estado: 'disponible'
        });
        await celda.save();
        res.json(celda);
    }
    };

    

  //parquear

  const parquear = async (req, res) => {
    try {
      const { placaVehiculo } = req.body; 
  
      if (!placaVehiculo) {
        return res.status(400).json({ mensaje: 'Debe proporcionar la placa del vehículo' });
      }
  
      const celdaDisponible = await Celdas.findOne({ estado: 'disponible' });
  
      if (!celdaDisponible) {
        return res.status(404).json({ mensaje: 'No hay celdas disponibles' });
      }
  
      celdaDisponible.placaVehiculo = placaVehiculo;
      celdaDisponible.estado = 'no disponible';
      celdaDisponible.fechaIngreso = new Date();
  
      await celdaDisponible.save();
  
      res.json(celdaDisponible);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al parquear el vehículo', error });
    }
  };

  //Valor a pagar

  const calcularValorAPagar = async (req, res) => {
    try {
        const id = req.params.id;
        const celda = await Celdas.findById(id);

        if (!celda || !celda.fechaIngreso) {
            return res.status(404).json({ mensaje: 'Celda no encontrada o fecha de ingreso no disponible' });
        }
        const fechaIngreso = celda.fechaIngreso;
        const fechaSalida = new Date();

        const diferencia = fechaSalida - fechaIngreso;
        const horas = diferencia / 3600000;
        const tarifaPorHora = 5000;
        const valorAPagar = Math.ceil(horas) * tarifaPorHora;

        res.json({ valorAPagar });
    } catch (error) {
        res.status(500).json({ mensaje: 'Error al calcular el valor a pagar', error });
    }
};

 
  //salir

  const salir = async (req, res) => {
    try {
      const id = req.params.id;
      const celda = await Celdas.findById(id);
      if (!celda) {
        return res.status(404).json({ mensaje: 'Celda no encontrada' });
      }
      celda.estado = 'disponible';
      celda.placaVehiculo = '';
      celda.fechaIngreso = null;
      celda.fechaSalida = null;
      celda.pin = '';
      await celda.save();
      res.json(celda);
    } catch (error) {
      res.status(500).json({ mensaje: 'Error al actualizar la celda', error });
    }
  };

module.exports= {
    getCeldas,
    postCeldas,
    putCeldas,
    getCelda,
    getCeldasDisponibles,
    deleteCeldas,
    parquear,
    calcularValorAPagar,
    limiteCeldas,
    salir
}


