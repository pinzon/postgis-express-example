const fs = require("fs");
const { Pool, Client } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  // password: 'secretpassword',
  port: 5432
});

const readGeoJson = function() {
  console.log("Reading file");
  var content = fs.readFileSync("./docs/qroo.geojson", "utf8");
  console.log("Parsing to json");
  var countriesJson = JSON.parse(content);
  return countriesJson;
};

const getDataFromRow = function(row) {
  var ent = parseInt(row.properties.CVE_ENT);
  var loc = parseInt(row.properties.CVE_LOC);
  var mun = parseInt(row.properties.CVE_MUN);
  var ageb = row.properties.CVE_AGEB;
  var ageb_complete =
    row.properties.CVE_ENT +
    row.properties.CVE_MUN +
    row.properties.CVE_LOC +
    row.properties.CVE_AGEB;
  var geom = row.geometry;
  return { ent, loc, mun, ageb, ageb_complete, geom };
};

function getQuery() {
  // var query = `insert into world.country ("geom", "name", "type") values (ST_geomFromGeoJSON($1), $2, $3) returning *`;
  var query = "INSERT INTO world.ageb (ent, loc, mun, ageb, ageb_complete, geom) VALUES($1, $2, $3, $4, $5, ST_geomFromGeoJSON($6));"
  return query;
}

async function insertCountry(data) {
  var sql = getQuery();
  var params = [data.ent, data.loc, data.mun, data.ageb, data.ageb_complete, data.geom];
  const res = await pool.query(sql, params);
}

exports.start = async function() {
  var countries = readGeoJson();
  for (let index = 0; index < countries.features.length; index++) {
    console.log("\nInserting:", index + 1);
    var data = getDataFromRow(countries.features[index]);
    await insertCountry(data);
  }
  await pool.end();
};
