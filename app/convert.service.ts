import { Injectable } from '@angular/core';



import * as fs from 'fs';
import * as path from 'path';

const json2csv = require('json2csv');

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

@Injectable()
export class ConvertService {
    private indent: number = 1;
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

    process(file: any) {
        fs.stat(file.path, (err, stats) => {
            if (!err) {
                if (stats.isDirectory()) {
                    this.convertDirectory(file.path);
                } else if (stats.isFile) {

                }
            }
        });
    }

    convertDirectory(path: string): boolean {

        this.recursiveRead(path, (err, results, lines: ITaskLine[]) => {
            if (err) throw err;
            console.log(lines);
            var csv = json2csv({ data: lines, fields: this.fields });
            fs.writeFile('file.csv', csv, function (err) {
                if (err) throw err;
                console.log('file saved');
            });
        });

        return true;
    }

    convertEpub(value: string): boolean {

        return true;
    }

    recursiveRead(dir, done) {
        let that = this;
        let results = [];
        let lines = [];
        fs.readdir(dir, (err, list) => {
            if (err) return done(err);
            let i = 0;
            (function next() {
                let file = list[i++];
                if (!file) {
                    that.indent = 1;
                    return done(null, results, lines);
                }
                let line: ITaskLine = {
                    CONTENT: file,
                    INDENT: that.indent,
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
                        that.indent++;
                        that.recursiveRead(file, (err, res, lns) => {
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