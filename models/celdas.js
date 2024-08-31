const {model, Schema} = require('mongoose');


const CounterSchema = new mongoose.Schema({
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  });  

const Counter = mongoose.model("Counter", CounterSchema);

const CeldasSchema = new Schema({
    numeroCelda:{
        type: Number,
        unique: true
    },
    estado: {
        type: String,
        default: "Disponible"
    },
    placaVehiculo: {
        type: String,
        required:false,
        maxlength: [6, 'Maximo 6 caracteres']
    },
    fechaIngreso: {
        type: Date,
        required:false,
        default: new Date()
    },
    fechaSalida:{
        type: Date,
        required:false,
        default: ()=>new Date()
    },
    pin:{
        type: String,
        required:false,
    }
}
)

CeldasSchema.pre("save", async function (next) {
    const doc = this;
    if (!doc.isNew) return next();
  
    const counter = await Counter.findByIdAndUpdate(
      { _id: "celdas_seq" },
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
  
    doc.numeroCelda = counter.seq;
    next();
  });

CeldasSchema.pre('save', function(next) {
    if (this.isNew) {
      const pin = encrypt(`${this.numeroCelda}${this.placaVehiculo}`);
      this.pin = pin;
    }
    next();
  });
  
  function encrypt(str) {
    const bcrypt = require('bcrypt');
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(str, salt);
  }


module.exports=model('Celdas', CeldasSchema, 'Celdas')