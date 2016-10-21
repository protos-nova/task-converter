
import {Component, PipeTransform} from '@angular/core';
import {NgFor} from '@angular/common';
import {Http} from '@angular/http';

import {ConvertService} from '../convert.service';

import * as fs from 'fs';

@Component({
    selector: 'file-drop',
    templateUrl: './fileDrop/fileDrop.partial.html',
    providers: [ConvertService],
    styleUrls: ['./fileDrop/fileDrop.styles.css']
})
export class FileDropComponent {

    fileDrop: any = null;
    type: string = '';

    constructor(private convertService: ConvertService) { }

    handleDrop(e) {
        var files: File = e.dataTransfer.files;
        var a: File = e.data
        var self = this;
        Object.keys(files).forEach((key) => {
            if (files[key].type === '' || files[key].type === 'application/epub+zip') {
                self.fileDrop = files[key];

                console.log(self.fileDrop);
                fs.stat(self.fileDrop.path, (err, stats) => {
                    if (!err) {
                        if (stats.isDirectory()) {
                            self.type = 'folder';
                        } else if (stats.isFile) {
                            self.type = 'epub';
                        }
                    }
                });

            } else {
                alert('File drop must be a EPUB or Folder!');
            }
        });

        return false;
    }

    processFile() {
        this.convertService.process(this.fileDrop);
    }

    clearFile() {
        this.fileDrop = null;
        this.type = '';
    }

}
