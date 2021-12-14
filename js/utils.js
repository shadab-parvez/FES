const showErrorMessage = (errorMessage) => {
    $("#errorModal").addClass('u-dialog-open');
    $("#modalErrorMessage").html(errorMessage);
}

const showSuccessMessage = (successMessage) => {
    $("#successModal").addClass('u-dialog-open');
    $("#modalSuccessMessage").html(successMessage);
}