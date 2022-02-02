# Parlons Conso Bot

This bot is a Telegram bot made for the group [Parlons Conso](https://t.me/parlons_conso), an anonymous discussion group made by and for consumers of psychoactive substances.

This project is based on the [Dosebot Discord Bot](https://github.com/dosebotredux/DosebotRedux).

## Todo

## Quick start

If you want to host it, start by grabbing a bot token [here](https://core.telegram.org/api), it should looks like `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11`. <br>
Then, create a `.env` file in the project's folder and type:
```
TOKEN=<your bot token here>
```

Now, you have to install all dependencies:
```console
$ npm install -d
```

Then choose either debug:
```
$ npm run start:dev
```

Or production mode:
```
# Build
$ npm run build

# Build an start
$ run run start
```