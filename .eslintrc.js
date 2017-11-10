module.exports = {
    "env": {
        "browser": true,
         "jquery": true
    },
    "extends": "eslint:recommended",
    "globals": {
      "firebase": true,
      "TownHall": true,
      "Moc": true,
      "Handlebars": true,
      "moment": true,
      "Promise": true

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
