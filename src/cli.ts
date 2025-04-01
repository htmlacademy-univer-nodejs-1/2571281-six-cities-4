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
    --generate <n> <path> <url>: Генерирует TSV-файл с тестовыми данными
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

async function generateData(n: number, filePath: string, url: string): Promise<void> {
  try {
    const offersFromServer = await fetchOffersData(url);
    const generatedOffers = Array.from({ length: n }, () => createMixedOffer(offersFromServer));

    await writeOffersToTSV(generatedOffers, filePath);

    console.log(chalk.green(`Файл TSV успешно создан: ${filePath}`));
  } catch (error) {
    console.log(chalk.red(`Ошибка при генерации TSV: ${error}`));
  }
}

function main(): void {
  const userArguments = process.argv.slice(2);
  const [command] = userArguments;

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

    case '--import': {
      const filePath = userArguments[1];
      if (!filePath) {
        console.log(chalk.red('Ошибка: не указан путь к файлу для импорта.'));
        throw new Error('Incorrect filepath given for --import');
      }
      importData(filePath);
      break;
    }

    case '--generate': {
      const nArg = userArguments[1];
      const filePath = userArguments[2];
      const url = userArguments[3];

      if (!nArg || !filePath || !url) {
        console.log(chalk.red('Ошибка: недостаточно аргументов для --generate.'));
        console.log(chalk.yellow('Формат: --generate <n> <filepath> <url>'));
        throw new Error('Incorrect arguments for --generate');
      }

      const n = parseInt(nArg, 10);
      if (isNaN(n) || n <= 0) {
        console.log(chalk.red(`Ошибка: некорректное значение для <n>: ${nArg}`));
        throw new Error('Invalid number for --generate');
      }

      generateData(n, filePath, url);
      break;
    }

    default:
      console.log(chalk.red(`Неизвестная команда: ${command}`));
      printHelp();
      throw new Error('Unknown command');
  }
}

main();
