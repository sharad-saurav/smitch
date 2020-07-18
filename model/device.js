const mongoose = require('mongoose');



const deviceSchema = mongoose.Schema({
    name: { type: String, 
            required: true 
    },

    devType: {
        type: String,
        enum : ['AA', 'AB', 'AC', 'BA', 'BB', 'BC'],
        default: 'AA'
    },

    currentState: {
        type: Boolean,
        default: false,
        required: true
    }
})

module.exports = mongoose.model('Device', deviceSchema);