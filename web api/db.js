const mysql = require('mysql2/promise');

async function connect(){
    if(global.connection &&
        global.connection.state !== 'disconnected')
        return global.connection;

        const connectionString = 'http://root:2william.@localhost:3306/crud';
        const connection = await mysql.createConnection(connectionString);

        global.connection = connection
        console.log('Conectado ao mysql');

        return global.connection;
}

connect();

async function selectClients (){
    const conn = await connect();
    const [rows] = await conn.query('select * from cliente');
    return rows 
}

async function selectClient(id){
    const conn = await connect();
    const sql = "SELECT * FROM cliente WHERE id = ?";
    const [rows] = await conn.query(sql,[id]);
    return rows;
}

async function updateClient(id,client){
    const sql = 'update from cliente set';
    
    //adiciona o objeto em uma função que retorna um array de chave e valor.
    const props = Object.entries(client);
    
    //percorre todas as propriedades do array 
    for(let i=0; i<props.length;i++){
        const item = props[i];
        //verifica se ele é o ultimo
        if(i!== props.length - 1){
            //caso ele não seja o ultimo sera adicionado a propriedade ao sql.
            sql += `${item[0]}=?,`
        } else{
            //caso ele seja o ultimo vai fazer a mesma coisa porem agora finalizando a query.
            sql += `${item[0]}=? where id =?`
        }
    }
    //cria uma variavel e passa pra ela o array que criamos la em cima porem apenas com os valores.
    const values = props.map(p=>p[1]);
    //adicionamos o id do cliente ao array onde ele ficara por ultimo no array
    values.push(id);

    // chamamos a conexão com o banco de dados caso de tudo certo...
    const conn =await connect();
    //retorna a query com o sql completo.
    return await conn.query(sql,values);
    
}

async function insertClient(client){
    const conn = await connect();
    const sql = 'insert into cliente (nome,idade,uf) values (?,?,?)';
    return await conn.query(sql,[client.nome,client.idade,client.uf]);
}

async function deleteClient(id){
    const conn = await connect();
    const sql = 'delete from cliente where id =?';
    return await conn.query(sql,[id])
}



module.exports = {selectClients,selectClient,updateClient,insertClient,deleteClient}