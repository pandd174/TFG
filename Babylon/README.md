# babylonjs-ts-template
start a babylonjs typescript project

* npm install
* npm run build
* npm run watch

Read more at https://medium.com/the-innovation/babylon-js-typescript-project-setup-for-the-impatient-d8c71b4a57ad

Thanks for hrkt
https://github.com/hrkt/babylonjs-typescript-webpack-boilerplate

# TODO MANUALLY

* npm init
* npm install --save-dev typescript webpack ts-loader webpack-cli
* npm install --save babylonjs@preview babylonjs-loaders@preview babylonjs-gui@preview

**Create a file called webpack.config.js**
```js
const path = require('path')

module.exports = {
    mode: "development",
    entry: {
        app: "./src/app.ts"
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },
    resolve: {
        extensions: ['.ts', 'tsx', '.js']
    },
    devtool: 'source-map',
    plugins: [],
    module: {
        rules: [{
            test: /\.tsx?$/,
            loader: 'ts-loader',
            exclude: /node_modules/
        }]
    }
}
```
**Create tsconfig.json**
```json
{
  "compileOnSave": true,
  "compilerOptions": {
    "target": "es5",              
    "module": "es2015",  
    "sourceMap": true,    
    "outDir": "./dist", 
    "types": [
      "babylonjs",
      "babylonjs-gui",
      "babylonjs-materials"
    ]                     
  },
  "include": [
    "src/**/*"
  ],
  "exclude": [
    "node_modules",
    "**/*.spec.js"
  ]
}
```

The file of package.json is generated automatically by npm. Add 2 lines under scripts.

```
"scripts": {
    "build": "webpack",
    "watch": "webpack -w",
    "test": "echo \"Error: no test specified\" && exit 1"
},
```

A very basic **index.html**

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Six</title>
    <style>
        html,body {overflow: hidden;width: 100%;height: 100%;margin: 0;padding: 0;}
        #renderCanvas {width: 100%;height: 100%;touch-action: none;}
    </style>
</head>
<body>
    <canvas id="renderCanvas" touch-action="none"></canvas>
    <script src="dist/app.js"></script>
</body>
</html>
```

Create a folder called src for typescript programs. This is where you do actual coding. Create a file called **app.ts** under this folder. (This is defined under entry section in webpack.config.js)

```ts
import MyScene from './my-scene'
window.addEventListener('DOMContentLoaded', () => {
    // Create the game using the 'renderCanvas'.
    let game = new MyScene('renderCanvas');

    // Create the scene.
    game.createScene();

    // Start render loop.
    game.doRender();
  });
```