const db = require('../config/db')

const getFeeds = async (req, res) => {
    res.render('feeds');
};

const getAddFeedPage = async (req, res) => {
    res.render('feed-add');
};

const getEditFeedPage = async (req, res) => {
    res.render('feed-edit');
};

const getFeedSalesPage = async (req, res) => {
    res.render('feed-sales');
};

const getFeedPurchasePage = async (req, res) => {
    res.render('feed-purchase');
};

module.exports = { getFeeds, getAddFeedPage, getEditFeedPage, getFeedSalesPage, getFeedPurchasePage };