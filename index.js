const express = require('express')
const db = require('./config/connectdb')
const bodyParser = require('body-parser')
const app = express()
const multer = require('multer');
const xlsx = require('xlsx');
const port = 3000

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");

// set body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.set("view engine", "ejs");


//Materi
app.post('/pmtopik/simpan', (req, res) => {
    const { nama_materi } = req.body
    const sql = `INSERT INTO materi (id_materi, nama_materi) VALUES (NULL, '${nama_materi}')`
    db.query(sql, (error, result) => {
        //res.redirect('/soal')
        res.send({msg:'Materi berhasil ditambahkan'})
    })
})


app.post('/topik/simpan', (req, res) => {
    const { nama_materi } = req.body
    const sql = `INSERT INTO materi (id_materi, nama_materi) VALUES (NULL, '${nama_materi}')`
    db.query(sql, (error, result) => {
        //res.redirect('/soal')
        res.redirect('/soal')
    })
})

app.get('/pmtopik', (req,res) => {
    const{ nama_materi } = req.body
    const sql = `SELECT id_materi, nama_materi FROM materi`
    db.query(sql, (error,result) => {
        //res.redirect('/soal')
        res.send({materi:result})
    })
})

app.put('/pmtopik/:id_materi', (req, res) => {
    const id_materi = req.params.id_materi;
    const { nama_materi } = req.body;
    
    const sql = `UPDATE materi SET nama_materi='${nama_materi}' WHERE id_materi = ${id_materi};`
    
    db.query(sql, (error, result) => {
        if (error) {
            res.status(500).send({ error: "Gagal mengedit data" });
        } else {
            res.send({ msg: 'Materi berhasil diubah' });
        }
    })
})

app.delete('/pmtopik/:id_materi', (req, res) => {
    const id_materi = req.params.id_materi
    const sql = `DELETE FROM materi WHERE id_materi = ${id_materi}`
    db.query(sql, (error, result) => {
        res.send({msg: 'Materi berhasil dihapus!'})
    })
})

//soal
app.get('/pmsoal', (req, res) => {
    const sql1 = `SELECT id_materi, nama_materi FROM materi`
    const sql2 = `SELECT soal_ujian.id_soal_ujian, materi.nama_materi,  soal_ujian.tingkat_kesulitan, soal_ujian.pertanyaan, soal_ujian.pilihan_a,  soal_ujian.pilihan_b,  soal_ujian.pilihan_c,  soal_ujian.pilihan_d,  soal_ujian.pilihan_benar FROM soal_ujian INNER JOIN materi ON soal_ujian.id_materi=materi.id_materi`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {
        //    res.render('soal', {materi:result1, soal_ujian:result2})
           res.send({materi:result1, soal_ujian:result2})
        })
    })
})

app.post('/pmsoal', (req, res) => {
    const { pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, id_materi, tingkat_kesulitan } = req.body
    const sql = `INSERT INTO soal_ujian (id_soal_ujian, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, id_materi, tingkat_kesulitan) VALUES (NULL, '${pertanyaan}', '${pilihan_a}', '${pilihan_b}', '${pilihan_c}', '${pilihan_d}', ${pilihan_benar}, ${id_materi}, ${tingkat_kesulitan})`
    db.query(sql, (error, result) => {
        res.send({msg :'Soal tersimpan'})
    })
    
})


// buat manggil ejs
app.post('/soal/simpan', (req, res) => {
    const { pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, id_materi, tingkat_kesulitan } = req.body
    const sql = `INSERT INTO soal_ujian (id_soal_ujian, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, id_materi, tingkat_kesulitan) VALUES (NULL, '${pertanyaan}', '${pilihan_a}', '${pilihan_b}', '${pilihan_c}', '${pilihan_d}', ${pilihan_benar}, ${id_materi}, ${tingkat_kesulitan})`
    db.query(sql, (error, result) => {
        // res.send({msg :'Soal tersimpan'})
        res.redirect('/soal')
    })
    
})



app.put('/pmsoal/:id_soal_ujian', (req, res) => {
    const id_soal_ujian = req.params.id_soal_ujian;
    const { id_materi, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan } = req.body;

    const sql = `UPDATE soal_ujian SET 
                  id_materi = COALESCE(?, id_materi),
                  pertanyaan = COALESCE(?, pertanyaan),
                  pilihan_a = COALESCE(?, pilihan_a),
                  pilihan_b = COALESCE(?, pilihan_b),
                  pilihan_c = COALESCE(?, pilihan_c),
                  pilihan_d = COALESCE(?, pilihan_d),
                  pilihan_benar = COALESCE(?, pilihan_benar),
                  tingkat_kesulitan = COALESCE(?, tingkat_kesulitan)
                WHERE id_soal_ujian = ?`;

    db.query(sql, [id_materi, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan, id_soal_ujian], (error, result) => {
        if (error) {
            res.status(500).send({ error: "Gagal mengedit data" });
        } else {
            res.send({ msg: 'Soal berhasil diubah' });
        }
    });
});

