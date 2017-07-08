module.exports = {
    "env": {
        "browser": true,
         "jquery": true
    },
    "extends": "eslint:recommended",
    "globals": {
      "firebase": true,
      "TownHall": true,
      "Moc": true
    },
    "rules": {
        "indent": [
            "error",
            4
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
