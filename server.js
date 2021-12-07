const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
let ID = 0; // controle incremental das noticias
const storage = require('node-persist');

// função usada para inicializar o servidor 
// ou seja, iniciar a storage, recuperar os dados (noticias) ja salvas do node-persist
async function initialize(){
    await storage.init();
    if(await storage.getItem('noticias') === null || await storage.getItem('noticias') === undefined || await storage.getItem('noticias') === 'undefined'){
        await storage.setItem('noticias',[
            // {
            //     titulo: 'noticia 1',
            //     resumo: 'Eu sou a noticia origem - usada para inicializar se tiver vazio (for sua primeira vez usando)!',
            //     url: 'www.dasda.com'
            // } (se quiser tirar o comentario esta sera a primeira noticia, caso contrario a primeira vai ser do cliente)
        ])
    }
    const noticias = await storage.getItem('noticias');

    return noticias;
}

let noticias = []; // array para usar no sistema (e depois ser persistido)

//atualiza aquele array acima (noticias) com base nos dados ja existentes do node-persist
(async() => {
    noticias = await initialize();
  })()

//POSTS

//adiciona uma noticia
app.post('/noticia', (req, res) => {
    const noticia = req.body;

    if(antiFlood(noticias,noticia) == false){
        res.status(500).send('[flood] Noticia ja existente');
        return;
    }
    noticias.push(noticia); // adiciona a noticia no array do sistema
    (async() => {
        await storage.updateItem('noticias', noticias); // atualiza o node-persist com base no array do sistema
      })()

    //controle do ID unico
    noticias.forEach(item => {
        // toda nova noticia recebe um unique ID
        if(item.ID == null){ 
            item.ID = ID;
            ID++;
        }
      });
    res.send('Noticia adicionada');
});



//GETS

//retorna todas as noticias salvas
app.get('/noticia', (req, res) => {
    res.send(noticias);
});


//listen
app.listen(3000, () => {
    console.log(`Example app listening at http://localhost:3000`);
})

function antiFlood(array,req){

    for(let i = 0; i < array.length ; i++){
        if(array[i].titulo === req.titulo &&
           array[i].resumo === req.resumo &&
           array[i].url === req.url){
            return false;
        }
    }
    return true;
}


