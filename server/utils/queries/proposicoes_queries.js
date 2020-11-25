function QueryProposicoesComMaisTweetsPorParlamentar(interesse, dataInicial, dataFinal, id_parlamentar, qtd) {
  const q ="SELECT " +
    "tweet_proposicao.id_proposicao_leggo, COUNT(tweet_proposicao.id_tweet) " + 
    "FROM " + 
    "tweet_proposicao " +
    "INNER JOIN tweet ON tweet_proposicao.id_tweet = tweet.id_tweet " +
    "AND tweet.id_parlamentar_parlametria = '" + id_parlamentar + "' " +
    "AND tweet.created_at BETWEEN '" + dataInicial + "' AND '" + dataFinal + "' " +
    "INNER JOIN agenda_proposicao ON agenda_proposicao.id_proposicao_leggo = tweet_proposicao.id_proposicao_leggo " +
    "INNER JOIN agenda ON agenda_proposicao.id_agenda = agenda.id AND agenda.slug = '" + interesse + "' " +
    "GROUP BY tweet_proposicao.id_proposicao_leggo " +
    "HAVING COUNT(tweet_proposicao.id_tweet) > 0 " +
    "ORDER BY 2 DESC " +
    "LIMIT " + qtd + " ";
  ;
  return q;
}

function QueryProposicoesComMaisTweetsPorTemaEParlamentar(tema, interesse, dataInicial, dataFinal, id_parlamentar, qtd) {
  const q ="SELECT " +
    "tweet_proposicao.id_proposicao_leggo, COUNT(tweet_proposicao.id_tweet) " + 
    "FROM " + 
    "tweet_proposicao " +
    "INNER JOIN tweet ON tweet_proposicao.id_tweet = tweet.id_tweet " +
    "AND tweet.id_parlamentar_parlametria = '" + id_parlamentar + "' " +
    "AND tweet.created_at BETWEEN '" + dataInicial + "' AND '" + dataFinal + "' " +
    "INNER JOIN agenda_proposicao ON agenda_proposicao.id_proposicao_leggo = tweet_proposicao.id_proposicao_leggo " +
    "INNER JOIN agenda ON agenda_proposicao.id_agenda = agenda.id AND agenda.slug = '" + interesse + "' " +
    "INNER JOIN tema_proposicao on tweet_proposicao.id_proposicao_leggo = tema_proposicao.id_proposicao_leggo " +
    "INNER JOIN tema ON tema_proposicao.id_tema = tema.id AND tema.slug = '" + tema + "' " +
    "GROUP BY tweet_proposicao.id_proposicao_leggo " +
    "HAVING COUNT(tweet_proposicao.id_tweet) > 0 " +
    "ORDER BY 2 DESC " +
    "LIMIT '" + qtd + "' ";
  ;
  return q;
}

module.exports = {
  QueryProposicoesComMaisTweetsPorParlamentar,
  QueryProposicoesComMaisTweetsPorTemaEParlamentar
}
