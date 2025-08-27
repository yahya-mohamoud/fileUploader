export function checkAuth(req, res, next) {

  if (req.session.data === undefined) {
    return res.redirect('/auth/login')
  }

  res.locals.sessionData = req.session.data || null

  next()
}