app.put('/pmsoal/ubah/:id_soal_ujian', (req, res) => {
    const id_soal_ujian = req.params.id_soal_ujian;
    const { id_materi, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan } = req.body;

    const sql = `UPDATE soal_ujian SET 
                  id_materi = COALESCE(?, id_materi),
                  pertanyaan = COALESCE(?, pertanyaan),
                  pilihan_a = COALESCE(?, pilihan_a),
                  pilihan_b = COALESCE(?, pilihan_b),
                  pilihan_c = COALESCE(?, pilihan_c),
                  pilihan_d = COALESCE(?, pilihan_d),
                  pilihan_benar = COALESCE(?, pilihan_benar),
                  tingkat_kesulitan = COALESCE(?, tingkat_kesulitan)
                WHERE id_soal_ujian = ?`;

    db.query(sql, [id_materi, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan, id_soal_ujian], (error, result) => {
        if (error) {
            res.status(500).send({ error: "Gagal mengedit data" });
        } else {
            res.redirect('/soal');
        }
    });
});


app.delete('/pmsoal/:id_soal_ujian', (req, res) => {
    const id_soal_ujian = req.params.id_soal_ujian
    const sql = `DELETE FROM soal_ujian WHERE id_soal_ujian = ${id_soal_ujian}`
    db.query(sql, (error, result) => {
        // res.redirect('/soal')
        res.send({msg: 'Soal berhasil dihapus!'})
    })
})

app.get('/pmsoal/hapus/:id_soal_ujian', (req, res) => {
    const id_soal_ujian = req.params.id_soal_ujian
    const sql1 = `SELECT id_soal_ujian FROM soal_ujian WHERE id_soal_ujian = ${id_soal_ujian}`
    const sql2 = `DELETE FROM soal_ujian WHERE id_soal_ujian = ${id_soal_ujian}`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {})
        res.redirect('/soal')
    })
})

// app.delete('/datasoal/hapus/:id_soal_ujian', (req, res) => {
//     const id_soal_ujian = req.params.id_soal_ujian
//     const sql = DELETE FROM soal_ujian WHERE id_soal_ujian = ${id_soal_ujian}
//     db.query(sql, (error, result) => {
//         res.redirect('/soal')
//         // res.send({msg: 'Soal berhasil dihapus!'})
//     })
// })

app.get('/pmsoal/:id_soal_ujian', (req, res) => {
    const id_soal_ujian = req.params.id_soal_ujian
    const sql = `SELECT * FROM soal_ujian WHERE id_soal_ujian = ${id_soal_ujian}`
    db.query(sql, (error, result) => {
        res.send({soal_ujian:result})
    })
})



//UPLOAD FILE
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

//Upload FIle Postman
app.post('/uploadbanksoal', upload.single('bankSoalFile'), async (req, res) => {
    try {
        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

        const bankSoalSheet = workbook.Sheets[workbook.SheetNames[0]];
        // const bankJawabanSheet = workbook.Sheets[workbook.SheetNames[1]];

        const soal_ujian = xlsx.utils.sheet_to_json(bankSoalSheet);
        // const dataJawaban = xlsx.utils.sheet_to_json(bankJawabanSheet);

        for (const row of soal_ujian) {
            const { id_materi, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan } = row;

            // Check for undefined values and set them to null
            const id_materiValue = id_materi || null;
            const pertanyaanValue = pertanyaan || null;
            const pilihan_aValue = pilihan_a || null;
            const pilihan_bValue = pilihan_b || null;
            const pilihan_cValue = pilihan_c || null;
            const pilihan_dValue = pilihan_d || null;
            const pilihan_benarValue = pilihan_benar || null;
            const tingkatKesulitanValue = tingkat_kesulitan || null;

            const sql = `INSERT INTO soal_ujian (id_materi, pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, tingkat_kesulitan) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`;
            const values = [id_materiValue, pertanyaanValue, pilihan_aValue, pilihan_bValue, pilihan_cValue, pilihan_dValue, pilihan_benarValue, tingkatKesulitanValue];

            await db.query(sql, values);
        }

        res.send('Bank soal data successfully uploaded and imported into the database.');

        // db.end(); // No need to end the connection here if you plan to reuse it.
    } catch (error) {
        console.error('Error uploading and importing data:', error);
        res.status(500).send('An error occurred while uploading and importing data.');
    }
});

//Upload File EJS   
app.get('/soal/upload', (req, res) => {
    res.render('uploadsoal'); // Rendering EJS template
  });


// app.put('/soal/:id_soal_ujian', (req, res) => {
//     const id_soal_ujian = req.params.id_soal_ujian
//     const sql = SELECT * FROM soal_ujian WHERE id_soal_ujian = ${id_soal_ujian}
//     db.query(sql, (error, result) => {
//         res.send({soal_ujian:result})
//     })
// })

// app.post('/soal/ubah/:id', (req, res) => {
//     const id = req.params.id
//     const { pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, id_materi, tingkat_kesulitan} = req.body
//     const sql = UPDATE soal_ujian SET pertanyaan='${pertanyaan}', pilihan_a='${pilihan_a}', pilihan_b='${pilihan_b}', pilihan_c='${pilihan_c}', pilihan_d='${pilihan_d}', pilihan_benar='${pilihan_benar}', id_materi='${id_materi}', tingkat_kesulitan='${tingkat_kesulitan}' WHERE id_soal_ujian = ${id}
//     db.query(sql, (error, result) => {
//         res.redirect('/soal')
//     })
// })

