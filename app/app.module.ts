import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import {AppComponent} from './app.component';

import { enableProdMode, Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpModule } from '@angular/http';
console.log(AppComponent)

@NgModule({
    imports: [
        BrowserModule,
        // FormsModule,
        RouterModule.forRoot([
            // { path: 'hero/:id', component: HeroDetailComponent },
            // { path: 'crisis-center', component: CrisisListComponent },
            { path: '', component: AppComponent }
        ],{ useHash: true })
    ],
    declarations: [
        AppComponent,
        // HeroListComponent,
        // HeroDetailComponent
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() { console.log('ping') }
}
platformBrowserDynamic().bootstrapModule(AppModule);
