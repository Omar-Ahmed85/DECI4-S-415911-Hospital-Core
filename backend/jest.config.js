module.exports = {
    testEnvironment: 'node',
    testTimeout: 30000,
    collectCoverageFrom: ['src/**/*.js'],
    coveragePathIgnorePatterns: ['/node_modules/', '/tests/']
};
