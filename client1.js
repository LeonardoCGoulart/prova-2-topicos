
const axios = require('axios').default;

//POSTS

//adiciona uma 5 novas noticias
axios.post('http://localhost:3000/noticia',
    {
        titulo: 'noticia 1',
        resumo: 'meu resumo 1',
        url: 'www.dasda1.com'
    },
)
.then((res) => {
    console.log(res.data);
})
.catch(err => {
    console.log(err.response.data);
});

axios.post('http://localhost:3000/noticia',
    {
        titulo: 'noticia 2',
        resumo: 'meu resumo 2',
        url: 'www.dasda2.com'
    },
)
.then((res) => {
    console.log(res.data);
})
.catch(err => {
    console.log(err.response.data);
});

axios.post('http://localhost:3000/noticia',
    {
        titulo: 'noticia 3',
        resumo: 'meu resumo 3',
        url: 'www.dasda3.com'
    },
)
.then((res) => {
    console.log(res.data);
})
.catch(err => {
    console.log(err.response.data);
});


axios.post('http://localhost:3000/noticia',
    {
        titulo: 'noticia 4',
        resumo: 'meu resumo 4',
        url: 'www.dasda4.com'
    },
)
.then((res) => {
    console.log(res.data);
})
.catch(err => {
    console.log(err.response.data);
});

axios.post('http://localhost:3000/noticia',
    {
        titulo: 'noticia 5',
        resumo: 'meu resumo 5',
        url: 'www.dasda5.com'
    },
)
.then((res) => {
    console.log(res.data);
})
.catch(err => {
    console.log(err.response.data);
});

//adiciona 7 emails
axios.post('http://localhost:3000/inscricao',
    {
        email: 'quinn.kemmer@ethereal.email',
    },
)
.then((res) => {
    console.log(res.data);
})
.catch(err => {
    console.log(err.response.data);
});

axios.post('http://localhost:3000/inscricao',
    {
        email: 'celine.collier25@ethereal.email',
    },
)
.then((res) => {
    console.log(res.data);
})
.catch(err => {
    console.log(err.response.data);
});

axios.post('http://localhost:3000/inscricao',
    {
        email: 'murray.braun70@ethereal.email',
    },
)
.then((res) => {
    console.log(res.data);
})
.catch(err => {
    console.log(err.response.data);
});

axios.post('http://localhost:3000/inscricao',
    {
        email: 'dena.gaylord60@ethereal.email',
    },
)
.then((res) => {
    console.log(res.data);
})
.catch(err => {
    console.log(err.response.data);
});

axios.post('http://localhost:3000/inscricao',
    {
        email: 'ebony.kovacek72@ethereal.email',
    },
)
.then((res) => {
    console.log(res.data);
})
.catch(err => {
    console.log(err.response.data);
});

axios.post('http://localhost:3000/inscricao',
    {
        email: 'stanton.swift20@ethereal.email',
    },
)
.then((res) => {
    console.log(res.data);
})
.catch(err => {
    console.log(err.response.data);
});

axios.post('http://localhost:3000/inscricao',
    {
        email: 'kellie.vandervort55@ethereal.email',
    },
)
.then((res) => {
    console.log(res.data);
})
.catch(err => {
    console.log(err.response.data);
});

// GETS