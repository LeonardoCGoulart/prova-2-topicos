const { default: axios } = require("axios");

//visualiza a noticia
axios.get('http://localhost:3000/noticia')
.then((res) => {
    console.log(res.data); // mostra todas as noticias existentes
    axios.put('http://localhost:3000/enviar/'+res.data[0].ID+'') // capta uma e dispara os emails
    .then(() => {
        console.log("noticia 1 enviada com sucesso para todos os emails"); // sucesso
    })
})
.catch(err => {
    console.log(err.response.data);
});