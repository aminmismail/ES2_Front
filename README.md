#  Front-End - Exercício 1 (ES2)

Este repositório contém o código-fonte para a parte de Front-End do software desenvolvido para o Exercício 1 da matéria de Engenharia de Software 2 (ES2).

### Requisitos abordados:

- *CRUD de Profissionais*: O sistema permite incluir, alterar, excluir e consultar informações sobre os profissionais de sua empresa. Os dados dos profissionais são: nome, endereço, nascimento, gênero, raça e especialidade;
- *CRUD de Times*: O sistema permite incluir, alterar, excluir e consultar informações sobre times da sua empresa. Os dados de times são: nome do time e relação de profissionais do time;
- *CRUD de Projetos*: O sistema permite incluir, alterar, excluir e consultar informações sobre projetos desenvolvidos por sua empresa. Os dados de projetos são: nome do projeto, nome do cliente, objetivo do projeto, data de início/término, valor do projeto e time responsável.

### Tecnologias:

- Linguagem de programação: JavaScript;
- Frameworks: Vue 3 + Vite;
- APIs: Fetch API;
- Conceitos: SPA (Single Page Application).

### Rotas:

- `/profissionais` - Interface dos Profissionais;
- `/times` - Interface dos Times;
- `/projetos` - Interface dos Projetos.

  
### Instruções de uso:

#### Para uso local:
Clone o repositório para o seu computador usando `git clone https://github.com/aminmismail/ES2_Front.git`

Dentro da pasta `ES2_Front`, instale as dependências com `npm install`.

Inicie a aplicação com `npm run dev`.

Acesse a aplicação no navegador em `http://localhost:3000`.

#### Para uso em Docker:

Primeiramente, na pasta `ES2_Front`, execute: `docker build -t front . `

Em seguida, execute `docker run -p 3000:3000 front`

Para utilizar o docker-compose ao invés de rodar com o docker, basta executar `docker-compose up` ao invés da instrução anterior.
