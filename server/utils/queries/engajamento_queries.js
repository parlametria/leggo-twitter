
function QueryEngajamentoAgregadoPorAgenda(interesse, dataInicial, dataFinal) {
  const q = "SELECT " +
  "tweet.id_parlamentar_parlametria AS id_parlamentar_parlametria, " +
  "SUM(tweet.interactions) AS engajamento " +
  "FROM tema_proposicao "+
  "INNER JOIN proposicao ON tema_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda_proposicao ON agenda_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda ON agenda_proposicao.id_agenda = agenda.id AND agenda.slug = '" + interesse + "' " +
  "INNER JOIN tweet_proposicao ON proposicao.id_proposicao_leggo = tweet_proposicao.id_proposicao_leggo " +
  "INNER JOIN tweet ON tweet_proposicao.id_tweet = tweet.id_tweet AND tweet.created_at BETWEEN '"+
  dataInicial +"' AND '"+ dataFinal + "' " +
  "GROUP BY agenda.slug, tweet.id_parlamentar_parlametria;";

  return q;
}

function QueryEngajamentoAgregadoPorAgendaETema(interesse, tema, dataInicial, dataFinal) {
  const q = "SELECT " +
  "tema.slug AS tema_slug, " +
  "tweet.id_parlamentar_parlametria AS id_parlamentar_parlametria, " +
  "SUM(tweet.interactions) AS engajamento " +
  "FROM tema_proposicao "+
  "INNER JOIN proposicao ON tema_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda_proposicao ON agenda_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda ON agenda_proposicao.id_agenda = agenda.id AND agenda.slug = '" + interesse + "' " +
  "INNER JOIN tweet_proposicao ON proposicao.id_proposicao_leggo = tweet_proposicao.id_proposicao_leggo " +
  "INNER JOIN tweet ON tweet_proposicao.id_tweet = tweet.id_tweet AND tweet.created_at BETWEEN '"+
  dataInicial +"' AND '"+ dataFinal + "' " +
  "INNER JOIN tema ON tema_proposicao.id_tema = tema.id AND tema.slug = '" + tema + "' " +
  "GROUP BY tema.slug, tweet.id_parlamentar_parlametria;";

  return q;
}

module.exports = {
  QueryEngajamentoAgregadoPorAgenda,
  QueryEngajamentoAgregadoPorAgendaETema }
