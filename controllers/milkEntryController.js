const db = require('../config/db')

const getMilkEntryOne = async (req, res) => {
    res.render('milk-entry-one');
};

const getMilkEntryAll = async (req, res) => {
    res.render('milk-entry-all');
};

module.exports = { getMilkEntryOne, getMilkEntryAll };