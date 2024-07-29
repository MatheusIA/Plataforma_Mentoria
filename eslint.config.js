[
    {
        "extends": [
            "@rocketseat/eslint-config/node"
        ],
        "rules": {
            "prettier/prettier": [
                "error",
                { "endOfLine": "auto" }
            ],
            "camelcase": "off",
            "no-useless-constructor": "off"
        },
        "ignorePatterns": [
            "node_modules/",
            "build/"
        ]
    }
]
