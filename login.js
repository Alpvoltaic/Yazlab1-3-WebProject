const mysql = require('mysql')

const express = require('express')
const exphbs = require('express-handlebars')
const bodyParser = require('body-parser')
require('dotenv').config()

const encoder = bodyParser.urlencoded()
const app = express()
const port = process.env.PORT || 5000
app.listen(port)
const adminun = 'admin123'
const adminps = '123admin'
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static('public'))
app.engine('hbs', exphbs.engine({ extname: 'hbs' }))
app.set('view engine', 'hbs')

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'BloodyHell58',
  database: 'yazlab1proje3',
  multipleStatements: true,
})
connection.connect(function (error) {
  if (error) throw error
  else console.log('Bağlandı')
})

//ROUTERLAR
app.get('/kayit', function (req, res) {
  //kayıt linki
  res.sendFile(__dirname + '/kayit.html')
})
app.post('/kayit', function (req, res) {
  //kayıt sayfasına geçme
  res.redirect('/kayit')
})

app.get('/kayit.html', function (req, res) {
  //kayıt linki
  res.sendFile(__dirname + '/kayit.html')
})
app.post('/kayit.html', encoder, function (req, res) {
  //kayıt işlemi
  var username = req.body.username
  var password = req.body.password
  var passwordagain = req.body.passwordagain
  if (password == passwordagain) {
    connection.query(
      'INSERT INTO kullanicilar SET kullaniciAd = ?, kullaniciSifre = ?',
      [username, password],
      function (error) {
        if (error) throw error
        console.log('Kayıt Yapıldı')
      },
    )
    res.redirect('/')
  } else {
    console.log('Lütfen aynı şifreyi tekrar giriniz!')
    res.redirect('/kayit')
  }
})

app.get('/', function (req, res) {
  //başlangıç
  res.sendFile(__dirname + '/index.html')
})

