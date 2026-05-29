const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');

const app = express();
const PORT = 3000;

app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.post('/enviar', (req, res) => {
    const { nombre, apellido, email, comentario } = req.body;
    console.log(`Datos recibidos: ${nombre} ${apellido} - ${email}`);
    res.send(`<h1>¡Gracias ${nombre}!</h1><p>Tu comentario ha sido recibido en el servidor.</p>`);
});

app.post('/login', (req, res) => {
    const { usuario, clave } = req.body;

    if (usuario === 'admin' && clave === '1234') {
        res.cookie('usuarioLogueado', 'admin', { maxAge: 300000, httpOnly: true });
        res.send('<h1>¡Login exitoso!</h1><p>Se ha guardado una cookie de seguridad.</p><a href="/perfil">Ir a mi perfil</a>');
    } else {
        res.status(401).send('<h1>Error</h1><p>Usuario o contraseña incorrectos.</p>');
    }
});

app.get('/perfil', (req, res) => {
    const usuario = req.cookies.usuarioLogueado;

    if (usuario) {
        res.send(`<h1>Bienvenido a tu panel de control, ${usuario}</h1>`);
    } else {
        res.status(403).send('<h1>Acceso Denegado</h1><p>Debes iniciar sesión primero.</p>');
    }
});

app.post('/registrar-idea', (req, res) => {
    const { nombre, departamento, idea } = req.body;

    if (departamento === 'Informática' && idea.length < 20) {
        return res.status(400).send('<h1>Error</h1><p>Las propuestas técnicas requieren más detalle.</p>');
    }

    res.cookie('tokenSesion', 'ST-777', { maxAge: 600000, httpOnly: true });
    res.send(`<h1>¡Excelente trabajo, ${nombre}!</h1><p>Tu idea para ${departamento} ha sido capturada.</p>`);
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