// exam detail=konfigurasi
//get all konfigurasi
app.get('/pmkonfigurasi', (req, res) => {
    const sql1 = `SELECT id_paket_soal, nama_paket_soal, kode_paket, jumlah_soal FROM paket_soal`
    const sql2 = `SELECT detailujian.id_detail_ujian, materi.nama_materi, detailujian.persentase_materi, detailujian.persentase_mudah, detailujian.persentase_sedang, detailujian.persentase_sulit FROM detailujian INNER JOIN materi ON detailujian.id_materi=materi.id_materi`
    db.query(sql1, (error, result1) => {
        if (result1.length) {
            db.query(sql2, (error, result2) => {
                res.send({paket_soal:result1[0], detailujian:result2})
            })
        }
    })
})
//get detail konfigurasi
app.get('/pmkonfigurasi/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal
    const sqlPaketSoal = `SELECT * FROM paket_soal WHERE id_paket_soal = ${id_paket_soal}`
    const sqlTopikUjian = `SELECT detailujian.id_detail_ujian, materi.nama_materi, detailujian.persentase_materi, detailujian.persentase_mudah, detailujian.persentase_sedang, detailujian.persentase_sulit FROM detailujian INNER JOIN materi ON detailujian.id_materi=materi.id_materi WHERE detailujian.id_paket_soal = ${id_paket_soal}`
    db.query(sqlPaketSoal, (error, result1) => {
        if (result1.length) {
            db.query(sqlTopikUjian, (error, result2) => {
                res.send({paket_soal:result1[0], detailujian:result2})
            })
        }
    })
})

//Post/ubah paketsoal sebelum nyimpen konfigurasi detail exam buat jadi paket ujian fix
app.post('/pmsoalujian/ubah/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal
    const { nama_paket_soal, jumlah_soal } = req.body
    const sql = `UPDATE ujian SET judul='${judul}', jumlah_soal=${jumlah_soal} WHERE id_paket_soal = ${id_paket_soal}`
    db.query(sql, (error, result) => {
        res.redirect(`/konfigurasi/${id_paket_soal}`);
    })
})


//                   judul = COALESCE(?, judul),
//                   kode_paket = COALESCE(?, kode_paket),
//                   jumlah_soal = COALESCE(?, jumlah_soal)
//                 WHERE id_paket_soal = ?`;

//     db.query(sql, [judul, kode_paket, jumlah_soal, id_paket_soal], (error, result) => {
//         if (error) {
//             res.status(500).send({ error: 'Gagal mengubah data' });
//         } else {
//             res.redirect('/editkonfigurasi');
//         }
//     });
// });

//Nyimpen konfigurasi detail ujian (fix jadi paketujian) PAKETUJIAN APA KONFIGURASII?
app.post('/paketujian/simpan', (req,res) => {
        const { id_paket_soal, id_materi, persentase_materi, persentase_mudah, persentase_sedang, persentase_sulit } = req.body
        if (parseFloat(persentase_mudah) + parseFloat(persentase_sedang) + parseFloat(persentase_sulit) == 1.0) {
            const sql1 = `SELECT EXISTS (SELECT id_detail_ujian FROM detailujian WHERE id_paket_soal = ${id_paket_soal} AND id_materi = ${id_materi}) AS isExists`
            db.query(sql1, (error, result1) => {
                if (result1[0].isExists == 0) {
                    const sql2 = `INSERT INTO detailujian (id_detail_ujian, id_paket_soal, id_materi, persentase_materi, persentase_mudah, persentase_sedang, persentase_sulit) VALUES (NULL, ${id_paket_soal}, ${id_materi}, ${persentase_materi}, ${persentase_mudah}, ${persentase_sedang}, ${persentase_sulit})`
                    db.query(sql2, (error, result2) => {})
                }
            })
        }
        res.redirect(`/editkonfigurasi/${id_paket_soal}`) //masuk ke detail ujian (detail paketsoal = detail paket ujian)
    })


//insert konfigurasi postman
app.post('/pmkonfigurasi', (req, res) => {
    const { id_paket_soal, id_materi, persentase_materi, persentase_mudah, persentase_sedang, persentase_sulit } = req.body
    const sql1 = `INSERT INTO detailujian (id_detail_ujian, id_paket_soal, id_materi, persentase_materi, persentase_mudah, persentase_sedang, persentase_sulit) VALUES (NULL, '${id_paket_soal}', '${id_materi}', '${persentase_materi}', '${persentase_mudah}', '${persentase_sedang}', '${persentase_sulit}')`
    const sql2 = `SELECT id_detail_ujian FROM detailujian ORDER BY id_ujian DESC LIMIT 1`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {
            res.send({ msg: 'Konfigurasi berhasil dibuat' })
        })
    })
})

