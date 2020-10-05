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


module.exports = { QueryAtividadeAgregadaPorTema }
