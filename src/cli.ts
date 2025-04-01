#!/usr/bin/env node
import chalk from 'chalk';
import { readFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { createMixedOffer, fetchOffersData, writeOffersToTSV } from './utils.js';
const require = createRequire(import.meta.url);
const packageJson = require('../package.json');

function printHelp(): void {
  console.log(chalk.green(`
  Программа для подготовки данных для REST API сервера.
  
  Пример:
    cli.js --<command> [--arguments]
  
  Команды:
    --version:                   Выводит номер версии
    --help:                      Печатает этот текст
    --import <path>:             Импортирует данные из TSV
  `));
}

function printVersion(): void {
  console.log(chalk.blue(packageJson.version));
}

function importData(filePath: string): void {
  try {
    const fileContent = readFileSync(filePath, { encoding: 'utf-8' });
    console.log(chalk.magenta(`Содержимое файла:\n${fileContent}`));
  } catch (err) {
    console.log(chalk.red(`Не удалось прочитать файл: ${err}`));
    throw new Error('Unable to read file');
  }
}

function main(): void {
  const userArguments = process.argv.slice(2);
  const [command, param] = userArguments;

  if (!command) {
    printHelp();
    return;
  }

  switch (command) {
    case '--help':
      printHelp();
      break;
    case '--version':
      printVersion();
      break;
    case '--import':
      if (!param) {
        console.log(chalk.red('Ошибка: не указан путь к файлу.'));
        throw new Error('Incorrect filepath given for --import');
      }
      importData(param);
      break;
    default:
      console.log(chalk.red(`Неизвестная команда: ${command}`));
      printHelp();
      throw new Error('Unknown command');
  }
}

main();

try {
  const offersFromServer = await fetchOffersData('http://localhost:3005/offers');

  const generated = Array.from({ length: 10 }, () => createMixedOffer(offersFromServer));

  await writeOffersToTSV(generated, './output/offers.tsv');

  console.log('TSV file successfully written!');
} catch (error) {
  console.error('Error:', error);
}
