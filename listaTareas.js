const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const app = express();
const port = 5500;

app.use(bodyParser.json());

const dbConexion = mysql.createConnection({
  host:'localhost',
  user:'root',
  password:'',
  database:'tareas'
})

dbConexion.connect((error)=>{
  if(error){
    console.error('Error conectado a base de datos: '+ error.message);
  }else{
    console.log('Conectado a la base de datos');
  }

  // crear tabla Tareas
  const createTable = `CREATE TABLE IF NOT EXISTS tareas(
    id INT AUTO_INCREMENT PRIMARY KEY,
    Titulo VARCHAR(255) NOT NULL,
    Descripcion TEXT
  )`;

  dbConexion.query(createTable,(error)=>{
    if(error){
      console.error('No se pudo crear la tabla: '+ error.message);
    }else{
      console.log('Se ha creado la tabla');
    }
  })

})



app.get('/',(req,res)=>{
  const query = 'SELECT * FROM tareas';

  dbConexion.query(query,(error,result)=>{
    if(error){
      console.error('No se ha podido traer las tareas: '+error.message);
      res.status(500).json({message:'Error al traer datos'});
    } else{
      if(result.length === 0){
        res.json({ mesagge: 'Aun no se han agregado tareas nuevas' });
      }else{
        res.json({ tareas: result });
      }
    }
  })
})

app.post('/crear/tarea',(req,res)=>{
  const {titulo, descripcion} = req.body;
  const values = [titulo,descripcion];

  if(!titulo || !descripcion){
    return res.status(400).json({ message : 'Informacion incompleta'});
  }
  
  const query = `INSERT INTO tareas (titulo,descripcion) VALUES(?, ?)`;
    
  dbConexion.query(query,values,(error,result)=>{
    if(error){
      console.error('Error al enviar tarea: '+error.message);
      return res.status(500).json({ message: 'Error al enviar tarea' });
    }else{
      res.json({message : 'La tarea se ha agregado a la lista de tareas!'});
    }
  }) 
})


app.put('/actualizar/tarea/:id',(req,res)=>{
  const id = req.params.id;
  const { titulo,descripcion } = req.body;
  const values =  [titulo,descripcion,id]

  if(!titulo,!descripcion){
    return res.status(400).json({ message : 'Informacion incompleta'});
  }

  const query = 'UPDATE tareas SET titulo = ?, descripcion = ? WHERE id = ?';

  dbConexion.query(query,values,(error,result)=>{
    if(error){
      console.error('Error al actualizar tarea: '+ error.message);
      return res.status(500).json({ message: 'Error al actualizar tarea' });
    }else if(result.affectedRows === 0){
      return res.status(404).json({ message: 'No existe la tarea' });
    }

    res.json({message: 'Se ha actualizado la tarea!'});
  })

})


app.delete('/eliminar/tarea/:id',(req,res)=>{
  const id = req.params.id;
  const value  =[id];
  
  const query = 'DELETE FROM tareas WHERE id = ?';

  dbConexion.query(query,value,(error,result)=>{
    if(error){
      console.error('Error al eliminar tarea: '+ error.message);
      return res.status(500).json({ message: 'Error al eliminar tarea' });
    }else if(result.affectedRows === 0){
      return res.status(404).json({ message: 'No existe la tarea a eliminar' });
    }

    res.json({ message:'Se ha eliminado la tarea.' });

  })
  
})

app.listen(port,()=>{
  console.log(`Listening on: http://localhost:${port}`)
})