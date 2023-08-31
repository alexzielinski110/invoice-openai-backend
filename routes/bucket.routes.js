module.exports = (app, router) => {
    const bucket = require('../controllers/bucket.controller')

    router.get('/upload', bucket.upload)

    app.use('/api/bucket', router)
}