import { Injectable } from '@angular/core';

import * as fs from 'fs';
import * as path from 'path';
// import Epub from 'epub.js';

const json2csv = require('json2csv');
const Epub = window['ePub'];


interface ITaskLine {
    CONTENT: string;
    INDENT: number;
    PRIORITY: number;
    TYPE: string;
    AUTHOR: number;
    RESPONSIBLE: number;
    DATE: string;
    DATE_LANG: string;
    TIMEZONE: string;
}

interface ItocItem {
    href: string;
    id: string;
    level: number;
    order: number;
    properties: string;
    title: string;
}

interface Itoc {
    cfi: string,
    href: string,
    id: string,
    label: string,
    parent: string,
    spinePos: number,
    subitems: Itoc[]
}


@Injectable()
export class ConvertService {
    private indent: number = 1;
    private savePath: string;
    private localLines: ITaskLine[] = [];
    public wrapInTask: boolean = true;
    private fields = [
        'CONTENT',
        'INDENT',
        'PRIORITY',
        'TYPE',
        'AUTHOR',
        'RESPONSIBLE',
        'DATE',
        'DATE_LANG',
        'TIMEZONE'
    ];

    process(file: any, path: string) {
        this.savePath = path;
        fs.stat(file.path, (err, stats) => {
            if (!err) {
                if (stats.isDirectory()) {
                    this.convertDirectory(file.path, file.name);
                } else if (stats.isFile) {
                    switch (file.type) {
                        case 'application/epub+zip':
                            this.convertEpub(file.path);
                            break;
                    }
                }
            }
        });
    }

    convertDirectory(path: string, name: string): boolean {

        this.recursiveRead(path, (err, results, lines: ITaskLine[]) => {
            if (err) throw err;
            let csv = json2csv({
                data: this.wrapInTask ? [{
                    CONTENT: name,
                    INDENT: 0,
                    PRIORITY: 4,
                    TYPE: 'task',
                    AUTHOR: 0,
                    RESPONSIBLE: 0,
                    DATE: '',
                    DATE_LANG: 'en',
                    TIMEZONE: ''
                }].concat(lines) : lines, fields: this.fields
            });
            fs.writeFile(this.savePath + '/template.csv', csv, function(err) {
                if (err) throw err;
                console.log('file saved');
            });
        });

        return true;
    }

    convertEpub(path: string): boolean {

        var epub = new Epub(path);
        console.log(epub);
        epub.on('book:ready', () => {
            let lines: ITaskLine[] = this.bookConvert(epub.toc, epub.metadata.bookTitle);
            let csv = json2csv({ data: lines, fields: this.fields });
            fs.writeFile(this.savePath + '/template.csv', csv, function(err) {
                if (err) throw err;
                console.log('file saved');
            });
        });

        return true;
    }

    bookConvert(tocArr: Itoc[], name: string): ITaskLine[] {
        let self = this;

        let lines: ITaskLine[] = this.wrapInTask ? [{
            CONTENT: name,
            INDENT: 0,
            PRIORITY: 4,
            TYPE: 'task',
            AUTHOR: 0,
            RESPONSIBLE: 0,
            DATE: '',
            DATE_LANG: 'en',
            TIMEZONE: ''
        }] : [];

        const recursiveTask = (toc: Itoc, indent: number) => {
            lines.push({
                CONTENT: toc.label.replace(/\n|\r/g, ""),
                INDENT: indent,
                PRIORITY: 4,
                TYPE: 'task',
                AUTHOR: 0,
                RESPONSIBLE: 0,
                DATE: '',
                DATE_LANG: 'en',
                TIMEZONE: ''
            });

            toc.subitems && toc.subitems.forEach((e) => {
                recursiveTask(e, indent + 1);
            });
        }

        tocArr.forEach(element => {
            recursiveTask(element, 1);
        });
        return lines;
    }

    recursiveRead(dir, done) {
        let self = this;
        let results = [];
        let lines = [];
        fs.readdir(dir, (err, list) => {
            if (err) return done(err);
            let i = 0;
            (function next() {
                let file = list[i++];
                if (!file) {
                    self.indent = 1;
                    return done(null, results, lines);
                }
                let line: ITaskLine = {
                    CONTENT: file,
                    INDENT: self.wrapInTask ? self.indent + 1 : self.indent,
                    PRIORITY: 4,
                    TYPE: 'task',
                    AUTHOR: 0,
                    RESPONSIBLE: 0,
                    DATE: '',
                    DATE_LANG: 'en',
                    TIMEZONE: ''
                }
                lines.push(line);
                file = dir + '/' + file;
                fs.stat(file, (err, stat) => {
                    if (stat && stat.isDirectory()) {
                        self.indent++;
                        self.recursiveRead(file, (err, res, lns) => {
                            results = results.concat(res);
                            lines = lines.concat(lns);
                            next();
                        });
                    } else {
                        results.push(file);
                        next();
                    }
                });
            })();
        });
    };

}
