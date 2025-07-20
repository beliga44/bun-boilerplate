// Use core-js for polyfill because container.resolve() cannot read class from tsyringe
import 'core-js';
import 'reflect-metadata';
import { Application } from './modules/bootstrap';

// Bootstrap application
const application = new Application();
application.start().catch(() => process.exit(1));