app.post('/', encoder, function (req, res) {
  //login işlemi
  var username = req.body.username
  var password = req.body.password
  connection.query(
    'SELECT kullaniciId FROM kullanicilar where kullaniciAd = ? AND kullaniciSifre = ?',
    [username, password],
    function (error, results, fields) {
        
        
      if (username == adminun && password == adminps) {
        console.log('Admin girişi yapıldı.')
        app.set('view options', { layout: 'main' })
        res.redirect('/home')
      } else if (
        results.length > 0 &&
        username != adminun &&
        password != adminps
      ) {
        kullanId = results[0].kullaniciId;
        app.locals.id = kullanId;
        console.log('Giriş yapıldı.')
        res.redirect('/userhome/'+kullanId+'');
      } else {
        console.log('Kullanici adi veya şifre lazım')
        res.redirect("/");
      }
    },
  )
})
app.get('/userhome/:kullaniciId', function (req, res) {
    //Kullanıcı panele giriş
     connection.query(
            'SELECT projeId, ogrenciAd, ogrenciSoyad, ogrenciNo, ogretimTur, dersAd, ozet,donem,baslik,anahtar,danisman,juri FROM projeler WHERE kullaniciId = ? ',[req.params.kullaniciId],
            function (error, results) {
              if (!error) {
                res.render('userhome',{layout: 'user',project: results});
              } else {
                console.log(error)
              }
            },
          ) 
  })

  app.post('/userhome/:kullaniciId', function (req, res) {//sorgu 1 kullanıcı
    let aranan = req.body.search;
    let seçilen = req.body.tag;
    if(seçilen == "Yazar" ){
        connection.query(
            'SELECT projeId, ogrenciAd, ogrenciSoyad, ogrenciNo, ogretimTur, dersAd, ozet,donem,baslik,anahtar,danisman,juri FROM projeler WHERE ogrenciAd LIKE ? and kullaniciId = ?',["%"+aranan+"%",req.params.kullaniciId],
            function (error, results) {
              if (!error) {
                res.render('userhome', {layout: 'user', project: results })
              } else {
                console.log(error)
              }
            },
          )
    }else if (seçilen == "Ders Adı" ){
        connection.query(
            'SELECT projeId, ogrenciAd, ogrenciSoyad, ogrenciNo, ogretimTur, dersAd, ozet,donem,baslik,anahtar,danisman,juri FROM projeler WHERE dersAd LIKE ? and kullaniciId = ?',["%"+aranan+"%",req.params.kullaniciId],
            function (error, results) {
              if (!error) {
                res.render('userhome', {layout: 'user', project: results })
              } else {
                console.log(error)
              }
            },
          )
    }else if (seçilen == "Başlık" ){
        connection.query(
            'SELECT projeId, ogrenciAd, ogrenciSoyad, ogrenciNo, ogretimTur, dersAd, ozet,donem,baslik,anahtar,danisman,juri FROM projeler WHERE baslik LIKE ? and kullaniciId = ?',["%"+aranan+"%",req.params.kullaniciId],
            function (error, results) {
              if (!error) {
                res.render('userhome', {layout: 'user', project: results })
              } else {
                console.log(error)
              }
            },
          )
    }else if (seçilen == "Anahtar Kelimeler" ){
        connection.query(
            'SELECT projeId, ogrenciAd, ogrenciSoyad, ogrenciNo, ogretimTur, dersAd, ozet,donem,baslik,anahtar,danisman,juri FROM projeler WHERE anahtar LIKE ? and kullaniciId = ?',["%"+aranan+"%",req.params.kullaniciId],
            function (error, results) {
              if (!error) {
                res.render('userhome', {layout: 'user', project: results })
              } else {
                console.log(error)
              }
            },
          )
    }else if (seçilen == "Dönem" ){
        connection.query(
            'SELECT projeId, ogrenciAd, ogrenciSoyad, ogrenciNo, ogretimTur, dersAd, ozet,donem,baslik,anahtar,danisman,juri FROM projeler WHERE donem LIKE ? and kullaniciId = ?',["%"+aranan+"%",req.params.kullaniciId],
            function (error, results) {
              if (!error) {
                res.render('userhome', {layout: 'user', project: results })
              } else {
                console.log(error)
              }
            },
          )
    }
    
  })

  app.get('/userhome2/:kullaniciId', function (req, res) {
    //Kullanıcı panele giriş
     connection.query(
            'SELECT projeId, ogrenciAd, ogrenciSoyad, ogrenciNo, ogretimTur, dersAd, ozet,donem,baslik,anahtar,danisman,juri FROM projeler WHERE kullaniciId = ? ',[req.params.kullaniciId],
            function (error, results) {
              if (!error) {
                res.render('userhome',{layout: 'user',project: results});
              } else {
                console.log(error)
              }
            },
          ) 
  })

  app.post('/userhome2/:kullaniciId', function (req, res) {//sorgu 2 kullanıcı
    
    let donem = req.body.dönem;
    let dersAd = req.body.ders;
    
        connection.query(
            'SELECT projeId, ogrenciAd, ogrenciSoyad, ogrenciNo, ogretimTur, dersAd, ozet,donem,baslik,anahtar,danisman,juri FROM projeler  WHERE donem LIKE ? AND dersAd LIKE ? AND kullaniciId = ?',["%"+donem+"%","%"+dersAd+"%",req.params.kullaniciId],
            function (error, results) {
              if (!error) {
                res.render('userhome',{layout: 'user',project: results});
              } else {
                console.log(error)
              }
            },
          )
    
    
  })


app.get('/home', function (req, res) {
  //Admin panele giriş
  connection.query(
    'SELECT * FROM kullanicilar; SELECT projeler.projeId, kullanicilar.kullaniciAd, projeler.ogrenciAd, projeler.ogrenciSoyad, projeler.ogrenciNo, projeler.ogretimTur, projeler.dersAd, projeler.ozet,projeler.donem,projeler.baslik,projeler.anahtar,projeler.danisman,projeler.juri FROM projeler JOIN kullanicilar ON (projeler.kullaniciId = kullanicilar.kullaniciId)  ',
    function (error, results) {
      if (!error) {
        res.render('home', { user: results[0], project: results[1] })
      } else {
        console.log(error)
      }
    },
  )
})


