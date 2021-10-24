const ACAO = (req, res, next) => {
  res.header({ "Access-Control-Allow-Origin": "http://localhost:3000" });
  next();
};

module.exports = ACAO;
