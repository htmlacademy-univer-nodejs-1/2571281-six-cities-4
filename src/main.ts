import 'reflect-metadata';
import { container } from './di/container.js';
import { TYPES } from './types.js';
import { Application } from './app/application.js';

const app = container.get<Application>(TYPES.Application);

app.init();
