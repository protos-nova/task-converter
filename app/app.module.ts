import { TruncatePipe } from './shared/pipes/truncate.pipe';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

import { AppComponent } from './app.component';
import { FileDropComponent } from './fileDrop/fileDrop.component';
import { IterativeComponent } from './iterative/iterative.component';
import { HomeComponent } from './home/home.component';


import { enableProdMode, Component } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { HttpModule } from '@angular/http';


@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        // PipeModule.forRoot(),
        RouterModule.forRoot([
            { path: 'iterative', component: IterativeComponent },
            { path: 'filedrop', component: FileDropComponent },
            { path: '', component: FileDropComponent }
        ], { useHash: true })
    ],
    declarations: [
        AppComponent,
        FileDropComponent,
        HomeComponent,
        IterativeComponent,
        TruncatePipe,
    ],
    exports: [TruncatePipe],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor() { }
}
platformBrowserDynamic().bootstrapModule(AppModule);
