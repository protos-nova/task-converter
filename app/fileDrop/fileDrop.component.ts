
import { Component, PipeTransform, ChangeDetectorRef } from '@angular/core';
import { Http } from '@angular/http';
import * as fs from 'fs';


import { ConvertService } from '../convert.service';



@Component({
    selector: 'file-drop',
    templateUrl: './fileDrop/fileDrop.partial.html',
    providers: [ConvertService],
    styleUrls: ['./fileDrop/fileDrop.styles.css']
})
export class FileDropComponent {
    savePath: string = '';
    fileDrop: any = null;
    type: string = '';

    constructor(private cd: ChangeDetectorRef, private convertService: ConvertService) { }

    onChange(event) {
        var files = event.srcElement.files;
        this.savePath = files[0].path;
    }
    handleDrop(e) {
        var files: File = e.dataTransfer.files;
        var a: File = e.data;
        var self = this;
        Object.keys(files).forEach((key) => {
            if (files[key].type === '' || files[key].type === 'application/epub+zip') {
                self.fileDrop = files[key];

                fs.stat(self.fileDrop.path, (err, stats) => {
                    if (!err) {
                        if (stats.isDirectory()) {
                            self.type = 'folder';
                        } else if (stats.isFile) {
                            self.type = 'book';
                        }
                        this.cd.detectChanges();
                    }
                });

            } else {
                alert('File drop must be a EPUB or Folder!');
            }
        });

        return false;
    }

    processFile() {
        this.convertService.process(this.fileDrop, this.savePath);
    }

    clearFile() {
        this.savePath = '';
        this.fileDrop = null;
        this.type = '';
    }

}
