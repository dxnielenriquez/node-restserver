const { response, request } = require('express')
const bcryptjs = require('bcryptjs');

const Usuario = require('../models/usuario');

const usuariosGet = async (req = request, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };

    const [total, usuarios] = await Promise.all([
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip(Number(desde))
            .limit(Number(limite))
    ])

    res.json({
        total,
        usuarios

    });
}

const usuariosPost = async (req, res = response) => {

    const { name, email, password, role } = req.body;
    const usuario = new Usuario({ name, email, password, role });

    //verificar si el correo existe
    // const existeEmail = await Usuario.findOne({ email });
    // if ( existeEmail) {
    //     return res.status(400).json({
    //         msg: 'El correo ya esta registrado'
    //     });
    // }

    //encriptar contraseña
    const salt = bcryptjs.genSaltSync();
    usuario.password = bcryptjs.hashSync(password, salt);

    //guardar en BD
    await usuario.save();

    res.json({
        usuario
    });
}

const usuariosPut = async (req, res = response) => {

    const { id } = req.params;
    const { _id, password, google, email, ...resto } = req.body;

    //todo validator contra base de datos
    if (password) {
        //encriptar
        const salt = bcryptjs.genSaltSync();
        resto.password = bcryptjs.hashSync(password, salt);

    }

    const usuario = await Usuario.findByIdAndUpdate(id, resto);

    res.json(usuario);
}

const usuariosPatch = (req, res = response) => {

    res.json({
        msg: 'patch API - controlador'
    });
}

const usuariosDelete = async (req, res = response) => {

    const { id } = req.params;

    //borrado fisico
    // const usuario = await Usuario.findByIdAndDelete( id );
   
    //eliminado logico
   const usuario = await Usuario.findByIdAndUpdate( id , { state: false})
   
    res.json(usuario)
}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosPatch,
    usuariosDelete
}