//insert konfigurasi (html)
// app.post('/datakonfigurasi/ubah/:id_paket_soal', (req, res) => {
//     const id_paket_soal = req.params.id_paket_soal
//     const { id_materi, persentase_materi, persentase_mudah, persentase_sedang, persentase_sulit } = req.body
//     const sql1 = INSERT INTO detail_ujian (id_examdetail, id_materi, persentase_materi, persentase_mudah, persentase_sedang, persentase_sulit) VALUES (NULL, '${id_materi}', '${persentase_materi}', '${persentase_mudah}', '${persentase_sedang}', '${persentase_sulit}') WHERE id_paket_soal = ${id_paket_soal}
//     const sql2 = SELECT id_examdetail FROM detail_ujian ORDER BY id_exam DESC LIMIT 1
//     db.query(sql1, (error, result1) => {
//         db.query(sql2, (error, result2) => {
//             res.redirect('/editkonfigurasi')
//         })
//     })
// })

//Manggil ejs edit konfigurasi
app.get('/editkonfigurasi/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal
    const sql1 = `SELECT id_paket_soal, nama_paket_soal, jumlah_soal FROM paket_soal WHERE id_paket_soal = ${id_paket_soal}`
    const sql2 = `SELECT id_materi, nama_materi FROM materi`
    const sql3 = `SELECT detailujian.id_detail_ujian, materi.nama_materi, detailujian.persentase_materi, detailujian.persentase_mudah, detailujian.persentase_sedang, detailujian.persentase_sulit FROM detailujian INNER JOIN materi ON detailujian.id_materi=materi.id_materi WHERE detailujian.id_paket_soal=${id_paket_soal}`
    if (result1.length) {
        db.query(sqlTopikUjian, (error, result2) => {
            db.query(sqlmateri, (error, result3) => {
            // res.render('editkonfigurasi', {exam:result1[0], materi:result2, detail_ujian:result3})
                res.render('editkonfigurasi', {paket_soal:result1[0], detailujian:result2, materi:result3})
            })
        })
     }
    })


// app.get('/editkonfigurasi', (req, res) => {
//     const sql1 = 'SELECT id_paket_soal, judul, kode_paket, jumlah_soal FROM paket_soal'
//     const sql2 = `SELECT id_materi, nama_materi FROM materi`
//     const sql3 = `SELECT detail_ujian.id_detailujian, materi.nama_materi, detail_ujian.persentase_materi, detail_ujian.persentase_mudah, detail_ujian.persentase_sedang, detail_ujian.persentase_sulit FROM detail_ujian INNER JOIN materi ON detail_ujian.id_materi=materi.id_materi`
//     db.query(sql1, (error, result1) => {
//         db.query(sql2, (error, result2) => {
//             db.query(sql3, (error, result3) => {
//                 res.render('editkonfigurasi', {paket_soal:result1[0], materi:result2, detail_ujian:result3})
//             })
//         })
//     })
// })


//delete konfigurasi
app.delete('/pmkonfigurasi/:id_detail_ujian', (req, res) => {
    const id_detail_ujian = req.params.id_detail_ujian
    const sql = `DELETE FROM detailujian WHERE id_detail_ujian = ${id_detail_ujian}`
    db.query(sql, (error, result) => {
        res.send({msg :'Konfigurasi berhasil dihapus'})
    })
})

// paket soal ujian
//get paket soal 
app.get('/pmsoalujian', (req, res) => {
    const sql = `SELECT id_paket_soal, nama_paket_soal, kode_paket, jumlah_soal FROM paket_soal`
    db.query(sql, (error, result) => {
        res.send({paketsoal:result})
    })
})

//post/insert paket soal
app.post('/pmsoalujian', (req, res) => {
    const { nama_paket_soal, jumlah_soal } = req.body
    const sql = `INSERT INTO paket_soal (id_paket_soal, nama_paket_soal, kode_paket, jumlah_soal) VALUES (NULL, '${nama_paket_soal}', NULL, '${jumlah_soal}')`
    db.query(sql, (error, result) => {
        // res.redirect('/soal')
        res.send({msg :'Paket Soal berhasil dibuat'})
    })
})

//detail paket soal  
app.get('/pmsoalujian/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal
    const sqlPaketSoal = `SELECT * FROM paket_soal WHERE id_paket_soal = ${id_paket_soal}`
    const sqlSoalUjian = `SELECT soal_ujian.pertanyaan, soal_ujian.pilihan_a, soal_ujian.pilihan_b, soal_ujian.pilihan_c, soal_ujian.pilihan_d FROM preview_soal_ujian INNER JOIN soal_ujian ON preview_soal_ujian.id_soal_ujian=soal_ujian.id_soal_ujian WHERE preview_soal_ujian.id_paket_soal = ${id_paket_soal}`
    db.query(sqlPaketSoal, (error, result1) => {
        if (result1.length) {
            db.query(sqlSoalUjian, (error, result2) => {
                res.send({paket_soal:result1[0], preview_soal_ujian:result2})
            })
        }
    })
})

//delete paket soal
app.delete('/pmsoalujian/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal
    const sql = `DELETE FROM paket_soal WHERE id_paket_soal = ${id_paket_soal}`
    db.query(sql, (error, result) => {
        // res.redirect('/soal')
        res.send({msg :'Paket Soal berhasil dihapus'})
    })
})

