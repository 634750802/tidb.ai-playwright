import { test as setup } from '@playwright/test';
import { config } from 'dotenv';

setup('Load credentials', async ({}) => {
  config({
    path: '.credentials'
  });
  config({
    path: '.env.local'
  });
  console.error(`Initial credential`, { username: process.env.USERNAME, password: process.env.PASSWORD })
});
