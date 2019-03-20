const fs = require("fs");
const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  // password: 'secretpassword',
  port: 5432
});

exports.searchCountry = async function(lat, lon) {
  console.log(`Searchin ${lat}, ${lon}`);
  var sql = "SELECT id,name ";
  sql += "FROM world.country ";
  sql +=
    " where st_covers(geom_mul, ST_GeomFromText($1,4326))  or st_covers(geom_pol, ST_GeomFromText($1,4326)) ";
  try {
    var res = await pool.query(sql, [`POINT(${lon} ${lat})`]); //lat and lon go in reverse order
  } catch (error) {
    console.log("Error en parametros");
    var res = {
      rowCount: 0,
      rows: [{ name: "" }]
    };
  }

  return {
    results: res.rowCount,
    country: res.rowCount > 0 ? res.rows[0].name : ""
  };
};