//update paket soal
app.put('/pmsoalujian/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal;
    const { nama_paket_soal, kode_paket, jumlah_soal } = req.body;

    const sql = `UPDATE paket_soal SET 
                  nama_paket_soal = COALESCE(?, nama_paket_soal),
                  kode_paket = COALESCE(?, kode_paket),
                  jumlah_soal = COALESCE(?, jumlah_soal)
                WHERE id_paket_soal = ?`;

    db.query(sql, [nama_paket_soal, kode_paket, jumlah_soal, id_paket_soal], (error, result) => {
        if (error) {
            res.status(500).send({ error: 'Gagal mengubah data' });
        } else {
            res.send({ msg: 'Paket Soal berhasil diubah' });
        }
    });
});


// //paket soal (exam)
// app.get('/paketsoal', (req, res) => {
//     const sql = SELECT id, id_exam, nama, kode_paket FROM paket_soal
//     db.query(sql, (error, result) => {
//         res.render('paketsoal', {paketsoal:result})
//     })
// })




// bikin paketsoalll
app.post('/konfigurasisoal/simpan', (req, res) => {
    const { judul, jumlah_soal } = req.body
    const sql1 = `INSERT INTO paket_soal (id_paket_soal, nama_paket_soal, jumlah_soal) VALUES (NULL, '${nama_paket_soal}', ${jumlah_soal})`
    const sql2 = `SELECT id_paket_soal FROM paket_soal ORDER BY id_paket_soal DESC LIMIT 1`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {
            res.redirect(`/konfigurasi/${result2[0].id_paket_soal}`)
        })
    })
})

app.post('/pmkonfigurasisoal/simpan', (req, res) => {
    const { nama_paket_soal, jumlah_soal } = req.body
    const sql1 = `INSERT INTO paket_soal (id_paket_soal, nama_paket_soal, jumlah_soal) VALUES (NULL, '${nama_paket_soal}', ${jumlah_soal})`
    const sql2 = `SELECT id_paket_soal FROM paket_soal ORDER BY id_paket_soal DESC LIMIT 1`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {
            // res.render(`/konfigurasi/${result2[0].id_paket_soal}`)
            res.send({ msg: 'Paket Soal berhasil ditambahkan!' })
        })
    })
})

// app.get('/konfigurasi/:id', (req, res) => {
//     const id = req.params.id
//     const sql1 = SELECT id_exam, judul_exam, jumlah_soal FROM exam WHERE id_exam = ${id}
//     const sql2 = SELECT id_materi, nama_materi FROM materi
//     const sql3 = SELECT detail_ujian.id_examdetail, materi.nama_materi, detail_ujian.persentase_materi, detail_ujian.persentase_mudah, detail_ujian.persentase_sedang, detail_ujian.persentase_sulit FROM detail_ujian INNER JOIN materi ON detail_ujian.id_materi=materi.id_materi WHERE detail_ujian.id_exam=${id}
//     db.query(sql1, (error, result1) => {
//         db.query(sql2, (error, result2) => {
//             db.query(sql3, (error, result3) => {
//                 res.render('editkonfigurasi', {exam:result1[0], materi:result2, detail_ujian:result3})
//             })
//         })
//     })
// })
// app.post('/konfigurasi/ubah/:id', (req, res) => {
//     const id = req.params.id
//     const { judul_exam, jumlah_soal } = req.body
//     const sql = UPDATE exam SET judul_exam='${judul_exam}', jumlah_soal=${jumlah_soal} WHERE id_exam = ${id}
//     db.query(sql, (error, result) => {
//         res.redirect(/konfigurasi/${id})
//     })
// })
// app.post('/topikujian/simpan', (req,res) => {
//     const { id_exam, id_materi, persentase_materi, persentase_mudah, persentase_sedang, persentase_sulit } = req.body
//     if (parseFloat(persentase_mudah) + parseFloat(persentase_sedang) + parseFloat(persentase_sulit) == 1.0) {
//         const sql1 = SELECT EXISTS (SELECT id_examdetail FROM detail_ujian WHERE id_exam = ${id_exam} AND id_materi = ${id_materi}) AS isExists
//         db.query(sql1, (error, result1) => {
//             if (result1[0].isExists == 0) {
//                 const sql2 = INSERT INTO detail_ujian (id_examdetail, id_exam, id_materi, persentase_materi, persentase_mudah, persentase_sedang, persentase_sulit) VALUES (NULL, ${id_exam}, ${id_materi}, ${persentase_materi}, ${persentase_mudah}, ${persentase_sedang}, ${persentase_sulit})
//                 db.query(sql2, (error, result2) => {})
//             }
//         })
//     }
//     res.redirect(/konfigurasi/${id_exam})
// })
// app.get('/topikujian/hapus/:id', (req, res) => {
//     const id = req.params.id
//     const sql1 = SELECT id_exam FROM detail_ujian WHERE id_examdetail = ${id}
//     const sql2 = DELETE FROM detail_ujian WHERE id_examdetail = ${id}
//     db.query(sql1, (error, result1) => {
//         db.query(sql2, (error, result2) => {})
//         res.redirect(/konfigurasi/${result1[0].id_exam})
//     })
// })

