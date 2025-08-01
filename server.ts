import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { AppServerModule } from './src/main.server';
import { html as beautifyHtml } from 'js-beautify';

export function app(): express.Express {
  const server = express();
  const distFolder = join(process.cwd(), 'dist/reecosys-template/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  server.engine(
    'html',
    ngExpressEngine({
      bootstrap: AppServerModule,
    }) as any
  );

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.get(
    '*.*',
    express.static(distFolder, {
      maxAge: '1y',
    })
  );

  // 🧽 Beautify HTML response before sending
  server.get('*', (req, res) => {
    res.render(
      indexHtml,
      {
        req,
        providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }],
      },
      (err: unknown, html: string | undefined) => {
        if (err) {
          console.error('❌ SSR Render Error:', err);
          res.status(500).send(err instanceof Error ? err.message : 'SSR Error');
          return; // ✅ Make sure to return here
        }

        if (html) {
          const prettyHtml = beautifyHtml(html, {
            indent_size: 2,
            preserve_newlines: true,
            max_preserve_newlines: 1,
            unformatted: [],
          });

          res.send(prettyHtml);
        } else {
          res.status(500).send('SSR Error: No HTML output');
        }

        return; // ✅ Ensures all code paths return
      }
    );
  });

  return server;
}

function run(): void {
  const port = process.env['PORT'] || 4000;

  const server = app();
  server.listen(port, () => {
    console.log(`✅ SSR server running at http://localhost:${port}`);
  });
}

declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = (mainModule && mainModule.filename) || '';

if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
