# Telegram PsychoBot

This bot is a Telegram bot originally made for the group [Parlons Conso](https://t.me/parlons_conso), a french anonymous discussion group made by and for consumers of psychoactive substances. <br>
It is now meant to be used in a larger context.

This project is based on the [Dosebot Discord Bot](https://github.com/dosebotredux/DosebotRedux).

## Todo

- Commands
    - [x] Ping
    - [x] Breathe
    - [x] Info
    - [x] Combos
    - [ ] Ketamine calc
    - [ ] DXM calc
    - [ ] Mushroom calc
    - [ ] Psychedelics tolerance calc
    - [ ] Effects
    - [ ] Effect info
    - [ ] Help

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