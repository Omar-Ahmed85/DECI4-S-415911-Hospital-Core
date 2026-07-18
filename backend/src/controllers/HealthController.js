class HealthController {
    async check(req, res) {
        res.json({ status: 'healthy' });
    }
}

module.exports = new HealthController();
