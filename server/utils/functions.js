function calculaMaxAtividade(tweets, id_parlamentar, precisaProcessar) {

  let data = {
    id_parlamentar_parlametria: id_parlamentar,
    atividade_twitter: 0,
    max_atividade_twitter: 0,
    min_atividade_twitter: 0,
  };

  let tweetsProcessados = tweets;

  if (tweets.length > 0) {
    if (precisaProcessar === true) {
      tweetsProcessados = tweets.map((tweet) => tweet.get({ plain: true }));
    }

    const max_atividade_twitter = Math.max.apply(
      Math,
      tweetsProcessados.map(function (o) {
        return o.atividade_twitter;
      })
    );

    data.max_atividade_twitter = max_atividade_twitter;

    const atividade_twitter = tweetsProcessados.filter((el) => {
      return el.id_parlamentar_parlametria == id_parlamentar;
    });

    if (atividade_twitter.length > 0) {
      data.atividade_twitter = atividade_twitter[0].atividade_twitter;
    }
  }

  return data;
}

module.exports = calculaMaxAtividade;
