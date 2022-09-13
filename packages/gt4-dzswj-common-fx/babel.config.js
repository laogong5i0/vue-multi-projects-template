module.exports = () => ({
    presets: [
        [require('@babel/preset-env'), {
            targets: {
                browsers: ['last 2 versions', 'ie >=9']
            },
            modules: false
        }]
    ],
    plugins: [
        require("@babel/plugin-syntax-dynamic-import"),
        [require("@babel/plugin-proposal-decorators"), { legacy: true }],
        [require("@babel/plugin-proposal-class-properties"), { loose: true }],  // 松散模式
        require("@babel/plugin-proposal-object-rest-spread")
    ]
});