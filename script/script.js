//#region VALIDATION
function validateInput(element, errorMessage = '', callback = null) {
    let condition = false // Initially no custom condition set
    if (typeof callback === "function") {
        condition = callback(element.value)
    }
    if (element.required) {
        if (element.value.length < 1) { // Invalid if required field is empty
            setErrorMessage(element.id, `error-${element.id}`, 'Please fill in this field.')
            return
        }
    }
    if (condition) { // Invalid if the input does not satisfy the custom condition
        setErrorMessage(element.id, `error-${element.id}`, errorMessage)
    }
    else { // Valid input
        clearErrorMessage(element.id, `error-${element.id}`)
    }
}

function setErrorMessage(inputId, errorInputId, errorMessage) {
    document.getElementById(errorInputId).innerText = errorMessage;
    document.getElementById(inputId).classList.remove('is-valid')
    document.getElementById(inputId).classList.add('is-invalid')
}

function clearErrorMessage(inputId, errorInputId) {
    document.getElementById(errorInputId).innerText = ''
    document.getElementById(inputId).classList.remove('is-invalid')
    document.getElementById(inputId).classList.add('is-valid')
}

// Array consists of form ids.
// Creates an addEventListener for each form in the array
function createAddEventListeners(array, errorMessage, callback) {
    array.forEach(id =>
        document.getElementById(id).addEventListener('keyup', (e) => {
            validateInput(e.target, errorMessage, callback)
        })
    )
}

// Returns true if data only contains digits
function containsOnlyDigits(data) {
    return data.match(/^[0-9\s]+$/)
}

document.getElementById('regform').addEventListener('submit', (e) => {
    e.preventDefault()

    // Check if required fields are empty
    for (let element of e.target.elements) {
        if (element.id != '' && element.required) {
            if (element.value.length < 1) {
                setErrorMessage(element.id, `error-${element.id}`, 'Please fill in this field.')
            }
        }
    }
    
    if (document.getElementsByClassName('is-invalid').length === 0) { // If sumbission is valid
        console.log('valid reg!')
    }
    else {
        console.log('invalid reg!')
    }

})

createAddEventListeners(['firstname', 'lastname', 'address', 'city'])
createAddEventListeners(['zip', 'phonenumber'], 'Cannot contain non-digits.', (data) => !containsOnlyDigits(data))
createAddEventListeners(['email'], 'Invalid format.', (data) => !(/^([A-Za-z0-9_\-.])+@([A-Za-z0-9_\-.])+\.([A-Za-z]{2,4})$/.test(data)))

//#endregion VALIDATION

//#region USER
class User {
    constructor(firstname, lastname, address, city, zip, email, phonenumber) {
        this.id = Date.now()
        this.firstName = firstname
        this.lastName = lastname
        this.address = address
        this.city = city
        this.zip = zip
        this.email = email
        this.phonenumber = phonenumber
    }

    fullname() {
        return `${this.firstName} ${this.lastName}`
    }

    fulladdress() {
        return `${this.address}, ${this.city} ${this.zip}`
    }
}

function createUser() {

    let user = new User(
        firstname.value,
        lastname.value,
        address.value,
        city.value,
        zip.value,
        email.value,
        phonenumber.value)
    
    return user
}

let userList = []
function saveUser(user) {
    userList.push(user)
    createElement(user)
    fillPanel(user)

    console.log(userList)
}

function createElement(user) {
    userDiv = document.createElement('div')
    userDiv.id = `${user.id}`
    
    flipDiv = document.createElement('div')
    flipDiv.className = 'flip'
    flipDiv.id = `${user.id}-flip`
    flipDiv.innerText = `${user.fullname()}`

    panelDiv = document.createElement('div')
    panelDiv.className = 'panel'
    panelDiv.id = `${user.id}-panel`

    // Add elements to the DOM
    var currentDiv = document.getElementById('div-users');
    currentDiv.appendChild(userDiv)
    userDiv.appendChild(flipDiv)
    userDiv.appendChild(panelDiv)
}

function fillPanel(user) {
    idElement = document.createElement('p')
    idElement.innerText = `Id: ${user.id}`

    emailElement = document.createElement('p')
    emailElement.innerText = `E-mail: ${user.email}`
    emailElement.id = `${user.id}-email`

    phonenumberElement = document.createElement('p')
    phonenumberElement.innerText = `Phonenumber: ${user.phonenumber}`
    phonenumberElement.id = `${user.id}-phonenumber`

    addressElement = document.createElement('p')
    addressElement.innerText = `Address: ${user.fulladdress()}`
    addressElement.id = `${user.id}-address`

    // Add elements to the DOM
    panelDiv.appendChild(idElement)
    panelDiv.appendChild(emailElement)
    panelDiv.appendChild(phonenumberElement)
    panelDiv.appendChild(addressElement)
    panelDiv.appendChild(trashIcon)
    panelDiv.appendChild(editIcon)
}
//#endregion USER

//#region JQuery
$(document).ready(function () {

    $('#regform').submit(function(e){
        e.preventDefault()

        if ($('.is-invalid').length === 0) {
            user = createUser()
            saveUser(user)
        }
    })

    $('body').delegate('.flip', 'click', function() {
        $(this).next('.panel').slideToggle('slow')
    })
})
//#endregion JQuery