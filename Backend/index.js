// const express = require('express')
// const app = express()
const port = process.env.PORT || 3000


require('dotenv').config();
const { createClient } = require('@libsql/client');
const client = createClient({
   tursoUrl : process.env.TURSO_URL,
   tursoToken : process.env.TURSO_TOKEN
});


app.post('/users', async (req, res) => {
  const campos = Object.keys(req.body); 
  const valores = Object.values(req.body);

  const placeholders = campos.map((_, i) => `$${i + 1}`).join(', ');
  try {
    const resultado = await cliente.execute(
      `INSERT INTO users (${campos.join(', ')}) VALUES (${placeholders}) RETURNING *`,
      valores
    );
    res.json({ mensaje: 'Usuario creado', user: resultado });
  } catch (error) {
    console.error('Error al crear un usuario', error);
    res.status(500).json({ mensaje: 'Error al crear usuario', error: error.message });
  }
});

app.delete('/users/:id', async (req, res) => {
  try{
    const resultado = await cliente.excute(
      `DELETE FROM users WHERE category_id = $1 RETURNING`,
      [category_id]
    );
    res.json({mensaje:`Usuario Eliminado`, user: resultado});
  }
  catch(error){
    console.error("Error al eliminar un usuario", error);
    res.status.json({mensaje:'Usuario no encontrado', error: error.message});
  }
});

app.get('/users/', async (req, res) => {
  try {
    const resultado = await cliente.execute(`SELECT * FROM users`);
    res.json({mensaje: `Usuarios encontrados`, users: resultado});
  } catch (error) {
    console.error("Error al obtener usuarios", error);
    res.status(500).json({mensaje: 'Error al obtener usuarios', error: error.message});
  }
});

app.patch('/users/:id', async (req, res) => {
  const campos = Object.keys(req.body);
  const valores = Object.values(req.body); 

  const actualizaciones = campos.map((campo, i) => `${campo} = $${i + 1}`).join(', '); 

  try {
    const resultado = await cliente.execute(
      `UPDATE users SET ${actualizaciones} WHERE id = $${campos.length + 1} RETURNING *`,
      [...valores, req.params.id] 
    );
    res.json({ mensaje: 'Usuario actualizado', user: resultado });
  } catch (error) {
    console.error('Error al actualizar un usuario', error);
    res.status(500).json({ mensaje: 'Error al actualizar usuario', error: error.message });
  }
});



app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}`)
})
