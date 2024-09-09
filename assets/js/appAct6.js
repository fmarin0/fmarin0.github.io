/**
 * Instance of the Particle class for interacting with the Particle API.
 * @type {Particle}
 */
const particle = new Particle();

/**
 * Reference to the HTML slider used for adjusting the TMS value.
 * @type {HTMLInputElement}
 */
const slider = document.getElementById("Ktms");

/**
 * Reference to the HTML element that displays the TMS value from the slider.
 * @type {HTMLElement}
 */
const valueOutput = document.getElementById("Kvaluetms");

/**
 * Reference to the HTML element that displays the TMS value.
 * @type {HTMLElement}
 */
const tmsValueDisplay = document.getElementById("tms-value");

/**
 * Reference to the HTML element that shows the previous TMS value.
 * @type {HTMLElement}
 */
const valorAnterior = document.getElementById("valor-anterior");

/**
 * Reference to the HTML element that shows the new TMS value.
 * @type {HTMLElement}
 */
const valorNuevo = document.getElementById("valor-nuevo");

/**
 * Access token for authenticating requests to the Particle API.
 * @type {string|undefined}
 */
let token;

/**
 * Device ID for the Particle device.
 * @type {string}
 */
const deviceId = "3b0024001547313036303933";

/**
 * Logs in to the Particle API using provided credentials.
 *
 * @function login
 */
function login() {
    return particle.login({
        username: "jhernandez117@ucol.mx",
        password: "!7pQagun15"
    })
    .then(data => {
        token = data.body.access_token;
    })
    .catch(err => {
        console.log("Could not log in.", err);
    });
}

/**
 * Retrieves the current TMS value from the device and updates the UI.
 *
 * @function getTMSValue
 */
function getTMSValue() {
    return particle.getVariable({
        deviceId: deviceId,
        name: 'TMS_Value',
        auth: token
    })
    .then(response => {
        const tmsValue = response.body.result;
        // Update the slider and the UI with the retrieved value
        slider.value = tmsValue;
        valueOutput.innerHTML = tmsValue;
        tmsValueDisplay.textContent = tmsValue;
        valorAnterior.textContent = tmsValue;
    })
    .catch(err => {
        console.log('Error occurred while getting TMS value:', err);
    });
}

/**
 * Retrieves the new TMS value from the device and updates the UI.
 *
 * @function getNewTMSValue
 */
function getNewTMSValue() {
    return particle.getVariable({
        deviceId: deviceId,
        name: 'TMS_Value',
        auth: token
    })
    .then(response => {
        const tmsValue = response.body.result;
        valorNuevo.textContent = tmsValue;
        tmsValueDisplay.textContent = tmsValue;
    })
    .catch(err => {
        console.log('Error occurred while getting new TMS value:', err);
    });
}

/**
 * Calls the Particle function to update the TMS value and updates the UI.
 *
 * @function updateTMSValue
 */
function updateTMSValue() {
    const value = slider.value;
    return particle.callFunction({
        deviceId: deviceId,
        name: 'set_TMS',
        argument: value,
        auth: token
    })
    .then(() => {
        // Update the new TMS value in the UI
        valorAnterior.textContent = value; // Directly use the slider value
        valueOutput.innerHTML = value;
        tmsValueDisplay.textContent = value; // Display the updated TMS value
    })
    .catch(err => {
        console.log('Error occurred while calling function:', err);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    login() // Log in to the API
        .then(() => {
            getTMSValue(); // Retrieve the initial TMS value
        });

    // Initialize previous value
    let previousValue = slider.value; 
    valorAnterior.textContent = previousValue;

    // Set up event listener for the slider
    slider.addEventListener("input", () => {
        const value = slider.value;

        // Update the previous value before changing the slider value
        valorAnterior.textContent = previousValue;
        previousValue = value;

        // Call the function to update the TMS value on the Particle device
        updateTMSValue()
            .then(() => getNewTMSValue()); // Update the new TMS value in the UI
    });
});