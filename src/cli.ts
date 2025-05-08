#!/usr/bin/env node
import { PinoLogger } from './libs/logger.js';
import { MongooseService } from './database/mongoose.service.js';
import chalk from 'chalk';
import { createReadStream } from 'node:fs';
import { createInterface } from 'node:readline';
import { createRequire } from 'node:module';
import { createMixedOffer, fetchOffersData, parseOffer, writeOffersToTSV } from './utils.js';
import { OfferService } from './modules/offer/offer.service.js';
import { CreateUserDto } from './modules/user/create-user.dto.js';
import { UserService } from './modules/user/user.service.js';
import { UserType } from './modules/user/user.enum.js';
import { UserModel } from './modules/user/user.entity.js';
import { OfferModel } from './modules/offer/offer.entity.js';

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

export async function importData(filePath: string, mongoUri: string): Promise<void> {
  const logger = new PinoLogger();
  const db = new MongooseService(logger);

  await db.connect(mongoUri);

  const userService = new UserService(logger, UserModel);
  const offerService = new OfferService(logger, OfferModel);

  try {
    const rl = createInterface({
      input     : createReadStream(filePath, { encoding: 'utf-8' }),
      crlfDelay : Infinity,
    });

    for await (const rawLine of rl) {
      if (!rawLine.trim()) {
        continue;
      }

      try {
        const tokens = rawLine.split('\t');
        const userDto: CreateUserDto = {
          name     : tokens[14].trim(),
          email    : tokens[15].trim(),
          avatarUrl   : tokens[16].trim(),
          type : tokens[17].trim() === 'pro' ? UserType.Pro : UserType.Regular,
          passwordHash : 'pass_hash',
        };

        let host = await userService.findByEmail(userDto.email);
        if (!host) {
          host = await userService.create(userDto);
        }

        const offerDto = parseOffer(rawLine);
        offerDto.host = host._id.toString();
        await offerService.create(offerDto);
      } catch (err) {
        logger.warn(`Skipping bad row → ${(err as Error).message}`);
      }
    }

  } finally {
    await db.disconnect();
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
      const maybeUri = userArguments[2];
      const hostArg = userArguments[2];
      const portArg = userArguments[3];
      const dbNameArg = userArguments[4];

      if (!filePath) {
        console.log(chalk.red('Ошибка: не указан путь к TSV-файлу.'));
        return;
      }

      const mongoUri = (maybeUri && maybeUri.startsWith('mongodb'))
        ? maybeUri
        : `mongodb://${hostArg ?? 'localhost'}:${portArg ?? '27017'}/${dbNameArg ?? 'six-cities'}`;

      importData(filePath, mongoUri)
        .catch((error) => {
          console.log(chalk.red(`Import error: ${error}`));
        });
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
