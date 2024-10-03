const db = require('../config/db')

const getMilkCompanyPage = async (req, res) => {
    res.render('milk-company');
};

const getAddMilkCompanyPage = async (req, res) => {
    res.render('milkcompany-add');
};

const getMilkSalesPage = async (req, res) => {
    res.render('milk-sales');
};

module.exports = { getMilkCompanyPage, getAddMilkCompanyPage, getMilkSalesPage };