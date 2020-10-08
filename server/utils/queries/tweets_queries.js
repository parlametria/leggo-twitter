function QueryAtividadeAgregadaPorTema(tema, interesse) {
  const q = "SELECT " +
  "tweet.id_parlamentar_parlametria, " +
  "COUNT(tweet.id_parlamentar_parlametria) AS atividade_twitter " +
  "FROM tema_proposicao "+
  "INNER JOIN proposicao ON tema_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda_proposicao ON agenda_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda ON agenda_proposicao.id_agenda = agenda.id AND agenda.slug = '" + interesse + "' " +
  "INNER JOIN tweet_proposicao ON proposicao.id_proposicao_leggo = tweet_proposicao.id_proposicao_leggo " +
  "INNER JOIN tweet ON tweet_proposicao.id_tweet = tweet.id_tweet " +
  "INNER JOIN tema ON tema_proposicao.id_tema = tema.id AND tema.slug = '" + tema + "' " +
  "GROUP BY tweet.id_parlamentar_parlametria;";

  ;
  return q;
}

function QueryPercentualAtividadeAgregadaPorAgenda(interesse, dataInicial, dataFinal, idParlamentar) {
  const q = "SELECT " +
  "res.tema_slug AS tema_slug, res.atividade_twitter AS atividade_twitter, " +
  "SUM(res.atividade_twitter) OVER (PARTITION BY res.slug) AS total FROM (" +
  "SELECT " +
  "agenda.slug, tema.slug AS tema_slug, " +
  "COUNT(tweet.id_tweet) AS atividade_twitter " +
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

function QueryPercentualAtividadeAgregadaPorAgendaETema(interesse, tema, dataInicial, dataFinal, idParlamentar) {
  const q = "SELECT tt.tema_slug, tt.atividade_twitter, tt.total " +
  "FROM (" +
  "SELECT " +
  "res.tema_slug AS tema_slug, res.atividade_twitter AS atividade_twitter, " +
  "SUM(res.atividade_twitter) OVER (PARTITION BY res.slug) AS total FROM (" +
  "SELECT " +
  "agenda.slug, tema.slug AS tema_slug, " +
  "COUNT(tweet.id_tweet) AS atividade_twitter " +
  "FROM tema_proposicao "+
  "INNER JOIN proposicao ON tema_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda_proposicao ON agenda_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda ON agenda_proposicao.id_agenda = agenda.id AND agenda.slug = '" + interesse + "' " +
  "INNER JOIN tweet_proposicao ON proposicao.id_proposicao_leggo = tweet_proposicao.id_proposicao_leggo " +
  "INNER JOIN tweet ON tweet_proposicao.id_tweet = tweet.id_tweet AND tweet.created_at BETWEEN '"+
  dataInicial +"' AND '"+ dataFinal + "' AND tweet.id_parlamentar_parlametria = '" + idParlamentar + "' " +
  "INNER JOIN tema ON tema_proposicao.id_tema = tema.id " +
  "GROUP BY tema.slug, agenda.slug) AS res) AS tt " +
  "where tt.tema_slug = '" + tema + "';";

  return q;
}

module.exports = {
  QueryAtividadeAgregadaPorTema,
  QueryPercentualAtividadeAgregadaPorAgenda,
  QueryPercentualAtividadeAgregadaPorAgendaETema }
