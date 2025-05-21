// src/config/viewEngine.js

import { engine } from 'express-handlebars';
import * as Allow from '@handlebars/allow-prototype-access';
import HandlebarsLib from 'handlebars';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import registerHelpers from './handlebarsHelpers.js';

const allowPrototypeAccess = Allow.allowInsecurePrototypeAccess || Allow.default || Allow;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default function configureViewEngine(app) {
  const rootPath = path.join(__dirname, '..', '..');
  const globalViewsPath = path.join(rootPath, 'src', 'views');
  const globalLayoutsPath = path.join(globalViewsPath, 'layouts');
  const globalPartialsPath = path.join(globalViewsPath, 'partials');

  // Allow insecure prototype access
  const Handlebars = allowPrototypeAccess(HandlebarsLib);

  // ✅ Register helpers ON the correct Handlebars instance
  registerHelpers(Handlebars);

  console.log('Registered helpers:', Object.keys(Handlebars.helpers));


  app.engine('html', engine({
    extname: '.html',
    defaultLayout: 'main',
    layoutsDir: globalLayoutsPath,
    partialsDir: [globalPartialsPath],
    handlebars: Handlebars,
  }));

  app.set('view engine', 'html');
  app.set('views', globalViewsPath);
}
