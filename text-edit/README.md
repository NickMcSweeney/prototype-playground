# @welocalize/tethys-editor

> A custom text editor using Vue rendering in virtual dom

## Build Setup

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:8080
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For detailed explanation on how things work, checkout the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

### Using tethys-editor
``` js
import Vue from "vue";
import { Editor } from "@welocalize/tethys-editor";

import plugin from "@welocalize/tethys-editor";

new Vue({
  components: {
    Editor,
  }
})

Vue.use(plugin);
```

### Props:
``` js
// add predictive typeahead - default: false
:showHints = Boolean()

// set maximum line length - default: 64
:maxLineLength = Number()

// show spelling errors - default: true
:showSpelling = Boolean()

// add typeahead 'training' text
:predictionSrc = Object()

// save line timing data - default: Number.random()
:snapTiming="in progress..."

// allow copy/paste/cut
:canCopy = Boolean()
:canPaste = Boolean()
:canCut = Boolean()

// allow undo/redo
:canUndo = Boolean()
:canRedo = Boolean()

// add dictionaries
:dictionaries = Object()

// set default dictionary
:defaultDictionary = Object ()

```
> Fill text for typeahead example

``` js
const text = {
  Text: [
    "And I heard, as it were, the noise of thunder",
    "One of the four beasts saying",
    "Come and see and I saw and behold a white horse",
    "There's a man goin' 'round takin' names",
    ...
    "Some are born and some are dyin'",
    "It's alpha and omega's kingdom come",
    "And the whirlwind is in the thorn tree",
  ],
};
```
``` html
<text-editor :predictionSrc="text"></text-editor>
```
> Dictionary file import example

``` js
import affFile from "@/some-file-path/dictionaries/en_US/en_US.aff";
import dicFile from "@/some-file-path/dictionaries/en_US/en_US.dic";

const Typo = require("typo-js");
var dictionary_en = new Typo("en_US", affFile, dicFile);
```
``` html
<text-editor :dictionaries="{english: dictionary_en}" :defaultDictionary="dictionary_en"></text-editor>
```
