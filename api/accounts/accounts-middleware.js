const Account = require('../accounts/accounts-model')

exports.checkAccountPayload = async (req, res, next) => {
  try{
    const name = req.body.name
    const budget = req.body.budget
  
   if(!name || !budget){
     res.status(400).json({ message: "name and budget are required" })
   } else if(typeof name !== 'string') {
    res.status(400).json({ message: "name of account must be a string" })
   } else if(name.trim().length < 3 || name.trim().length > 100){
    res.status(400).json({ message: "name of account must be between 3 and 100" })
   } else if(typeof budget !== 'number'){
    res.status(400).json({ message: "budget of account must be a number" })
   } else if(budget < 0 || budget > 1000000){
    res.status(400).json({ message: "budget of account is too large or too small" })
   } else {
     req.body.name = name.trim()
     next()
   }
  } catch(error){
    next(error)
  }
}

exports.checkAccountNameUnique = async (req, res, next) => {
try {
  const existingAccount = await Account.getAll()
  const result = existingAccount.filter(account => {
    if(account.name === req.body.name.trim()){
      return account
    }
  })

  if(result.length > 0){
    res.status(400).json({ message: "that name is taken" })
  } else {
    next()
  }
} catch(error) {
    next(error)
  }
}

exports.checkAccountId = async (req, res, next) => {
  try {
    const account = await Account.getById(req.params.id)
    if(!account){
      res.status(404).json({ message: "account not found" })
    } else {
      req.account = account
      next()
    }
  } catch(error) {
    next(error)
  }
}
