# Gouvernail
Autocomplete your code using Fabrice Bellard's AI API on Visual Studio Code. See https://textsynth.com.

## Getting started
 - Create an account on https://textsynth.com. We highly recommend using paying credits not to be limited. (Free accounts are limited with 30 requests max per 24h).
 - In the `Settings` tab, copy the API key.
 - Import the `.vsix` file in VS Code. You will be asked to open the settings.
 - In the `Token` field, paste your API key. Then reload the extension (you can also reload VS Code).
 - When you will code, you will have inline suggestions which can be accepted by pressing `Tab`.

## Trigger the suggestion manually
Use the command palet of VS Code :
 - Open it with `CTRL + Shift + P` (`Cmd + Shift + P` on Mac OS)
 - Search for "trigger inline suggestion" and press Enter.
 - You can configure a keyboard shortcut by clicking the wheel to the right of the command palet

## Building the extension
Make sure you have `node`, `npm` and `vsce` installed.

Clone the repository :
```sh
git clone https://github.com/mhelluy/gouvernail.git
```
CD inside the directory you just cloned :
```sh
cd gouvernail
```
Install NPM packages :
```sh
npm install
```
Package the extension
```sh
vsce package
```
