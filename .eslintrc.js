module.exports = {
    "env": {
        "browser": true,
        "es6": true,
         "jquery": true
    },
    "extends": "eslint:recommended",
    "globals": {
      "firebase": true,
      "TownHall": true,
      "Moc": true,
      "Handlebars": true,
      "moment": true,
      "Promise": true,
      "page": true,
      "newEventController": true,
      "newEventView": true,
    },
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ],
        "no-console": "off"
    }
};
