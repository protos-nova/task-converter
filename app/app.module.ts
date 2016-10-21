import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {FileDropComponent} from './fileDrop/fileDrop.component';
import {HomeComponent} from './home/home.component';

import { enableProdMode, Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpModule } from '@angular/http';


@NgModule({
    imports: [
        BrowserModule,
        // FormsModule,
        RouterModule.forRoot([
            // { path: 'hero/:id', component: HeroDetailComponent },
            // { path: 'file-drop', component: FileDropComponent },
            { path: '', component: HomeComponent }
        ], { useHash: true })
    ],
    declarations: [
        AppComponent,
        FileDropComponent,
        HomeComponent
        // HeroDetailComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() { console.log('ping') }
}
platformBrowserDynamic().bootstrapModule(AppModule);
