var express = require('express');
var app = express();
var globalres;
app.use('/static', express.static(__dirname + '/static'));
app.get('/',function(req,res){
	res.redirect("/static/index.html");
});

app.get('/json_filmlist', function(req, res){
	globalres = res;
	var minScore = req.param("score");
	var category = req.param("category");
	var pagesize = req.param("pagesize");
	var pagenumber = req.param("npage");
 	SearchFilmList(minScore, category, pagesize, pagenumber);
});


var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});

var sqlite3 = require('sqlite3').verbose();;  
var totalcount = 0;
function SearchFilmList(s,c,p,n){
	if(s==null || typeof(s) == undefined){
		s=0;
	}
	var where = " where filmid in (select filmid from filmlist group by title)";
	if(c && c.length > 0){
		where = " where filmid in (select filmid from filmlist where category='"+c+"' group by title)";
		where+=" and (category='"+c+"') "
	}
	where += " and (imdbscore > "+ s + ")";
	var nStart = (n-1) * p;
 
	getCount(where, nStart,p);
}
function getCount(where, nstart,page){
	var db = new sqlite3.Database(getDBName());
	db.serialize(function() {
    	db.get("select count(filmid) as ncount from filmlist "+where, function(err2,res2){
    		if(!err2){
    			totalcount = res2.ncount;
    			getFilmlist(where,nstart,page);
    		}
    		else{
    			globalres.send(err2);  
    		}
    	});
	});
	db.close();
}
function getFilmlist(where,nstart,page){
	var sql = "select filmid, title, category,pagelink,imdbscore,screen,format from filmlist ";
	sql += where;
	sql += " order by imdbscore desc limit "+nstart+","+page
	var db = new sqlite3.Database(getDBName());
	db.serialize(function() {
		db.all(sql, function(err,res){  
        if(!err){
        	var newjason = {"total":totalcount,"list":res};
    		globalres.send(JSON.stringify(newjason));   
        }
        else  
          	globalres.send(err + sql);  
  		});
  	});
  	db.close();
}
function getDBName(){
	return 'data/filmdb.db';
}