app.delete('/detailujian/hapus/:id_detail_ujian', (req, res) => {
    const id_detail_ujian = req.params.id_detail_ujian
    const sql1 = `SELECT id_paket_soal FROM detailujian WHERE id_detail_ujian = ${id_detail_ujian}`
    const sql2 = `DELETE FROM detailujian WHERE id_detail_ujian = ${id_detail_ujian}`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {})
         res.redirect(`/paketsoal/`)
     })
})

app.get('/konfigurasisoal', (req, res) => {
    const sql = 'SELECT id_paket_soal, nama_paket_soal FROM paket_soal'
    db.query(sql, (error, result) => {
        res.render('konfigurasi', {paket_soal:result})
    })
})

// app.get('/konfigurasi/:id_paket_soal', (req, res) => {
//     const id_paket_soal = req.params.id_paket_soal
//     const sql1 = SELECT id_exam, judul_exam, jumlah_soal FROM exam WHERE id_epaket_soal = ${id_paket_soal}
//     const sql2 = SELECT id_materi, nama_materi FROM materi
//     const sql3 = SELECT detail_ujian.id_examdetail, materi.nama_materi, detail_ujian.persentase_materi, detail_ujian.persentase_mudah, detail_ujian.persentase_sedang, detail_ujian.persentase_sulit FROM detail_ujian INNER JOIN materi ON detail_ujian.id_materi=materi.id_materi WHERE detail_ujian.id_paket_soal=${id_paket_soal}
//     db.query(sql1, (error, result1) => {
//         db.query(sql2, (error, result2) => {
//             db.query(sql3, (error, result3) => {
//                 res.render('detailpaketsoal', {paket_soal:result1[0], materi:result2, detail_ujian:result3})
//             })
//         })
//     })
// })
app.get('/konfigurasisoal/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal
    const sql1 = `SELECT id_paket_soal, nama_paket_soal, kode_paket FROM paket_soal WHERE id_paket_soal=${id_paket_soal}`
    const sql2 = `SELECT soal_ujian.pertanyaan, soal_ujian.pilihan_a, soal_ujian.pilihan_b, soal_ujian.pilihan_c, soal_ujian.pilihan_d FROM preview_soal_ujian INNER JOIN soal_ujian ON preview_soal_ujian.id_soal_ujian = soal_ujian.id_soal_ujian WHERE preview_soal_ujian.id_paket_soal = ${id_paket_soal}`
    db.query(sql1, (error, result1) => {
       db.query(sql2, (error, result2) => {
            res.render('detailpaketsoal', {paketsoal:result1[0], soal_ujian:result2})
        })
    })
})



// untuk ejs
app.get('/soal', (req, res) => {
    const sql1 = `SELECT id_materi, nama_materi FROM materi`
    const sql2 = `SELECT soal_ujian.id_soal_ujian, materi.nama_materi,  soal_ujian.tingkat_kesulitan, soal_ujian.pertanyaan, soal_ujian.pilihan_a,  soal_ujian.pilihan_b,  soal_ujian.pilihan_c,  soal_ujian.pilihan_d,  soal_ujian.pilihan_benar FROM soal_ujian INNER JOIN materi ON soal_ujian.id_materi=materi.id_materi`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {                            
        //    res.render('soal', {materi:result1, soal_ujian:result2})
           res.render('soal', {materi:result1, soal_ujian:result2})
        })
    })
})

app.get('/soal/tambah', (req, res) => {
    const sql = `SELECT id_materi, nama_materi FROM materi`
    db.query(sql, (error, result) => {
        res.render('tambahsoal', { materi:result })
    })
})

app.get('/soal/ubah/:id_soal_ujian', (req, res) => {
    const id_soal_ujian = req.params.id_soal_ujian
    const sql1 = `SELECT id_materi, nama_materi FROM materi`
    const sql2 = `SELECT soal_ujian.id_soal_ujian, materi.nama_materi,  soal_ujian.tingkat_kesulitan, soal_ujian.pertanyaan, soal_ujian.pilihan_a,  soal_ujian.pilihan_b,  soal_ujian.pilihan_c,  soal_ujian.pilihan_d,  soal_ujian.pilihan_benar FROM soal_ujian INNER JOIN materi ON soal_ujian.id_materi=materi.id_materi WHERE id_soal_ujian = ${id_soal_ujian}`
    //     db.query(sql, (error, result) => {`
    db.query(sql1, (error, result1) => {
        db.query(sql2, (error, result2) => {
        //    res.render('soal', {materi:result1, soal_ujian:result2})
           res.render('editsoal', {materi:result1, soal_ujian:result2[0]})
    })
})
})


// app.post('/soal/ubah/:id', (req, res) => {
//     const id = req.params.id
//     const { pertanyaan, pilihan_a, pilihan_b, pilihan_c, pilihan_d, pilihan_benar, id_materi, tingkat_kesulitan} = req.body
//     const sql = UPDATE soal_ujian SET pertanyaan='${pertanyaan}', pilihan_a='${pilihan_a}', pilihan_b='${pilihan_b}', pilihan_c='${pilihan_c}', pilihan_d='${pilihan_d}', pilihan_benar='${pilihan_benar}', id_materi='${id_materi}', tingkat_kesulitan='${tingkat_kesulitan}' WHERE id_soal_ujian = ${id}
//     db.query(sql, (error, result) => {
//         res.redirect('/soal')
//     })
// })

