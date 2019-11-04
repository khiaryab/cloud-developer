import {Sequelize} from 'sequelize-typescript';
import { config } from './config/config';


const c = config.dev;

// Instantiate new Sequelize instance!
export const sequelize = new Sequelize({
  "username": c.username.trim(),
  "password": c.password.trim(),
  "database": c.database,
  "host":     c.host,

  dialect: 'postgres',
  storage: ':memory:',
});