app.get('/adduser', function (req, res) {
  //kullanıcı eklemeye giriş
  res.render('adduser')
})

app.post('/adduser', encoder, function (req, res) {
  //kullanıcı ekle
  var username = req.body.kullaniciAd
  var password = req.body.kullaniciSifre
  connection.query(
    'INSERT INTO kullanicilar SET kullaniciAd = ?, kullaniciSifre = ?',
    [username, password],
    function (error) {
      if (error) throw error
      else {
        console.log('Kayıt Yapıldı')
        res.render('adduser')
      }
    },
  )
})

app.get('/edituser/:kullaniciId', function (req, res) {
  //kullanıcı güncellemeye giriş
  connection.query(
    'SELECT * FROM kullanicilar where kullaniciId = ?',
    [req.params.kullaniciId],
    function (error, results) {
      if (!error) {
        res.render('edituser', { results })
      } else {
        console.log(error)
      }
    },
  )
})

app.post('/edituser/:kullaniciId', encoder, function (req, res) {
  //kullanıcı güncelle
  var username = req.body.kullaniciAd
  var password = req.body.kullaniciSifre
  connection.query(
    'UPDATE kullanicilar SET kullaniciAd = ?, kullaniciSifre = ? WHERE kullaniciId = ?',
    [username, password, req.params.kullaniciId],
    function (error) {
      if (error) throw error
      else {
        connection.query(
          'SELECT * FROM kullanicilar where kullaniciId = ?',
          [req.params.kullaniciId],
          function (error, results) {
            if (!error) {
              res.render('edituser', { results })
            } else {
              console.log(error)
            }
          },
        )
        console.log('Kullanıcı Güncellendi')
      }
    },
  )
})

app.get('/:kullaniciId', function (req, res) {
  //kullanıcı sil
  connection.query(
    'DELETE FROM kullanicilar where kullaniciId = ?',
    [req.params.kullaniciId],
    function (error, results) {
      if (!error) {
        res.redirect('home')
      } else {
        console.log(error)
      }
    },
  )
})