// app.get('/viewsoal/tambahsoal', (req, res) => {
//     const sql1 = SELECT id_materi, nama_materi FROM materi
//     const sql2 = SELECT soal_ujian.id_soal_ujian, materi.nama_materi,  soal_ujian.tingkat_kesulitan, soal_ujian.pertanyaan, soal_ujian.pilihan_a,  soal_ujian.pilihan_b,  soal_ujian.pilihan_c,  soal_ujian.pilihan_d,  soal_ujian.pilihan_benar FROM soal_ujian INNER JOIN materi ON soal_ujian.id_materi=materi.id_materi
//     db.query(sql1, (error, result1) => {
//         db.query(sql2, (error, result2) => {
//         //    res.render('soal', {materi:result1, soal_ujian:result2})
//            res.render('tambahsoal', {materi:result1, soal_ujian:result2})
//         })
//     })
// })


// untuk ejs
app.get('/daftarsoalujian', (req, res) => {
    const sql = `SELECT id_paket_soal, nama_paket_soal, kode_paket, jumlah_soal FROM paket_soal`
    db.query(sql, (error, result) => {
        res.render('paketsoal', {paketsoal:result})
    })
})

// app.get('/viewkonfigurasi', (req, res) => {
//     const sql1 = 'SELECT id_paket_soal, judul, kode_paket, jumlah_soal FROM paket_soal'
//     const sql2 = SELECT detail_ujian.id_examdetail, materi.nama_materi, detail_ujian.persentase_materi, detail_ujian.persentase_mudah, detail_ujian.persentase_sedang, detail_ujian.persentase_sulit FROM detail_ujian INNER JOIN materi ON detail_ujian.id_materi=materi.id_materi
//     db.query(sql1, (error, result1) => {
//         if (result1.length) {
//             db.query(sql2, (error, result2) => {
//                 res.render('konfigurasi', {paket_soal:result1[0], detail_ujian:result2})
//             })
//         }
//     })
// })

// app.get('/viewsoal', (req,res) => {
//     res.render('soal', {result:materi})
// })
// //login
// app.get('/login', (res) => {
//     res.render('login')
// })

