require('dotenv').config()
const express = require('express')
const { Pool } = require('pg')
const app = express()
const PORT = process.env.PORT || 3000
const DATABASE_URL = process.env.DATABASE_URL || "UNDEFINED"
const pool = new Pool({connectionString: DATABASE_URL})
const Transformer = require('./transformer')

const STATIONS = require('./stations')

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/rides/count', (request, response) => {
  const SQL = "SELECT COUNT(*) FROM rides;"
  pool.query(SQL, (err, results) => response.send(results.rows[0]))
})

app.get('/rides/count/by_month', (request, response) => {
  const SQL =
    `SELECT extract(month from start_time) as month,
     extract(year from start_time) as year,
     COUNT(*) as count
     FROM rides
     GROUP BY year, month
     ORDER BY year, month;`
  pool.query(SQL, (err, results) => {
    response.send(Transformer.count_by_year_and_month(results.rows))
  })
})

app.get('/rides/count/by_hour', (request, response) => {
  const SQL =
    `SELECT date_part('hour', start_time) as hour, COUNT(*) as count
     FROM rides
     GROUP BY date_part('hour', start_time)
     ORDER BY hour`
  pool.query(SQL, (err, results) => {
    response.send(Transformer.count_by_hour(results.rows))
  })
})

app.get('/rides/count/:station', (request, response) => {
  if (STATIONS[request.params.station] === undefined) { response.send(404); return }
  const lat_range = STATIONS[request.params.station].latitude_range
  const lon_range = STATIONS[request.params.station].longitude_range
  const SQL =
    `SELECT COUNT(*) FROM rides
     WHERE start_lat > $1 AND start_lat < $2 AND start_lon > $3 AND start_lon < $4`
  pool.query(SQL, [lat_range.min, lat_range.max, lon_range.min, lon_range.max], (err, results) => {
    response.send(results.rows[0])
  })
})

app.get('/rides/count/:station/per_month', (request, response) => {
  if (STATIONS[request.params.station] === undefined) { response.send(404); return }
  const latitude_range = STATIONS[request.params.station].latitude_range
  const longitude_range = STATIONS[request.params.station].longitude_range

  response.send(`TODO ${request.params.station}`)
})

app.get('/rides/count/:station/per_day', (request, response) => {
  if (STATIONS[request.params.station] === undefined) { response.send(404); return }
  const latitude_range = STATIONS[request.params.station].latitude_range
  const longitude_range = STATIONS[request.params.station].longitude_range

  response.send(`TODO ${request.params.station}`)
})

app.get('/zagster', (request, response) => {
  const SQL = "SELECT * FROM rides LIMIT 1;"
  pool.query(SQL, (err, results) => response.send(results.rows[0]))
})

app.get('/', (request, response) => { response.send('I am listening!') })
app.get('/ice_cream', (request,response) => response.send("Mint ice cream"))
app.get('/RKS', (request, response) => response.send("MintBerryCrunch"))
app.get('/HemenwayThanksgiving', (request, response) => response.send("SweetPotato"))
app.get('/Cat_nya', (request,response) => response.send("Nyaaaaaaaaaaaaaaa!"))
app.get('/stubaruu', (request, response) => response.send("stuff"))
app.get('/karp', (request, response) => response.send("Dogs"))
app.get('/NOID', (request, response) => response.send("enter the VOID"))
app.get('/can_I_get_a_hoo_yaa', (request,response) => response.send("hoo yaa"))
app.get('/Hungry', (request, response) => response.send("Eat Food"))
app.get('/wright', (request,response) => response.send("Pasta"))
app.get('/Stewart', (request,response) => response.send("My dogs"))
app.get('/Bertram', (request,response) => response.send("Fire Hue"))
app.get('/kolb', (request,response) => response.send("Nice"))
app.get('/best_town', (request, response) => response.send('Bend, obviously'))
app.get('/football_team', (request,response) => response.send("LA Chargers"))
app.get('/cookie_dough', (request,response) => response.send("rocky road"))
app.get('/YOTE', (request,response) => response.send("YEEEET"))
app.get('/Mock', (request,response) => response.send("Dolla Dolla Bills Y'all"))
app.get('/Orue', (request,response)=>response.send("Comic Books"))
app.get('/mashjam', (request, response)=>response.send("White Buffalo"))
app.get('/gomez', (request, response) => response.send("I am cool"))
app.get('/white', (request, response) => response.send ("Bulldog Puppies"))
app.get('/doodlebob', (request,response) => response.send("Hoy minoy miñoy"))
app.get('/manbearpig', (request, response) => response.send("Al Gore"))
app.get('/totallysecurechanneladminonly', (request,response) => response.send("Look at them."))

app.listen(PORT)