app.post('/home', function (req, res) {//sorgu 1 admin
    let aranan = req.body.search;
    let seçilen = req.body.tag;
    if(seçilen == "Yazar" ){
        connection.query(
            'SELECT * FROM kullanicilar; SELECT projeler.projeId, kullanicilar.kullaniciAd, projeler.ogrenciAd, projeler.ogrenciSoyad, projeler.ogrenciNo, projeler.ogretimTur, projeler.dersAd, projeler.ozet,projeler.donem,projeler.baslik,projeler.anahtar,projeler.danisman,projeler.juri FROM projeler JOIN kullanicilar ON (projeler.kullaniciId = kullanicilar.kullaniciId) WHERE ogrenciAd LIKE ?',["%"+aranan+"%"],
            function (error, results) {
              if (!error) {
                res.render('home', { user: results[0], project: results[1] })
              } else {
                console.log(error)
              }
            },
          )
    }else if (seçilen == "Ders Adı" ){
        connection.query(
            'SELECT * FROM kullanicilar; SELECT projeler.projeId, kullanicilar.kullaniciAd, projeler.ogrenciAd, projeler.ogrenciSoyad, projeler.ogrenciNo, projeler.ogretimTur, projeler.dersAd, projeler.ozet,projeler.donem,projeler.baslik,projeler.anahtar,projeler.danisman,projeler.juri FROM projeler JOIN kullanicilar ON (projeler.kullaniciId = kullanicilar.kullaniciId) WHERE dersAd LIKE ?',["%"+aranan+"%"],
            function (error, results) {
              if (!error) {
                res.render('home', { user: results[0], project: results[1] })
              } else {
                console.log(error)
              }
            },
          )
    }else if (seçilen == "Başlık" ){
        connection.query(
            'SELECT * FROM kullanicilar; SELECT projeler.projeId, kullanicilar.kullaniciAd, projeler.ogrenciAd, projeler.ogrenciSoyad, projeler.ogrenciNo, projeler.ogretimTur, projeler.dersAd, projeler.ozet,projeler.donem,projeler.baslik,projeler.anahtar,projeler.danisman,projeler.juri FROM projeler JOIN kullanicilar ON (projeler.kullaniciId = kullanicilar.kullaniciId) WHERE baslik LIKE ?',["%"+aranan+"%"],
            function (error, results) {
              if (!error) {
                res.render('home', { user: results[0], project: results[1] })
              } else {
                console.log(error)
              }
            },
          )
    }else if (seçilen == "Anahtar Kelimeler" ){
        connection.query(
            'SELECT * FROM kullanicilar; SELECT projeler.projeId, kullanicilar.kullaniciAd, projeler.ogrenciAd, projeler.ogrenciSoyad, projeler.ogrenciNo, projeler.ogretimTur, projeler.dersAd, projeler.ozet,projeler.donem,projeler.baslik,projeler.anahtar,projeler.danisman,projeler.juri FROM projeler JOIN kullanicilar ON (projeler.kullaniciId = kullanicilar.kullaniciId) WHERE anahtar LIKE ?',["%"+aranan+"%"],
            function (error, results) {
              if (!error) {
                res.render('home', { user: results[0], project: results[1] })
              } else {
                console.log(error)
              }
            },
          )
    }else if (seçilen == "Dönem" ){
        connection.query(
            'SELECT * FROM kullanicilar; SELECT projeler.projeId, kullanicilar.kullaniciAd, projeler.ogrenciAd, projeler.ogrenciSoyad, projeler.ogrenciNo, projeler.ogretimTur, projeler.dersAd, projeler.ozet,projeler.donem,projeler.baslik,projeler.anahtar,projeler.danisman,projeler.juri FROM projeler JOIN kullanicilar ON (projeler.kullaniciId = kullanicilar.kullaniciId) WHERE donem LIKE ?',["%"+aranan+"%"],
            function (error, results) {
              if (!error) {
                res.render('home', { user: results[0], project: results[1] })
              } else {
                console.log(error)
              }
            },
          )
    }
    
  })

  app.get('/home2', function (req, res) {
    //panele giriş
    connection.query(
      'SELECT * FROM kullanicilar; SELECT projeler.projeId, kullanicilar.kullaniciAd, projeler.ogrenciAd, projeler.ogrenciSoyad, projeler.ogrenciNo, projeler.ogretimTur, projeler.dersAd, projeler.ozet,projeler.donem,projeler.baslik,projeler.anahtar,projeler.danisman,projeler.juri FROM projeler JOIN kullanicilar ON (projeler.kullaniciId = kullanicilar.kullaniciId)  ',
      function (error, results) {
        if (!error) {
          res.render('home', { user: results[0], project: results[1] })
        } else {
          console.log(error)
        }
      },
    )
  })

  app.post('/home2', function (req, res) {//sorgu 2 admin
    let kullaniciAd = req.body.kullanıcı;
    let donem = req.body.dönem;
    let dersAd = req.body.ders;
    
        connection.query(
            'SELECT * FROM kullanicilar; SELECT projeler.projeId, kullanicilar.kullaniciAd, projeler.ogrenciAd, projeler.ogrenciSoyad, projeler.ogrenciNo, projeler.ogretimTur, projeler.dersAd, projeler.ozet,projeler.donem,projeler.baslik,projeler.anahtar,projeler.danisman,projeler.juri FROM projeler JOIN kullanicilar ON (projeler.kullaniciId = kullanicilar.kullaniciId) WHERE kullaniciAd LIKE ? AND donem LIKE ? AND dersAd LIKE ?',["%"+kullaniciAd+"%","%"+donem+"%","%"+dersAd+"%"],
            function (error, results) {
              if (!error) {
                res.render('home', { user: results[0], project: results[1] })
              } else {
                console.log(error)
              }
            },
          )
    
    
  })

//ROUTERLAR BİTİŞ


