module.exports = ({file, options, env}) => ({
    plugins: {
        'autoprefixer': {browsers: 'last 5 version'}
    }
});