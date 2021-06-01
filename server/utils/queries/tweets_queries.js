function QueryAtividadeAgregadaPorAgenda(interesse, dataInicial, dataFinal) {
  const q = `SELECT
    tweet.id_parlamentar_parlametria,
    COUNT(tweet.id_tweet) AS atividade_twitter
  FROM
    tweet
    INNER JOIN tweet_proposicao ON (tweet_proposicao.id_tweet = tweet.id_tweet)
    INNER JOIN proposicao ON (proposicao.id_proposicao_leggo = tweet_proposicao.id_proposicao_leggo)
    INNER JOIN agenda_proposicao ON (agenda_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo)
    INNER JOIN agenda ON (agenda_proposicao.id_agenda = agenda.id)
  WHERE
    agenda.slug = '${interesse}' AND
    tweet.created_at BETWEEN '${dataInicial}' AND '${dataFinal}' AND
    tweet_proposicao.relator_proposicao = FALSE
  GROUP BY
    tweet.id_parlamentar_parlametria;`;

  return q;
}

function QueryAtividadeAgregadaPorTemaEAgenda(tema, interesse, dataInicial, dataFinal) {
  const q = "SELECT " +
  "tweet.id_parlamentar_parlametria, " +
  "COUNT(DISTINCT(tweet.id_tweet)) AS atividade_twitter " +
  "FROM tema_proposicao "+
  "INNER JOIN proposicao ON tema_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda_proposicao ON agenda_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda ON agenda_proposicao.id_agenda = agenda.id AND agenda.slug = '" + interesse + "' " +
  "INNER JOIN tweet_proposicao ON proposicao.id_proposicao_leggo = tweet_proposicao.id_proposicao_leggo " +
  "INNER JOIN tweet ON tweet_proposicao.id_tweet = tweet.id_tweet AND tweet.created_at BETWEEN '"+
  dataInicial +"' AND '"+ dataFinal + "' " +
  "AND tweet_proposicao.relator_proposicao = FALSE " +
  "INNER JOIN tema ON tema_proposicao.id_tema = tema.id AND tema.slug = '" + tema + "' " +
  "GROUP BY tweet.id_parlamentar_parlametria;";

  return q;
}

// Se tema for undefined então todos os temas serão considerados
function QueryTweetsPorTemaEAgenda(idParlamentar, tema, interesse, dataInicial, dataFinal, limit, destaque) {
  const q = "SELECT " +
  "DISTINCT(tweet.id_tweet), " +
  "tweet.id_parlamentar_parlametria, tweet.created_at, tweet.text, tweet.interactions, " +
  "tweet.url " +
  "FROM tema_proposicao "+
  "INNER JOIN proposicao ON tema_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda_proposicao ON agenda_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda ON agenda_proposicao.id_agenda = agenda.id AND agenda.slug = '" + interesse + "' " +
  "INNER JOIN tweet_proposicao ON proposicao.id_proposicao_leggo = tweet_proposicao.id_proposicao_leggo " +
  "INNER JOIN tweet ON tweet_proposicao.id_tweet = tweet.id_tweet AND tweet.created_at BETWEEN '"+
  dataInicial +"' AND '"+ dataFinal + "' " +
  "AND tweet_proposicao.relator_proposicao = FALSE " +
  "AND tweet.id_parlamentar_parlametria = '" + idParlamentar + "' " +
  "INNER JOIN tema ON tema_proposicao.id_tema = tema.id " +
  (tema !== undefined ? "AND tema.slug = '" + tema + "' ": "") +
  (destaque === 'true' ? " AND proposicao.destaque = TRUE " : "") +
  "ORDER BY tweet.interactions DESC" +
  (limit !== undefined ? " LIMIT " + limit + " ": "");

  return q;
}

function QueryTweetsInfo() {
  const q = "SELECT " +
  "COUNT(DISTINCT(tweet.id_parlamentar_parlametria)) as total_parlamentares, " +
  "COUNT(DISTINCT(tweet.id_tweet)) as total_tweets, " +
  "MIN(tweet.created_at) as data_inicial, " +
  "MAX(tweet.created_at) as data_final " +
  "FROM tweet"
  return q;
}

function QueryAtividadeAgregada(dataInicial, dataFinal) {
  const q = `SELECT
    tweet.id_parlamentar_parlametria,
    COUNT(DISTINCT(tweet.id_tweet)) AS atividade_total_twitter
  FROM
    tweet
  WHERE
    tweet.created_at BETWEEN '${dataInicial}' AND '${dataFinal}'
  GROUP BY
    tweet.id_parlamentar_parlametria;`;

  return q;
}

function QueryAtividadeAgregadaPorAgendaEDestaque(interesse, dataInicial, dataFinal) {
  const q = `SELECT
    tweet.id_parlamentar_parlametria,
    COUNT(tweet.id_tweet) AS atividade_twitter
  FROM
    tweet
    INNER JOIN tweet_proposicao ON (tweet_proposicao.id_tweet = tweet.id_tweet)
    INNER JOIN proposicao ON (proposicao.id_proposicao_leggo = tweet_proposicao.id_proposicao_leggo)
    INNER JOIN agenda_proposicao ON (agenda_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo)
    INNER JOIN agenda ON (agenda_proposicao.id_agenda = agenda.id)
  WHERE
    agenda.slug = '${interesse}' AND
    tweet.created_at BETWEEN '${dataInicial}' AND '${dataFinal}' AND
    tweet_proposicao.relator_proposicao = FALSE AND
    proposicao.destaque = TRUE
  GROUP BY
    tweet.id_parlamentar_parlametria;`;

  return q;
}

function QueryTweetRawInfo() {
  const q = "SELECT * " +
  "FROM tweet_raw_info"
  return q;
}

module.exports = { QueryAtividadeAgregadaPorAgenda,
                    QueryAtividadeAgregadaPorTemaEAgenda,
                    QueryAtividadeAgregada,
                    QueryTweetsPorTemaEAgenda,
                    QueryTweetsInfo,
                    QueryAtividadeAgregadaPorAgendaEDestaque,
                    QueryTweetRawInfo }
