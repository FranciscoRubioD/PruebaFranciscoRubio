const express = require('express');
const app = express();
const port = 5500;


app.get('/suma',(req,res) =>{
  const x = parseFloat(req.query.x);
  const y = parseFloat(req.query.y);

  const sumaResultado = x+y;
  res.json({ sumaResultado });
});

app.get('/resta',(req,res)=>{
  const x = parseFloat(req.query.x);
  const y = parseFloat(req.query.y);

  const restaResultado = x-y;
  res.json({ restaResultado });
})

app.get('/multiplicacion',(req,res)=>{
  const x = parseFloat(req.query.x);
  const y = parseFloat(req.query.y);

  const multiplicacionResultado = x*y;
  res.json({ multiplicacionResultado });
})

app.get('/division',(req,res)=>{
  const {x,y} = req.query;
  const divisionResultado = parseFloat(x)/parseFloat(y);
  res.json({divisionResultado});
})

app.listen(port,()=>{
  console.log(`Listening on: http://localhost:${port}`)
})