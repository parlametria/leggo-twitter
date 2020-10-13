
function QueryPercentualAtividadeAgregadaPorAgenda(interesse, dataInicial, dataFinal) {
  const q = "SELECT " +
  "res.atividade_twitter AS atividade_twitter,  " +
  "res.slug, " +
  "res.id_parlamentar_parlametria, " +
  "SUM(res.atividade_twitter) OVER (PARTITION BY res.slug, res.id_parlamentar_parlametria) AS total FROM (" +
  "SELECT " +
  "agenda.slug AS slug, " +
  "COUNT(tweet.id_tweet) AS atividade_twitter, " +
  "tweet.id_parlamentar_parlametria AS id_parlamentar_parlametria " +
  "FROM tema_proposicao "+
  "INNER JOIN proposicao ON tema_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda_proposicao ON agenda_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda ON agenda_proposicao.id_agenda = agenda.id " +
  "INNER JOIN tweet_proposicao ON proposicao.id_proposicao_leggo = tweet_proposicao.id_proposicao_leggo " +
  "INNER JOIN tweet ON tweet_proposicao.id_tweet = tweet.id_tweet AND tweet.created_at BETWEEN '"+
  dataInicial +"' AND '"+ dataFinal + "' " +
  "INNER JOIN tema ON tema_proposicao.id_tema = tema.id " +
  "GROUP BY agenda.slug, tweet.id_parlamentar_parlametria) AS res " +
  "WHERE res.slug = '" + interesse + "' ORDER BY total DESC;";

  return q;
}

function QueryPercentualAtividadeAgregadaPorAgendaETema(interesse, tema, dataInicial, dataFinal) {
  const q = "SELECT " +
  "tt.tema_slug, " +
  "tt.atividade_twitter, " +
  "tt.total, " +
  "tt.id_parlamentar_parlametria " +
  "FROM (" +
  "SELECT " +
  "res.tema_slug AS tema_slug, " +
  "res.atividade_twitter AS atividade_twitter, " +
  "res.id_parlamentar_parlametria AS id_parlamentar_parlametria, " +
  "SUM(res.atividade_twitter) OVER (" +
  "PARTITION BY res.slug, res.id_parlamentar_parlametria) AS total " +
  "FROM (" +
  "SELECT " +
  "agenda.slug, tema.slug AS tema_slug, " +
  "tweet.id_parlamentar_parlametria AS id_parlamentar_parlametria, " +
  "COUNT(tweet.id_tweet) AS atividade_twitter " +
  "FROM tema_proposicao "+
  "INNER JOIN proposicao ON tema_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda_proposicao ON agenda_proposicao.id_proposicao_leggo = proposicao.id_proposicao_leggo " +
  "INNER JOIN agenda ON agenda_proposicao.id_agenda = agenda.id AND agenda.slug = '" + interesse + "' " +
  "INNER JOIN tweet_proposicao ON proposicao.id_proposicao_leggo = tweet_proposicao.id_proposicao_leggo " +
  "INNER JOIN tweet ON tweet_proposicao.id_tweet = tweet.id_tweet AND tweet.created_at BETWEEN '"+
  dataInicial +"' AND '"+ dataFinal + "' " +
  "INNER JOIN tema ON tema_proposicao.id_tema = tema.id " +
  "GROUP BY tema.slug, agenda.slug, tweet.id_parlamentar_parlametria) AS res) AS tt " +
  "where tt.tema_slug = '" + tema + "';";

  return q;
}

module.exports = {
  QueryPercentualAtividadeAgregadaPorAgenda,
  QueryPercentualAtividadeAgregadaPorAgendaETema }
