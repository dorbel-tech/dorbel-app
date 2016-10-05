var koa = require('koa');
var mysql = require('koa-mysql');
var app = module.exports = koa();

// Create a MySQL connection pool (do this once) 
var db = mysql.createPool({ 
  host: process.env.DB_HOST || 'localhost',
  // database: process.env.DB_NAME || 'dorbel',
  user: process.env.DB_USER || 'dorbel', 
  password: process.env.DB_PASSWORD || 'dorbel'
});

app.use(function *(){
   try {
        // Execute a sample query (with params) 
        var rows = yield db.query("select ? + ? as test", [1, 2]);
 
        // Output test result (3) 
        this.body = { test: rows[0].test };
    }
    catch (err) {
        // 500 Internal Server Error 
        this.status = 500;
        this.body = { error: err };
    }
});

if (!module.parent) app.listen(process.env.PORT || 3000);