//Random Soal
//paket soal
app.post('/pmsoalujian/:id_paket_soal', (req, res) => {
    const id_paket_soal = req.params.id_paket_soal

    // Cek konfigurasi paket soal
    async function checkConfig(id_paket_soal) {
        try {
            const sqlCheckConfig = `SELECT ROUND(SUM(persentase_materi), 2) AS 'total' FROM detailujian WHERE id_paket_soal = ?`
            const result = await new Promise((resolve, reject) => {
                db.query(sqlCheckConfig, [ id_paket_soal ], (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                })
            })
            return result[0].total
        } catch (error) {
            return res.status(500).json({ message: 'Ada kesalahan!' })
        }
    }
    
    // Hitung soal yang diperlukan
    async function getNumofSoal(id_paket_soal) {
        try {
            const sqlPaketsoal = `SELECT jumlah_soal FROM paket_soal WHERE id_paket_soal = ?`
            const jumlah_soal = await new Promise((resolve, reject) => {
                db.query(sqlPaketsoal, [ id_paket_soal ], (error, result) => {
                    if (error) reject(error)
                    else resolve(result[0].jumlah_soal)
                })
            })
            const sqlTopikujian = `SELECT id_materi, ROUND((persentase_mudah * persentase_materi * ${ jumlah_soal }), 0) AS 'soal_mudah', ROUND((persentase_sedang * persentase_materi * ${ jumlah_soal }), 0) AS 'soal_sedang', ROUND((persentase_sulit * persentase_materi * ${ jumlah_soal }), 0) AS 'soal_sulit' FROM detail_ujian WHERE id_paket_soal = ?`
            const requiredSoal = await new Promise((resolve, reject) => {
                db.query(sqlTopikujian, [ id_paket_soal ], (error, result) => {
                    if (error) reject(error)
                    else resolve(result)
                })
            })
            return requiredSoal
        } catch (error) {
            return res.status(500).json({ message: 'Gagal menghitung jumlah soal yang diperlukan!'})
        }
    }

    // Periksa ketersediaan soal
    async function checkSoal(requiredSoal) {
        try {
            const statuses = await Promise.all(requiredSoal.map(async (result) => {
                let idmateri = result.id_materi
                let soalRequired = [result.soal_mudah, result.soal_sedang, result.soal_sulit]
                for (let i = 0; i < 3; i++) {
                    let sqlCekSoal = `SELECT COUNT(id_materi) AS 'jumlah' FROM soal_ujian WHERE id_materi = ${ id_materi } AND tingkat_kesulitan = ${ i+1 }`
                    let soaltersedia = await new Promise((resolve, reject) => {
                        db.query(sqlCekSoal, (error, result) => {
                            if (error) reject(error)
                            else resolve(result[0].jumlah)
                        })
                    })
                    if (soaltersedia < soalRequired[i]) { return 'tidak tesedia' }
                }
                return 'tersedia'
            }))
            return statuses.includes('tidak tesedia') ? 'tidak tesedia' : 'tersedia'
        } catch (error) {
            return res.status(500).json({ message: 'Gagal memeriksa ketersediaan soal!' })
        }
    }

    // Generate soal random
    async function getRandomSoal(requiredSoal) {
        try {
            const draft = await Promise.all(requiredSoal.map(async (result) => {
                let idmateri = result.id_materi
                let soalRequired = [result.soal_mudah, result.soal_sedang, result.soal_sulit]
                let soals = await Promise.all(soalRequired.map(async (required, j) => {
                    let sqlSoalUjian = `SELECT id_soal_ujian FROM soal_ujian WHERE id_materi = ${ idmateri } AND tingkat_kesulitan = ${ j+1 } ORDER BY RAND() LIMIT ${ required }`
                    let random = await new Promise((resolve, reject) => {
                        db.query(sqlSoalUjian, (error, result) => {
                            if (error) reject(error)
                            else resolve(result)
                        })
                    })
                    return random
                }))
                return [].concat(...soals) //emang soals kahhh?
                // return [].concat(...soal_ujian)
            }))
            return [].concat(...draft)
        } catch (error) {
            return res.status(500).json({ message: 'Gagal menghasilkan random soal' })
        }
    }

    // Jalankan fungsi
    async function runFunction(id) {
        try {
            const totalPersenTopik = await checkConfig(id)
            if (totalPersenTopik == 1.00) {
                const requiredSoal = await getNumofSoal(id)
                let status = await checkSoal(requiredSoal)
                if (status == 'tersedia') {
                    let draft = await getRandomSoal(requiredSoal)
                    // return res.status(200).json({ draft })
                    
                    // Menyimpan draft paket soal
                    let json = JSON.stringify(draft)
                    const dataArray = JSON.parse(json)
                    const values = dataArray.map(function(item) {
                        return `(NULL, ${ id }, ` + item.id_soal_ujian + ")"
                    }).join(", ")

                    // const sqlInsert = "INSERT INTO testpaketsoal (id_preview, id_paket_soal, id_soal_ujian) VALUES " + values
                    // const sqlSearch = SELECT * FROM testpaketsoal WHERE id_paket_soal = ?
                    // const sqlDelete = DELETE FROM testpaketsoal WHERE id_paket_soal = ?
                    // const sqlkode = UPDATE paket_soal SET kode_paket = ROUND(RAND()*(999999-100000)+100000, 0) WHERE id_paket_soal = ?
                    const sqlInsert = `INSERT INTO preview_soal_ujian (id_preview, id_paket_soal, id_soal_ujian) VALUES`  + values
                    const sqlSearch = `SELECT * FROM preview_soal_ujian WHERE id_paket_soal = ?`
                    const sqlDelete = `DELETE FROM preview_soal_ujian WHERE id_paket_soal = ?`
                    const sqlkode = `UPDATE paket_soal SET kode_paket = ROUND(RAND()*(999999-100000)+100000, 0) WHERE id_paket_soal = ?`
                    db.query(sqlSearch, [ id_paket_soal ], (error, result) => {
                        if (error) {
                            return res.status(500).json({ message: 'Ada kesalahan!' })
                        }
                        
                        if (result.length) {
                            db.query(sqlDelete, [ id_paket_soal ], (error, result) => {
                                if (error) {
                                    return res.status(500).json({ message: 'Soal ujian tidak berhasil dihapus!' })
                                }
                                db.query(sqlInsert, (error, result) => {
                                    if (error) {
                                        return res.status(500).json({ message: 'Paket soal tidak berhasil dibuat!' })
                                    } else {
                                        db.query(sqlkode, [ id_paket_soal ], (error, result) => {
                                            if (error) {
                                                return res.status(500).json({ message: 'Ada kesalahan!' })
                                            } else {
                                                return res.status(200).json({ message: 'Paket soal berhasil dibuat!' })
                                            }
                                        })
                                    }
                                })
                            })
                        } else {
                            db.query(sqlInsert, (error, result) => {
                                if (error) {
                                    return res.status(500).json({ message: 'Paket soal tidak berhasil dibuat!' })
                                } else {
                                    db.query(sqlkode, [ id_paket_soal ], (error, result) => {
                                        if (error) {
                                            return res.status(500).json({ message: 'Ada kesalahan!' })
                                        } else {
                                            return res.status(200).json({ message: 'Paket soal berhasil dibuat!' })
                                        }
                                    })
                                }
                            })
                        }
                    })
                } else {
                    return res.status(500).json({ message: 'Soal yang tersedia tidak cukup!' })
                }
            } else {
                return res.status(500).json({ message: "Jumlah persentase topik harus tepat sama dengan 1 !" })
            }
        } catch (error) {
            return res.status(500).json({ message: 'Error' })
        }
    }

    runFunction(id_paket_soal)
})


app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
