import { Injectable } from '@angular/core';
// import { fileIO } from '../../test-docs/dummy-io';


// If you import a module but never use any of the imported values other than as TypeScript types,
// the resulting javascript file will look as if you never imported the module at all.
import { ipcRenderer, webFrame, remote } from 'electron';
import * as childProcess from 'child_process';
import * as fs from 'fs';
import { exec, cd } from 'shelljs';
import { _getComponentHostLElementNode } from '@angular/core/src/render3/instructions';


@Injectable()
export class ElectronService {

    ipcRenderer: typeof ipcRenderer;
    webFrame: typeof webFrame;
    remote: typeof remote;
    childProcess: typeof childProcess;
    fs: typeof fs;
    exec: typeof exec;
    cd: typeof cd;

    fileSystem: any;
    fileRead: any;
    dirRead: any;

    constructor() {

        this.fileRead = {};
        this.dirRead = {};

        // Conditional imports
        if (this.isElectron()) {
            this.ipcRenderer = window.require('electron').ipcRenderer;
            this.webFrame = window.require('electron').webFrame;
            this.remote = window.require('electron').remote;

            this.childProcess = window.require('child_process');
            this.fs = window.require('fs');
            this.exec = window.require('shelljs').exec;
            this.cd = window.require('shelljs').cd;

            this.fileSystem = {
                /*
                readFileSync: (path: string, encoding: string) => {
                    let content = this.fs.readFileSync(path, encoding);
                    if (this.isImage(path)) {
                        let imageName = this.getImageName(path);
                        let imageData = { imageName: content.toString() };
                        this.fs.writeFileSync(`./test-docs/${imageName}.json`, JSON.stringify(imageData, null, 2));
                        return content;
                    } else {
                        if ((typeof content) === 'string' || (content as any) instanceof String) {
                            this.fileRead[path] = content;
                        } else {
                            this.fileRead[path] = content.toString();
                        }
                        this.fs.writeFileSync('./test-docs/fileRead.json', JSON.stringify(this.fileRead, null, 2));
                        console.log(content);
                        return content;
                    }
                },
                readdirSync: (path: string) => {
                    let content = this.fs.readdirSync(path);
                    this.dirRead[path] = content;
                    this.fs.writeFileSync('./test-docs/dirRead.json', JSON.stringify(this.dirRead, null, 2));
                    return content;
                }
                */
               readFileSync: (path: string, encoding: string) => {
                   return this.fs.readFileSync(path, encoding);
               },
               readdirSync: (path: string) => {
                   return this.fs.readdirSync(path);
               }
            };

        } else {
            this.fileSystem = {
                readFileSync: (path: string, encoding: string) => {
                    if (this.isImage(path)) {
                        let imageName = this.getImageName(path);
                        let image = require(`../test-docs/${imageName}.json`);
                        return Buffer.from(image.imageName.data);
                    } else {
                        let data = require('../test-docs/fileRead.json');
                        if (data[path].type && data[path].type === 'Buffer') {
                            data[path] = Buffer.from(data[path].data);
                        }
                        return data[path];
                    }
                },
                readdirSync: (path: string) => {
                    let data = require('../test-docs/dirRead.json');
                    return data[path];
                }
            } as any;

            this.exec = (st: string, ob: any) => { };
            this.cd = (st: string) => { };
        }

    }

    isElectron = () => {
        return window && window.process && window.process.type;
    }

    isImage = (path: string) => {
        let _isImage = false;
        if ((/\.(jpg|jpeg)$/i).test(path)) {
            _isImage = true;
        } else if ((/\.(png)$/i).test(path)) {
            _isImage = true;
        } else if ((/\.(svg)$/i).test(path)) {
            _isImage = true;
        } else if ((/\.(tiff)$/i).test(path)) {
            _isImage = true;
        }
        return _isImage;
    }

    getImageName = (path: string) => {
        let split = path.split('/');
        let imageName = split[split.length - 1];
        split = imageName.split('.');
        imageName = split[0];
        return imageName;
    }


}
