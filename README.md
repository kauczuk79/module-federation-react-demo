# Setup project

## Reuse existing project

In the project you need to be able to change Webpack configuration, because using `react-scripts` there is no possibility to change the config (to add webpack plugins). If you want to prepare existing code to be working as micro frontend, you can use `npm run eject` with your react-scripts based application and try to reuse configs from this manual. This command will expose all configs in the project source and stop using `react-scripts`.

## Creating new project using Webpack 5 from scratch

1.  Init node project of new microservice

    ```bash
    npm init
    ```

1.  Install React dependencies

    ```bash
    npm install --save react react-dom
    npm install --save-dev @types/react @types/react-dom
    ```

1.  Install and configure TypeScript

    ```bash
    npm install --save-dev typescript
    ```

    Then create `tsconfig.json` file with these settings:

    ```json
    {
      "compilerOptions": {
        "strict": true,
        "esModuleInterop": true,
        "outDir": "./dist/",
        "noImplicitAny": true,
        "module": "ES2020",
        "target": "es5",
        "jsx": "react",
        "allowJs": true,
        "moduleResolution": "node",
        "allowSyntheticDefaultImports": true
      }
    }
    ```

1.  Configure and install Webpack

    ```bash
    npm install --save-dev webpack webpack-cli webpack-dev-server
    ```

    Put basic `webpack.config.js` configuration in the project's root:

    ```js
    const path = require("path");

    module.exports = {
      mode: "development",
      output: {
        filename: "bundle.js",
        path: path.resolve(__dirname, "dist"),
      },
      devServer: {
        static: path.join(__dirname, "dist"),
        port: 3000,
        historyApiFallback: {
          index: "/public/index.html",
        },
      },
      resolve: {
        extensions: [".tsx", ".ts", ".js"],
      },
    };
    ```

1.  Configure Babel and presets

    ```bash
    npm install --save-dev @babel/core babel-loader @babel/preset-react @babel/preset-typescript
    ```

    Create a `.babelrc` file:

    ```json
    {
      "presets": ["@babel/preset-react", "@babel/preset-typescript"]
    }
    ```

1.  Integrate Babel with Webpack

    ```js
    module.exports = {
      // ... Existing config
      module: {
        rules: [
          {
            test: /\.(ts|tsx)$/,
            exclude: /node_modules/,
            use: "babel-loader",
          },
        ],
      },
    };
    ```

1.  Create HTML template and configure in webpack

    Create `./public/index.html` file

    ```html
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>Microfrontend</title>
      </head>
      <body>
        <div id="root"></div>
      </body>
    </html>
    ```

    Install `html-webpack-plugin`

    ```bash
    npm install --save-dev html-webpack-plugin
    ```

    Update `webpack.config.js` configuration

    ```js
    const HtmlWebpackPlugin = require("html-webpack-plugin");

    module.exports = {
      // Existing Code
      plugins: [
        new HtmlWebpackPlugin({
          template: "./public/index.html",
        }),
      ],
    };
    ```

