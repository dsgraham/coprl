export class VErrors {
    clearErrors() {
        var errorMessages = document.querySelectorAll('.v-error-message');

        for (var i = 0; i < errorMessages.length; i++) {
            errorMessages[i].remove();
        }
    }

    // Rails errors
    // {
    //   "name": [
    //     "Requires name"
    //   ]
    // }

    // Validation errors
    // { :email => ["must be filled"] }

    // Custom errors
    // { :email => "must be filled" }

    // Exceptions
    // {exception: 'Something bad happened' }

    stringsToArrays(value) {
        if (Array.isArray(value) || value.constructor === Object) {
            return value;
        }
        return new Array(value);
    }

    normalizeErrors(errors) {
        if (errors && errors.constructor === Object) {
            return Object.keys(errors).reduce((previous, key) => {
                previous[key] = this.stringsToArrays(errors[key]);
                return previous;
            }, {});
        }
        return [];
    }

    // [http_status, content_type, resultText]
    displayErrors(results) {
        var httpStatus = results[0];
        var contentType = results[1];
        var resultText = results[2];

        if (contentType && contentType.indexOf("application/json") !== -1) {
            var response = JSON.parse(resultText);
            var pageErrors = Object.values(this.normalizeErrors(response)).reduce(function (previous, value) {
                if (Array.isArray(value)) {
                    previous.push(value.join('<br/>'));
                }
                return previous;
            }, []);
            var fieldErrors = this.normalizeErrors(response.errors);

            for (var field in fieldErrors) {
                if (!this.displayInputError(field, fieldErrors[field])) {
                    if (!this.prependError(field, fieldErrors[field])) {
                        // Collect errors that can't be displayed at the field level
                        pageErrors.push(fieldErrors[field].join('<br/>'));
                    }
                }
            }
            this.prependError('errors', pageErrors);
        } else if (httpStatus === 0) {
            this.prependError('errors', ["Unable to contact server. Please check that you are online and retry."]);
        } else if (results!==true){
            this.prependError('errors', ["The server returned an unexpected response! Status:" + httpStatus]);
        }
    }

    // Sets the helper text on the field
    // Returns true if it was able to set the error on the control
    displayInputError(divId, messages) {
        var currentEl = document.getElementById(divId);
        if (currentEl && currentEl.mdcComponent) {
            currentEl.mdcComponent.helperTextContent = messages.join(', ');
            var helperText = document.getElementById(divId + '-input-helper-text');
            helperText.classList.add('mdc-text-field--invalid',
                'mdc-text-field-helper-text--validation-msg',
                'mdc-text-field-helper-text--persistent');
            currentEl.mdcComponent.valid = false;
            return true;
        }
        return false;
    }

    // Creates a div before the element with the same id as the error
    // Used to display an error message without their being an input field to attach the error to
    prependError(div_id, messages) {
        // create a new div element
        var newDiv = document.createElement("div");
        newDiv.className = 'v-error-message';
        // and give it some content
        var newContent = document.createTextNode(messages.join('<br/>'));
        // add the text node to the newly created div
        newDiv.appendChild(newContent);

        // add the newly created element and its content into the DOM
        var currentDiv = document.getElementById(div_id);
        if (currentDiv) {
            currentDiv.parentElement.insertBefore(newDiv, currentDiv);
            return true;
        }
        return false;
    }
}