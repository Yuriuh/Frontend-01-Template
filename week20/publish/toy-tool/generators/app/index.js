var Generator = require('yeoman-generator');

module.exports = class extends Generator {
  // The name `constructor` is important here
  constructor(args, opts) {
    // Calling the super constructor is important so our generator is correctly set up
    super(args, opts);

    // Next, add your custom code
    this.option('babel'); // This method adds support for a `--babel` flag
  }

  collecting() {
    this.log('collecting');
  }

  creating() {
    this.fs.copyTpl(
      this.templatePath('package.json'),
      this.destinationPath('package.json'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('createElement.js'),
      this.destinationPath('src/createElement.js'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('carousel.js'),
      this.destinationPath('src/carousel.js'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('animation.js'),
      this.destinationPath('src/animation.js'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('CarouselClass.js'),
      this.destinationPath('src/CarouselClass.js'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('cssloader.js'),
      this.destinationPath('src/cssloader.js'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('cubicBezier.js'),
      this.destinationPath('src/cubicBezier.js'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('gesture.js'),
      this.destinationPath('src/gesture.js'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('index.html'),
      this.destinationPath('src/index.html'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('ListView.js'),
      this.destinationPath('src/ListView.js'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('main.js'),
      this.destinationPath('src/main.js'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('Panel.js'),
      this.destinationPath('src/Panel.js'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('TabPanel.js'),
      this.destinationPath('src/TabPanel.js'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('webpack.config.js'),
      this.destinationPath('webpack.config.js'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('carousel.css'),
      this.destinationPath('carousel.css'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('add.test.js'),
      this.destinationPath('test/add.test.js'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('add.js'),
      this.destinationPath('src/add.js'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('.nycrc'),
      this.destinationPath('.nycrc'),
      {
        title: 'Templating with Yeoman',
      },
    );
    this.fs.copyTpl(
      this.templatePath('.babelrc'),
      this.destinationPath('.babelrc'),
      {
        title: 'Templating with Yeoman',
      },
    );
    /* this.npmInstall(
      [
        'webpack',
        'webpack-cli',
        'webpack-dev-server',
        'babel-loader',
        '@babel/core',
        '@babel/plugin-transform-react-jsx',
        '@babel/preset-env',
        'html-webpack-plugin',
        'mocha',
        'nyc',
        '@istanbuljs/nyc-config-babel',
        'babel-plugin-istanbul',
      ],
      {
        'save-dev': true,
      },
    ); */
    /* this.fs.copyTpl(this.templatePath('index.html'), this.destinationPath('public/index.html'),
      {
      title: 'Templating with Yeoman'
    }) */
  }
};
