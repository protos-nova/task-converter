/// <reference path="../typings/index.d.ts" />

import {Component, PipeTransform} from '@angular/core';
import {NgFor} from '@angular/common';
import { Http } from '@angular/http';
import { RouterOutlet } from '@angular/router';
import {ByteFormatPipe} from './byte-format.pipe';
import {ConvertService} from './convert.service';

import * as fs from 'fs';

@Component({
  selector: 'app',
  templateUrl: './app.component.partial.html',
  styleUrls: ['./styles.css']
})
export class AppComponent {

  constructor() { }

}
