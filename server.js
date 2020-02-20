const express = require("express")

const server = express()

// config o servidor para apresentar arquivos extras
server.use(express.static('public'))

// habilitar body  do formulario

server.use(express.urlencoded({ extended: true }))

// config  a conexao com o banco de dados 

const Pool = require('pg').Pool
const db = new Pool({ // criando um novo obj e colocando no db 
    user: 'postgres',
    password: 'netza1234',
    host: '172.17.0.5',
    port: 5432,
    database: 'doe'
})


// configurando o template engine
const nunjucks = require("nunjucks")
nunjucks.configure("./", {
    express: server,
    noCache: true, // boolean 
})

// config o layout
server.get("/", function (req, res) {

    db.query("SELECT * FROM donors", function (err, result) {
        if (err)
            return res.send("erro de banco de dados!!!!")

            const donors = result.rows
            return res.render("index.html", { donors })

    })

})

server.post("/", function (req, res) {
    // pegar dados do formulario
    const name = req.body.name;
    const email = req.body.email;
    const blood = req.body.blood;

    // se algum dos param estiver vazio 
    if (name == "" || email == "" || blood == "") {
        return res.send("Todos os campos são obrigatorios")
    }

    // coloca valores no banco de dados
    const query =
        `INSERT INTO donors("name", "email", "blood")
                VALUES ($1, $2, $3)`
    const values = [name, email, blood]

    db.query(query, values, function (err) {
        if (err)
            // fuxo de erro
            return res.send("erro no banco de dados")

        // fuxo ok 
        return res.redirect('/')

    })


})

// ligar o servidor 
let port = 9999
server.listen(port, function () {
    console.log(`run port: ${port}`)
})

// teste01