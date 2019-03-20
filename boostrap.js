const fs = require("fs");
const { Pool, Client } = require('pg')

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'postgres',
  // password: 'secretpassword',
  port: 5432,
})

const readGeoJson = function() {
  console.log("Reading file");
  var content = fs.readFileSync("./countries.geojson", "utf8");
  console.log("Parsing to json");
  var countriesJson = JSON.parse(content);
  return countriesJson;
};

const getDataFromRow = function(row) {
  var name = row.properties.name;
  var type = (row.geometry.type == "Polygon")? 0 :1;
  var geometry = JSON.stringify(row.geometry);
  return { name, type, geometry };
};

function getQuery(data){
  var query = `insert into world.country ("geom_${(data.type == 0)? 'pol' : 'mul'}", "name", "type") values (ST_geomFromGeoJSON($1), $2, $3) returning *`
  return query 
}

async function insertCountry(data) {
  var sql = getQuery(data);
  var params =  [data.geometry, data.name, data.type]
  // console.log(sql, params)
  const res = await pool.query(sql,params)
}

exports.start = async function() {
  var countries = readGeoJson();
  for (let index = 0; index < countries.features.length; index++) {
    console.log('\nInserting:', index+1 )
    var data = getDataFromRow(countries.features[index]);
    await insertCountry(data);
  }
  await pool.end()
};
