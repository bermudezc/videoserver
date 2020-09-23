var express = require('express');
var router = express.Router();

var Pool=require('../db')


/* GET users listing. */
router.get('/login', function (req, res, next) {
    res.render('login');
});

router.get('/destroy', (req, res) => {
    req.session.destroy()
    res.redirect('login')
})

router.post('/login',  (req, res) => {

    const user = req.body.user
    const pass = req.body.pass

    

   Pool.query('SELECT * from user where user=? and pass=?', [user, pass], (err, rows) => {
        if (err) {
            console.log(err)
            console.log('errror................')
            return
        }

       
        
            if (rows.length > 0) {
                req.session.user = rows[0].user
                req.session.rol = rows[0].rol
                req.session.userid =  rows[0].id      
                res.redirect('/')
            } else
                res.render('login', { error: 'Usuario invalido.' });
        
        
    });

    


})

router.get('/admin', (req, res) => {
    if (req.session.rol == 1) res.redirect('login')
    Pool.query('SELECT * from user ', (err, rows) => {
        if (err) throw (err)

        res.render('admin', { rows: rows, user: req.session.user, rol: req.session.rol })

    })
})

router.get('/nuevo', function (req, res, next) {
    if (req.session.user)
        res.render('nuevoUser', { title: 'Express', user: req.session.user, rol: req.session.rol });
    else res.redirect('/users/login')
});

router.post('/nuevo', function (req, res, next) {
    if (req.session.user) {

        const dato = req.body;
        Pool.query('insert into user set  ?', [dato], (err, rows) => {
            if (err) throw (err)

            if(rows.affectedRows===1)       res.redirect('admin')
            else     res.render('nuevoUser', { title: 'VideoStream',error:'error reintente' , user: req.session.user, rol: req.session.rol })

        })
    }
    else res.redirect('/users/login')
});

router.get('/delete', function (req, res, next) {
    if (req.session.user) {
        const dato = parseInt( req.query.id)
        Pool.query('delete from user where id=?', [dato], (err, rows) => {
            if (err) throw (err)

             res.redirect('admin')
            

        })
    }
    else res.redirect('/users/login')
});

router.get('/modify', function (req, res, next) {
    if (req.session.user) {
        const dato = parseInt( req.query.id)
        Pool.query('select * from user where id=?', [dato], (err, rows) => {
            if (err) throw (err)

             console.log(rows)
            res.render('modifyUser',{rows:rows[0]})
            

        })
    }
    else res.redirect('/users/login')
});

router.post('/modify', function (req, res, next) {
    if (req.session.user) {

        const id=parseInt(req.body.id)
        const dato = req.body;
        Pool.query('update user set ? where id = ?', [dato,id], (err, rows) => {
            if (err) throw (err)
            console.log(rows)    
            if(rows.affectedRows===1)       res.redirect('admin')
            else     res.render('nuevoUser', { title: 'VideoStream',error:'error reintente' , user: req.session.user, rol: req.session.rol })

        })
    }
    else res.redirect('/users/login')
});


module.exports = router;