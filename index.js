//é preciso usar recusos já prontos que impeçam a reinvenção da roda.
import express from 'express';

const host = '0.0.0.0'; //todas as interfaces de rede disponíveis
//em um computador há diversos programas sendo executados
//cada programa é identificado por um número, esse número é a porta
const porta = 3000;
const app = express();

app.use(express.static('./publico'));

//listen = escutar por requisições dos usuários
app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});

