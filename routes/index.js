var express = require('express');
const fs = require('fs')
const path = require('path')
var router = express.Router();

var Pool=require('../db')

const tags=[{id:1,desc:'habla juez',tiempo:10},{id:2,desc:'habla juez',tiempo:20},{id:3,desc:'habla fiscal',tiempo:30},{id:4,desc:'habla defensor',tiempo:40},{id:5,desc:'habla testigo',tiempo:50}]
const videos=[  {id:1,video:'Indagatoria',comentario:'nada',path:'video1'},
                {id:2,video:'Testimonial',comentario:'nada',path:'video2'},
                {id:3,video:'prueba1',comentario:'nada',path:'video3'},
                {id:4,video:'defensa',comentario:'nada',path:'video4'},
                {id:5,video:'basura',comentario:'nada',path:'video5'} ]


/* GET home page. */
router.get('/', function(req, res, next) {
    if (req.session.user){
     
        Pool.query('SELECT * from expedientesxusuario a,expediente b where a.usuario_id=? and a.expediente_id=b.id ', [req.session.userid], (err, rows) => {
            if (err) {
                console.log(err)
                console.log('errror................')
                return
            }   
                res.render('index', { title: 'Express', user: req.session.user, rol: req.session.rol, rows: rows });
        })  
    }
    else res.redirect('/users/login')
});


router.get('/video', function(req, res, next) {
    if (req.session.user)
        res.render('video', { title: 'Express', user: req.session.user, rol: req.session.rol, tags:tags, videos:videos });
    else res.redirect('/users/login')
});

//-----------------ABM EXPEDIENTES
router.get('/mantenimiento', function(req, res, next) {
    if (req.session.user){
        var expte='%'
        if(req.query.buscar)
             expte='%'+req.query.buscar+'%'
       console.log(expte)         
        
        Pool.query('SELECT * from expediente b where  expediente like ?', [expte], (err, rows) => {
            if (err) {
                console.log(err)
                console.log('errror................')
                return
            }   
                res.render('mantenimiento', { title: 'Express', user: req.session.user, rol: req.session.rol, rows: rows });
        })  
    }
    else res.redirect('/users/login')
});



router.get('/modifyexpediente', function(req, res, next) {
    if (req.session.user){
            var dato={id:0,
                expediente:'',
                caratula:'',
                nota:''
            }
            if(req.query.id){

                Pool.query('SELECT * from expediente  where  id = ?', [req.query.id], (err, rows) => {
                    if (err) console.log(err)
                    console.log(rows)
                    res.render('modifyexpediente', { title: 'Express', user: req.session.user, rol: req.session.rol, dato: rows[0] ,boton:'Modificar'});
                })                
            }else
            res.render('modifyexpediente', { title: 'Express', user: req.session.user,  dato: dato, boton:'Crear' });
    }
    else res.redirect('/users/login')
});

router.post ('/modifyexpediente', function(req, res, next) {
    if (req.session.user){            
        const dato = req.body;
            if(req.body.id==0){
                Pool.query('insert into expediente set  ?', [dato], (err, rows) => {
                    if (err) throw (err)
                    if(rows.affectedRows===1)       res.redirect('mantenimiento')
                })                
            }else{
                Pool.query('update expediente set  ? where id=?', [dato,req.body.id], (err, rows) => {
                    if (err) throw (err)
                    if(rows.affectedRows===1)       res.redirect('mantenimiento')
                })
            }           
    }
    else res.redirect('/users/login')
});


router.get('/delexpediente', function (req, res, next) {
    if (req.session.user) {
        const dato = parseInt( req.query.id)
        Pool.query('delete from expediente where id=?', [dato], (err, rows) => {
            if (err) throw (err)

             res.redirect('mantenimiento')
            

        })
    }
    else res.redirect('/users/login')
});

//-----------------ABM VIDEOS
router.get('/abmvideo', function(req, res, next) {
    if (req.session.user){            
        
        Pool.query('SELECT * from  video b where  expediente = ?', [req.query.id], (err, rows) => {
            if (err)  console.log(err)

                res.render('abmvideo', { title: 'Express', user: req.session.user, rol: req.session.rol, rows: rows });
        })  
    }
    else res.redirect('/users/login')
});

router.get('/modifyvideo', function(req, res, next) {
    if (req.session.user){
            var dato={id:0,
                expediente:'',
                caratula:'',
                nota:''
            }
            if(req.query.id){

                Pool.query('SELECT * from expediente  where  id = ?', [req.query.id], (err, rows) => {
                    if (err) console.log(err)
                    console.log(rows)
                    res.render('modifyexpediente', { title: 'Express', user: req.session.user, rol: req.session.rol, dato: rows[0] ,boton:'Modificar'});
                })                
            }else
            res.render('modifyexpediente', { title: 'Express', user: req.session.user,  dato: dato, boton:'Crear' });
    }
    else res.redirect('/users/login')
});



/*
router.get('/videos', function(req, res, next) {
    if (req.session.user)
        res.render('videos', { title: 'Express', user: req.session.user, rol: req.session.rol });
    else res.redirect('/users/login')
});
*/

router.get('/videoserver', function(req, res, next) {
    
    video=req.query.video
    
    const path = 'D:/VideosNodejs/'+video+'.mp4'
    console.log(path)

    const stat = fs.statSync(path)
    const fileSize = stat.size
    const range = req.headers.range
    if (range) {
        const parts = range.replace(/bytes=/, "").split("-")
        const start = parseInt(parts[0], 10)
        const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1
        const chunksize = (end - start) + 1
        const file = fs.createReadStream(path, { start, end })
        const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': 'video/mp4',
        }

        res.writeHead(206, head)
        file.pipe(res)
    } else {
        const head = {
            'Content-Length': fileSize,
            'Content-Type': 'video/mp4',
        }
        res.writeHead(200, head)
        fs.createReadStream(path).pipe(res)
    }
})


router.get('/prueba',(req,res)=>{    res.render('prueba')  })


module.exports = router;