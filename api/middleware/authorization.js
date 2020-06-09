const jwt = require('jsonwebtoken')
const OktaJwtVerifier = require("@okta/jwt-verifier")


const authorization = async (req, res, next) => {
  const authErr = { message: "Invalid credentials."}
  const jwtVerifier = new OktaJwtVerifier({
    issuer: "https://dev-712850.okta.com/oauth2/default"
  })
  
  const accessToken = req.headers.authorization
  const decodedAccessToken = jwt.decode(accessToken)
  
  if (decodedAccessToken) { 
    const userId = decodedAccessToken.uid 
    req.userId = userId
  }

  try {
    const valid = await jwtVerifier.verifyAccessToken(accessToken, "api://default")
    
    if (!valid) return res.status(401).json(authErr)

    next()

  } catch(err){
    
    next(err)
  }
}

module.exports = authorization