1.  Create first component and bootstrap it in the HTML

    The layout of these files should be like that to prevent errors sharing dependencies between multiple micro frontends. It is explained in [this](https://www.linkedin.com/pulse/uncaught-error-shared-module-available-eager-rany-elhousieny-phd%E1%B4%AC%E1%B4%AE%E1%B4%B0) article.

    Create main App component in `./src/App.tsx`

    ```ts
    import React from "react";

    export default function App() {
      return <div>Hello world!</div>;
    }
    ```

    Create `bootstrapApp.tsx` which mounts the main component in the document

    ```ts
    import React from "react";
    import ReactDom from "react-dom/client";
    import App from "./App";

    const root = ReactDom.createRoot(document.getElementById("root")!);

    root.render(<App />);
    ```

    Add main entrypoint of the application for Webpack in `./src/index.ts`

    ```ts
    import("./bootstrapApp");
    ```

1.  Running the project

    Put scripts in the `package.json` file

    ```json
    {
      // ...
      "scripts": {
        "start": "webpack serve --open",
        "build": "webpack --mode production"
      }
    }
    ```

    Run `npm start` and visit `http://localhost:3000`

## Adding micro-frontend functionality to the project

### Exporting micro-frontend

1. Create configuration of the Module Federation plugin

   It is built in Webpack 5 functionality and can be used as plugin in `webpack.config.js`

   ```js
   const { ModuleFederationPlugin } = require("webpack").container;

   const moduleFederationConfig = {
     name: "MicroFrontend1",
     filename: "MicroFrontend1Moudle.js",
     exposes: {
       "./Something": "./src/any/path/to/something",
     },
   };
   ```

   `exposes` object provides what is exported and available outside the module. Property is a ID of the exported thing (used in parent project), value is a path to the file, which should be exposed under this ID.

1. Instantiate plugin and add to the list of the plugins

   ```js
   module.exports = {
     // ...
     plugins: [
       // ...
       new ModuleFederationPlugin(moduleFederationConfig),
     ],
   };
   ```

1. If project is using TypeScript - export types too

   Install TypeScript plugin

   ```bash
   npm install --save-dev @module-federation/typescript axios
   ```

   Add the plugin with the same configuration as it is for `ModuleFederationPlugin`. If project is using external module, you can specify how many times plugin will try to download foreign types from used modules. `axios` is used to download the types during the build.

   ```js
   module.exports = {
     // ...
     plugins: [
       // ...
       new FederatedTypesPlugin({
         federationConfig: moduleFederationConfig,
         typeFetchOptions: {
           maxRetryAttempts: 1,
         },
       }),
     ],
   };
   ```

1. If project wants to reuse shared libraries (like `react` or `react-dom`) you can specify this in the `moduleFederationConfig`.

   ```js
   const moduleFederationConfig = {
     // ...
     shared: {
       react: {
         singleton: true,
       },
       "react-dom": {
         singleton: true,
       },
     },
   };
   ```

   Every library can be configured like it is described [here](https://webpack.js.org/plugins/module-federation-plugin#sharing-libraries)

1. Rebuild the project using `npm run build`. Types are exported to `./dist/@mf-types/`

### Importing micro-frontend

1. Install dependencies in parent project

   ```bash
   npm install --save-dev @module-federation/typescript axios
   ```

1. Configure `ModuleFederationPlugin` and types support

   ```js
   const { ModuleFederationPlugin } = require("webpack").container;
   const { FederatedTypesPlugin } = require("@module-federation/typescript");

   const moduleFederationConfig = {
     name: "ParentApplication",
     filename: "ParentApplicationModule.js",
     shared: {
       react: {
         singleton: true,
       },
       "react-dom": {
         singleton: true,
       },
     },
   };

   module.exports = {
     // ...
     plugins: [
       // ...
       new ModuleFederationPlugin(moduleFederationConfig),
       new FederatedTypesPlugin({
         federationConfig: moduleFederationConfig,
         typeFetchOptions: {
           maxRetryAttempts: 1,
         },
       }),
     ],
   };
   ```

1. Configure remote modules in the parent project configuration

   ```js
   const moduleFederationConfig = {
     // ...
     remotes: {
       MicroFrontend1:
         "MicroFrontend1@http://localhost:3000/ParentApplicationModule.js",
     },
   };
   ```

1. Simple, synchronous usage of import

   ```tsx
   // any React component
   import Something from "MicroFrontend1/Something"; // "Something" is exposed in MicroFrontend1

   const { something1, something2 /* ... */ } =
     require("MicroFrontend1/Something") as typeof Something;
   ```

   Exposed may be component or any other thing from react like Hook, Provider

# Useful links

- [Shared Redux store](https://dev.to/ibrahimshamma99/a-simplified-prospective-in-sharing-redux-store-between-federated-react-apps-1kgm)
