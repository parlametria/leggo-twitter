function AgregaTema(resultado) {
  const agregaTema = resultado
    .map((tema) => tema.get({ plain: true }))
    .filter((el) => {
      return el.proposicao.proposicao_tweet_proposicao.length > 0;
    });

  const temas = agregaTema.reduce(function (acc, curr) {
    const i = acc.findIndex((x) => x.id == curr.tema.id);
    if (i <= -1) {
      acc.push(curr.tema);
    }

    return acc;
  }, []);

  return temas;
}

function AgregaTweetsPorTema(resultado) {
  const resultadoNovo = resultado.map((tema) => tema.get({ plain: true }));

  console.log(resultadoNovo);

  const agregadoPorTema = resultadoNovo
    .filter((el) => {
      return el.proposicao.proposicao_tweet_proposicao.length > 0;
    })
    .reduce(function (acc, curr) {
      let objFiltrado = acc.filter((el) => {
        return el.id_tema === curr.id_tema;
      });

      if (objFiltrado.length === 0) {
        acc.push({
          id_tema: curr.id_tema,
          tweetsParlamentares: curr.proposicao.proposicao_tweet_proposicao,
        });
      } else {
        const newTweetsParlamentares = objFiltrado[0].tweetsParlamentares.concat(
          curr.proposicao.proposicao_tweet_proposicao
        );
        acc = acc.map((obj) =>
          obj.id_tema === curr.id_tema
            ? { ...obj, tweetsParlamentares: newTweetsParlamentares }
            : obj
        );
      }

      return acc;
    }, []);

  const data = agregadoPorTema[0].tweetsParlamentares.reduce(function (
    acc,
    curr
  ) {
    let objFiltrado = acc.filter((el) => {
      return el.id_parlamentar_parlametria === curr.tweet.id_parlamentar;
    });

    if (objFiltrado.length === 0) {
      acc.push({
        id_parlamentar_parlametria: curr.tweet.id_parlamentar,
        atividade_twitter: 1,
      });
    } else {
      const newTweets = objFiltrado[0].atividade_twitter + 1;
      acc = acc.map((obj) =>
        obj.id_parlamentar_parlametria === curr.tweet.id_parlamentar
          ? { ...obj, atividade_twitter: newTweets }
          : obj
      );
    }
    return acc;
  },
  []);

  return data;
}

function AgregaTweetsPorTemaEParlamentar(tweets, id_parlamentar) {
  let data = {
    id_parlamentar_parlametria: id_parlamentar,
    atividade_twitter: 0,
    max_atividade_twitter: 0,
    min_atividade_twitter: 0,
  };

  if (tweets.length > 0) {
    const tweetsPorTema = AgregaTweetsPorTema(tweets);

    const max_atividade_twitter = Math.max.apply(
      Math,
      tweetsPorTema.map(function (o) {
        return o.atividade_twitter;
      })
    );
    const min_atividade_twitter = Math.min.apply(
      Math,
      tweetsPorTema.map(function (o) {
        return o.atividade_twitter;
      })
    );

    data.max_atividade_twitter = max_atividade_twitter;
    data.min_atividade_twitter = min_atividade_twitter;

    const atividade_twitter = tweetsPorTema.filter((el) => {
      return el.id_parlamentar_parlametria == id_parlamentar;
    });

    if (atividade_twitter.length > 0) {
      data.atividade_twitter = atividade_twitter[0].atividade_twitter;
    }
  }

  return data;
}

module.exports = {
  AgregaTweetsPorTema,
  AgregaTweetsPorTemaEParlamentar,
  AgregaTema,
};
