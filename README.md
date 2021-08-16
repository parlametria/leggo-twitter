## Leggo Twitter

Este é o repositório com a API de dados relacionados ao Twitter do Parlametria.

Parlametria é uma plataforma de inteligência para o acompanhamento das atividades no Congresso Nacional. Coletamos dados da Câmara e do Senado para encontrar quais proposições estão quentes, o que está tramitando com mais energia, como o conteúdo dos projetos é alterado e quem são os atores importantes nesse processo. Acesse o [Parlametria](https://leggo-painel.parlametria.org).

## Configuração do ambiente de desenvolvimento

Recomendamos que você instale o [docker](https://docs.docker.com/install/linux/docker-ce/ubuntu/#install-docker-ce) e o [docker-compose](https://docs.docker.com/compose/install/) para configuração do ambiente de desenvolvimento.

### Passo 1

Crie uma cópia do arquivo `.env.sample` para um arquivo `.env` também na raiz desse repositório.

O arquivo `.env` deve ter as variáveis.

```
NODE_ENV=development
```
NODE_ENV indica qual o contexto que o NODE deve executar (development ou production)

```
POSTGRESURI=postgres://postgres:secret@postgres:5432/leggotwitter
```
POSTGRESURI é a URI de conexão com o banco de dados local do postgres com os dados de tweets e de proposições relacionadas aos tweets. Este banco está localizado no repositório [leggo-twitter-dados](https://github.com/parlametria/leggo-twitter-dados).

### Passo 2

Antes de subir o serviço da api do leggo-twitter é necessário povoar o Banco de Dados do leggo twitter. Para isto siga as instruções do [README](https://github.com/parlametria/leggo-twitter-dados/blob/master/README.md) do leggo-twitter-dados.

### Passo 3

Após a configuração correta do banco de dados então suba o serviço da API:

```
docker-compose up
```

Caso necessário refaça o build da imagem:

```
docker-compose build
```

## Como contribuir

Se encontrou algum problema ou deseja fazer alguma melhoria. Por favor, abra uma [issue](https://github.com/parlametria/leggoR/issues) e descreva o problema com clareza, se possível com exemplos que possamos reproduzir.
  
Toda ajuda é bem vinda e de grande importância :) sinta-se à vontade.
