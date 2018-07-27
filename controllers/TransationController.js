const _ = require('lodash');
const validator = require('validator');
const User = require('../models/User');
const Wallet = require('../models/Wallet');
const Deposit = require('../models/Deposit');
const Transaction = require('../models/Transaction')
const {sendSuccess, sendError, setUserInfo, generateUserToken} = require('./base.ctrl');
const Constants = require('../constants/constants');
const ResponseMessages = require('../constants/responseMessages');
const WalletService = require('../services/WalletService');
const DepositService = require('../services/DepositService');
const TransactionService = require('../services/TransactionService')


createTransaction = (req, res) => {
    const {body} = req;
    const user_Id = req.body.user_Id;
    if(!body) return sendError(res, null, 'Fields Must Not Be Empty', 400);
    if(!body.amount) return sendError(res, null, 'Amount Not Specified', 400);
    if(!body.receiver_email) return sendError(res, null, 'Receiver Email ', 400);

    User.findOne({_id: user_Id}).then(user => {
        const transactionObj = new Transaction({
            amount: body.amount,receiver_email: body.receiver_email,
            sender_email: user.email
        })
        TransactionService.createTransaction(transactionObj, user_Id).then(resp => {
            return sendSuccess(res,resp, 'Transaction Init')
        }).catch(err => sendError(res, err, 'Issue with Creating Transaction'))
    })
    
}

module.exports = {createTransaction}