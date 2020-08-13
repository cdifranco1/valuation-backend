const CognitoExpress = require("cognito-express")

const cognitoExpress = new CognitoExpress({
  region: "us-east-1",
  cognitoUserPoolId: "us-east-1_8lnva5DaB",
  tokenUse: "id",
  tokenExpiration: 360000
})

function verifyCognito(req, res, next) {
  const idToken = req.headers.authorization

  if (!idToken) return res.status(401).json("Access token not included in header.")

  cognitoExpress.validate(idToken, (err, response) => {
    if (err) return res.status(401).json({ err })

    req.userId = response.sub
    next()
  })
}

module.exports = verifyCognito