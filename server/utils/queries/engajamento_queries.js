
function QueryEngajamentoAgregadoPorAgenda(interesse, dataInicial, dataFinal, idParlamentar) {
  const q = "SELECT " +
  "res.tema_slug AS tema_slug, " +
  "SUM(res.interactions) OVER (PARTITION BY res.slug, res.tema_slug) AS engajamento FROM (" +
  "SELECT " +
  "agenda.slug, tema.slug AS tema_slug, " +
  "SUM(tweet.interactions) AS interactions " +
  "FROM tema_proposicao "+
  "INNER JOIN proposicao ON tema_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda_proposicao ON agenda_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda ON agenda_proposicao.id_agenda = agenda.id AND agenda.slug = '" + interesse + "' " +
  "INNER JOIN tweet_proposicao ON proposicao.id_proposicao_leggo = tweet_proposicao.id_proposicao_leggo " +
  "INNER JOIN tweet ON tweet_proposicao.id_tweet = tweet.id_tweet AND tweet.created_at BETWEEN '"+
  dataInicial +"' AND '"+ dataFinal + "' AND tweet.id_parlamentar_parlametria = '" + idParlamentar + "' " +
  "INNER JOIN tema ON tema_proposicao.id_tema = tema.id " +
  "GROUP BY tema.slug, agenda.slug) AS res;";

  return q;
}

function QueryEngajamentoAgregadoPorAgendaETema(interesse, tema, dataInicial, dataFinal, idParlamentar) {
  const q = "SELECT " +
  "tema.slug AS tema_slug, " +
  "SUM(tweet.interactions) AS engajamento " +
  "FROM tema_proposicao "+
  "INNER JOIN proposicao ON tema_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda_proposicao ON agenda_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda ON agenda_proposicao.id_agenda = agenda.id AND agenda.slug = '" + interesse + "' " +
  "INNER JOIN tweet_proposicao ON proposicao.id_proposicao_leggo = tweet_proposicao.id_proposicao_leggo " +
  "INNER JOIN tweet ON tweet_proposicao.id_tweet = tweet.id_tweet AND tweet.created_at BETWEEN '"+
  dataInicial +"' AND '"+ dataFinal + "' AND tweet.id_parlamentar_parlametria = '" + idParlamentar + "' " +
  "INNER JOIN tema ON tema_proposicao.id_tema = tema.id AND tema.slug = '" + tema + "' " +
  "GROUP BY tema.slug;";

  return q;
}

module.exports = {
  QueryEngajamentoAgregadoPorAgenda,
  QueryEngajamentoAgregadoPorAgendaETema }
