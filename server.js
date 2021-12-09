const express = require('express');
const app = express();
const bodyParser = require('body-parser'); 
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true })); 
let ID = 0; // controle incremental das noticias
const storage = require('node-persist');
const nodemailer = require('nodemailer');

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
    ID = noticias.length; // atualiza o ID

    return noticias;
}

async function initializeEmail(){
    await storage.init();
    if(await storage.getItem('email') === null || await storage.getItem('email') === undefined || await storage.getItem('email') === 'undefined'){
        await storage.setItem('email',[
            // {
            //     email: 'www.com...1',
            // } (se quiser tirar o comentario esta sera a primeiro email, caso contrario o primeiro vai ser do cliente)
        ])
    }
    const email = await storage.getItem('email');

    return email;
}

let noticias = []; // array para usar no sistema (e depois ser persistido)
let email = []; // array para usar no sistema (e depois ser persistido)
let emailsQueForamEnviados = []; // array usado para verificar p/ quem foi entregue

//atualiza aquele array acima (noticias) com base nos dados ja existentes do node-persist
(async() => {
    noticias = await initialize();
    email = await initializeEmail();
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

//adiciona um email
app.post('/inscricao', (req, res) => {
    const theEmail = req.body;

    if(antiFloodEmail(email,theEmail) == false){
        res.status(500).send('[flood] Email ja existente');
        return;
    }
    email.push(theEmail); // adiciona o email no array do sistema
    (async() => {
        await storage.updateItem('email', email); // atualiza o node-persist com base no array do sistema
      })()

    res.send('Email Adicionado');
});



//GETS

//retorna todas as noticias salvas
app.get('/noticia', (req, res) => {
    res.send(noticias);
});

//retorna uma noticia especifica
app.get('/noticia/:noticiaID', (req, res) => {
    const noticiaID = parseInt(req.params.noticiaID);
    if (isNaN(noticiaID)) {
        res.status(500).send('erro de conversao');
        return;
    }
    const noticia = noticias.find(n => n.ID === noticiaID);
    if (!noticia) {
        res.status(500).send('noticia nula/invalida');
        return;
    }
    res.send(noticia);
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

function antiFloodEmail(array,req){
    for(let i = 0; i < array.length ; i++){
        if(array[i].email === req.email){
            return false;
        }     
    }
    return true;
}

//PUT

//envia a noticia para todos os emails cadastrados
app.put('/enviar/:noticiaID', async (req, res) => {
    const noticiaID = parseInt(req.params.noticiaID);

    if (isNaN(noticiaID)) {
        res.status(500).send('erro de conversao');
        return;
    }

    const noticia = noticias.find(n => n.ID === noticiaID);


    if (!noticia) {
        res.status(500).send('noticia nula/invalida');
        return;
    }

    if (!email) {
        res.status(500).send('nenhum email cadastrado');
        return;
    }

    for(let i = 0; i < email.length; i++){
        theEmail = email[i];
        await sendEmail(theEmail,noticia);
    }

    res.send(emailsQueForamEnviados);
});

async function sendEmail(emailAtual, noticia){

    if(!emailAtual)
        return false;

    if(!noticia)
        return false;

    //cria o transporte de acordo com as configurações
    const transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: 'eudora.mclaughlin49@ethereal.email',
            pass: 'xQjBFKw1w1KJBGMaQJ'
        }
    });

    //função de espera 
    async function esperarPor(time){
        return new Promise((resolve,reject) => {
            setTimeout(resolve,time);
        })
    }

    const dadosEmail = {
        from: '"Eudora McLaughlin" <eudora.mclaughlin49@ethereal.email>', 
        to: ''+emailAtual.email+'',
        subject: ''+noticia.titulo+'',
        text: ''+noticia.resumo+'  - '+noticia.url+''
    };
        //envia o email
        const info = await transporter.sendMail(dadosEmail)
        console.log('Message URL:', nodemailer.getTestMessageUrl(info));
        emailsQueForamEnviados.push(emailAtual.email);
        //espera alguns 2 segundos
        await esperarPor(2000);
        
        return true;
}