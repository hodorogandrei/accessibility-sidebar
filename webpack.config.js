const path = require('path');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  
  return {
    entry: {
      'accessibility-sidebar': './src/index.js',
      'accessibility-sidebar.min': './src/index.js'
    },
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: '[name].js',
      library: 'AccessibilitySidebar',
      libraryTarget: 'umd',
      globalObject: 'typeof self !== \'undefined\' ? self : this'
    },
    module: {
      rules: [
        {
          test: /\.(js|jsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-react']
            }
          }
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.js', '.jsx']
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          test: /\.min\.js$/,
          terserOptions: {
            compress: {
              drop_console: true,
              drop_debugger: true
            },
            mangle: true
          }
        })
      ]
    },
    externals: {
      react: {
        commonjs: 'react',
        commonjs2: 'react',
        amd: 'React',
        root: 'React'
      },
      'react-dom': {
        commonjs: 'react-dom',
        commonjs2: 'react-dom',
        amd: 'ReactDOM',
        root: 'ReactDOM'
      }
    }
  };
};