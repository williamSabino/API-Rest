//carregando o modulo dde banco de dados onde se cria a conexão.
global.db = require('./db');

//Carrega o modulo express que é responsavel pela criação do objeto para aplicação (app.js).
const express = require('express');
const app = express();
const port = 3000;

//configurando a serielização e a desserielização correta do body.
app.use(express.urlencoded({extendes: true}));
app.use(express.json());

//Configuração das rotas default com resposta em JSON

const router = express.Router();
router.get('/', (req,res)=>res.json({message: 'Funcionando!'}));
app.use('/', router);

//inicializa o servidor

app.listen(port);
console.log('API Funcionando');


//rota get
router.get('/cliente', async function(req,res){
    try {
        const results = await global.db.selectClients();
        res.json(results);
    } catch (error) {
        res.status(500).json({error: error});
    }
});

router.get('/cliente/:id', async function(req,res){
    const id = parseInt(req.params.id);

    try {
        const cliente = await global.db.selectClient(id);
        res.json(cliente);
    } catch (error) {
        res.status(500).json({error:error});
    }
});

//rota put
router.put('/cliente/:id', async function(req,res){
    const id = parseInt(req.params.id);
    const nome = req.body.nome;
    const idade = parseInt(req.body.idade);
    const uf = req.body.uf;
    try {
        await global.db.updateClient(id,{nome,idade,uf});
        res.json({message: "Cliente cadastrado"});
    } catch (error) {
        res.status(500).json({error:error});
    }
});

//rota post
router.post('/cliente', async function(req,res){
    const nome = req.body.nome;
    const idade = parseInt(req.body.idade);
    const uf = req.body.uf;
    try {
       const [ResultSetHeader] = await global.db.insertClient({nome,idade,uf});
       const cliente = await global.db.selectClient(ResultSetHeader.insertId);
        res.json(cliente);
    } catch (error) {
        res.status(500).json({error:error});
    }
});


//rota delete
router.delete('/cliente/:id',async function(req,res){
    const id = parseInt(req.params.id);
    try {
        await global.db.deleteClient(id);
        res.json({message: "Cliente excluido"});
    } catch (error) {
        res.status(500).json({error:error});
    }
});


//rota patch
router.patch('/cliente/:id', async function(req,res){
    const id = parseInt(req.params.id);
    const cliente ={};

    if(req.body.HasOwnProperty("nome"))
    cliente.nome = req.body.nome;
    if(req.body.HasOwnProperty("idade"))
    cliente.idade = parseInt(req.body.idade);
    if(req.body.HasOwnProperty("uf"))
    cliente.uf = req.body.uf;
    
    try {
        await global.db.updateClient(id,cliente);
        res.json({message: "Cliente cadastrado"});
    } catch (error) {
        res.status(500).json({error:error});
    }
});