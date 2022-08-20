const renderService = require('../services/render.service');

const healthStatus = (req, res, next) => {
    res.json({'healthy': true});
}

const renderPolaroid = async (req, res, next) => {
    try {
        const domain = req.query.domain;
        const uid = req.query.uid;
        const pages = req.query.pages;
        const type = req.query.type;
        res.json(await renderService.startRender(domain, uid, pages, type || 'polaroid'));
    } catch (err) {
        console.error(`Error while getting programming languages`, err.message);
        next(err);
    }
}

module.exports = {
    healthStatus,
    renderPolaroid
}