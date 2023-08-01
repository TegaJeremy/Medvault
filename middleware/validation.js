const validator = require ('validator')

const validateEmailAndPhone = (email, phoneNumber, patientName) => {
    if (!validator.isEmail(email)) {
        return {
            isValid: false,
            message: 'Invalid Email Format'
        };
    }

    if (!validator.isNumeric(phoneNumber) || !validator.isLength(phoneNumber, { min: 11, max: 11 })) {
        return {
            isValid: false,
            message: 'Invalid Number Format'
        };
    }

    const stringPattern = /^[A-Za-z ]+$/;

    if (!stringPattern.test(patientName)) {
        return {
            isValid: false,
            message: 'Invalid Name Format. Only letters and spaces are allowed.'
        };
    }

    return {
        isValid: true
    };
};


module.exports = validateEmailAndPhone