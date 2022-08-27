const renderService = require('../services/polaroid.service');

const healthStatus = (req, res, next) => {
    res.json({'healthy': true});
}

const render = async (req, res, next) => {
    try {
        const domain = req.query.domain;
        const uid = req.query.uid;
        const pages = req.query.pages;
        const type = req.query.type;
        renderService.startRender(domain, uid, pages, type || 'polaroid');
        res.json({'status': 'launched'});
    } catch (err) {
        console.error(`Error while getting programming languages`, err.message);
        next(err);
    }
}

const render2 = async (req, res, next) => {
    try {
        const domain = req.query.domain;
        const uid = req.query.uid;
        const pages = req.query.pages;
        const userPreview = req.query.userPreview;
        console.log(userPreview);
        if(userPreview == false){
            const result = await renderService.testRender(domain, uid, pages, userPreview);
            res.json(result);
        }else{
            res.json([]);
        }
    } catch (err) {
        console.error(`Error while getting programming languages`, err.message);
        next(err);
    }
}

module.exports = {
    healthStatus,
    render2,
    render
}