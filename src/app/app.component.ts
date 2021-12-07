import { Component, Inject, LOCALE_ID, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { NavigationEnd, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { RoutesConfig } from './configs/routes.config';
import { UtilsHelperService } from './modules/core/services/utils-helper.service';

declare const Modernizr;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  isOnline: boolean;

  constructor(
    private title: Title,
    private meta: Meta,
    private snackBar: MatSnackBar,
    private router: Router,
    private renderer: Renderer2,
    @Inject(DOCUMENT) doc: Document,
    @Inject(LOCALE_ID) locale: string,
    @Inject(PLATFORM_ID) private platformId: object
  ) {
    if (isPlatformBrowser(this.platformId)) {
      this.isOnline = navigator.onLine;
      renderer.setAttribute(doc.documentElement, 'lang', locale);
    } else {
      this.isOnline = true;
    }
  }

  ngOnInit() {
    this.title.setTitle('App title');

    this.onEvents();
    this.checkBrowser();
  }

  onEvents() {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd) {
        switch (event.urlAfterRedirects) {
          case '/':
            this.meta.updateTag({
              name: 'description',
              content: 'Home meta description'
            });
            break;
          case '/' + RoutesConfig.routesNames.hero.basePath:
            this.title.setTitle('Heroes list');
            this.meta.updateTag({
              name: 'description',
              content: 'Heroes meta description'
            });
            break;
        }
      }
    });
  }

  checkBrowser() {
    if (isPlatformBrowser(this.platformId)) {
      if (UtilsHelperService.isBrowserValid()) {
        this.checkBrowserFeatures();
      } else {
        this.snackBar.open(
          'Change your browser',
          'OK'
        );
      }
    }
  }

  checkBrowserFeatures() {
    let supported = true;
    for (const feature in Modernizr) {
      if (
        Modernizr.hasOwnProperty(feature) &&
        typeof Modernizr[feature] === 'boolean' &&
        Modernizr[feature] === false
      ) {
        supported = false;
        break;
      }
    }

    if (!supported) {
      this.snackBar.open('Update your browser', 'OK');
    }

    return supported;
  }
}