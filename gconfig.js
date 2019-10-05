'use strict';
let spritesmith = function (name) {
  return {
    imgName: `images/${name}.png`,
    cssName: `wxss/${name}.scss`,
    padding: 5,
    algorithm: 'binary-tree',
    cssTemplate: function (data) {
      var arr=[];
      arr.push(`[class^="${name}-"] {display: inline-block;background-size: ${data.spritesheet.width}rpx}\n`);
      data.sprites.forEach(function (sprite) {
        arr.push(`.${name}-${sprite.name} {width: ${sprite.width}rpx;height: ${sprite.height}rpx;background-position: ${sprite.offset_x}rpx ${sprite.offset_y}rpx;}\n`);
      });
      return arr.join("");
    }
  }
}
module.exports = {
  clean: {
    src: [
      './src/**/sprite.png',
      './src/**/views/*.wxss',
      '!./src/**/pages/*.wxss'
    ]
  },
  wxss: {
    src: [
      '!./src/**/wxss/**/*.scss',
      './src/**/*.scss'
    ],
    dest: './src',
    autoprefixer: {
      browsers: ['last 3 versions'],
      cascade: false,
      remove:false
    },
    minifyCss: {
      advanced: false,
      compatibility: "ie7",
      keepBreaks: true,
      keepSpecialComments: '*'
    },
    rename: {
      extname: ".wxss"
    }
  },
  sprite: {
    src: './sprite/*.png',
    dest: './src/miniprogram/assets',
    spritesmith: spritesmith('sprite')
  }
}