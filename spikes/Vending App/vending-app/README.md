[![Angular Logo](./logo-angular.jpg)](https://angular.io/) [![Electron Logo](./logo-electron.jpg)](https://electron.atom.io/)

# Introduction

Angular 6(+) and Electron (Typescript + SASS + Hot Reload) Desktop application.

Currently runs with:

- Angular v6.0.5
- Electron v2.0.3
- Electron Builder v20.13.4

With this sample, you can :

- Run your app in a local development environment with Electron & Hot reload
- Run your app in a production environment
- Package your app into an executable file for Linux, Windows & Mac

## Getting Started

If you want to generate Angular components with Angular-cli , you **MUST** install `@angular/cli` in npm global context.  
Please follow [Angular-cli documentation](https://github.com/angular/angular-cli) if you had installed a previous version of `angular-cli`.

``` bash
npm install -g @angular/cli
```
Ubuntu users, libgconf-2.so.4 is now required for Ubuntu systems. You will **may** need to install libgconf-2-4 if it not already.
``` bash
apt-get install libgconf-2-4
```

## To build for development

- **in a terminal window** -> npm start  

Voila! You can use your Angular + Electron app in a local development environment with hot reload !

The application code is managed by `main.ts`. In this sample, the app runs with a simple Angular App (http://localhost:4200) and an Electron window.  
The Angular component contains an example of Electron and NodeJS native lib import.  
You can deactivate "Developer Tools" by commenting `win.webContents.openDevTools();` in `main.ts`.

## Included Commands

|Command|Description|
|--|--|
|`npm run ng:serve:web`| Execute the app in the browser |
|`npm run build`| Build the app. Your built files are in the /dist folder. |
|`npm run build:prod`| Build the app with Angular aot. Your built files are in the /dist folder. |
|`npm run electron:local`| Builds your application and start electron
|`npm run electron:linux`| Builds your application and creates an app consumable on linux system |
|`npm run electron:windows`| On a Windows OS, builds your application and creates an app consumable in windows 32/64 bit systems |
|`npm run electron:mac`|  On a MAC OS, builds your application and generates a `.app` file of your application that can be run on Mac |

**Your application is optimised. Only /dist folder and node dependencies are included in the executable.**

## Browser mode

Maybe you want to execute the application in the browser with hot reload ? You can do it with `npm run ng:serve:web`.  
Note that you can't use Electron or NodeJS native libraries in this case. Please check `providers/electron.service.ts` to watch how conditional import of electron/Native libraries is done.

## Branch & Packages version
- Angular 6 & Electron 2 : (master)

## Technologies & Frameworks Documentation
[Typescript](https://www.typescriptlang.org/docs/home.html)<br/>
[Sass](https://sass-lang.com/guide)<br/>
[NodeJS](https://nodejs.org/en/docs/)<br/>
[Bootstrap](http://getbootstrap.com/docs/4.1/getting-started/introduction/)<br/>
[Angular2+](https://angular.io/docs)<br/>
[NG-Bootstrap](https://ng-bootstrap.github.io/#/home)<br/>
[Electron](https://electronjs.org/docs)
