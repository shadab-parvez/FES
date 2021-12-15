var maxAllowedSizeInMB = 5;
const showErrorMessage = (errorMessage) => {
    $("#errorModal").addClass('u-dialog-open');
    $("#modalErrorMessage").html(errorMessage);
}

const showSuccessMessage = (successMessage) => {
    $("#successModal").addClass('u-dialog-open');
    $("#modalSuccessMessage").html(successMessage);
}

var languageStore = {
    'en': 'English'
};

var basisOfRecordStore = {
    'HumanObservation': 'Human Observation'
};

const getOccurenceDateTime = (dateTime) => {
    var d = new  Date(dateTime);
    return d.getUTCDay() + "-" + d.getUTCMonth() + "-" + d.getUTCFullYear()
}