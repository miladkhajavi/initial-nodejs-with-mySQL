const validator = require('./validator');
const { check } = require('express-validator');
const path = require('path');

class productValidator extends validator {
    handle() {
        return [
            check('title')
                .isLength({ min: 15 })
                .withMessage('عنوان محصول نباید کمتر از 15 کارکتر باشد'),
            check('body')
                .not().isEmpty()
                .withMessage('متن محصول نمی تواند خالی باشد'),
            check('type')
                .not().isEmpty()
                .withMessage('نوع محصول را وارد کنید'),
            
            check('price')
                .not().isEmpty()
                .withMessage('هزینه محصول را وارد کنید'),
            check('tags')
                .not().isEmpty()
                .withMessage('تگ های محصول را وارد کنید')
        ]
    }
}
module.exports = new productValidator();