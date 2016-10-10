/// <reference path="../typings/index.d.ts" />

import {bootstrap} from '@angular/platform-browser-dynamic';
import {Component, PipeTransform} from '@angular/core';
import {NgFor} from '@angular/common';
import { Http, HTTP_PROVIDERS } from '@angular/http';

import {ByteFormatPipe} from './byte-format.pipe';
import {ConvertService} from './convert.service';


@Component({
  selector: 'app',
  pipes: [ByteFormatPipe],
  templateUrl: './app.component.partial.html',
  providers: [HTTP_PROVIDERS, ConvertService],
  styleUrls: ['styles.css']
})
export class App {

  images: Array<Object> = [];

  constructor(private http: Http, private convertService: ConvertService) {
    console.log(this.convertService)
  }

  handleDrop(e) {
    var files: File = e.dataTransfer.files;
    var a: File = e.data
    var self = this;
    Object.keys(files).forEach((key) => {
      if (files[key].type === '' || files[key].type === 'application/epub+zip') {
        this.convertService.process(files[key]);
        self.images.push(files[key]);
      } else {
        alert('File drop must be a EPUB or Folder!');
      }

    });

    return false;
  }

  imageStats() {

    let sizes: Array<number> = [];
    let totalSize: number = 0;

    this
      .images
      .forEach((image: File) => sizes.push(image.size));

    sizes
      .forEach((size: number) => totalSize += size);

    return {
      size: totalSize,
      count: this.images.length
    }

  }

}

bootstrap(App);