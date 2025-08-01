const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthContainer]");
const passwordDisplay = document.querySelector("[data-PasswordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMSG = document.querySelector("[data-copyMSG]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numberCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".Generate-Button");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbol = '~`!@#$%^&*()_+-={[}]|:;"<,>.?/';

let password = "";
let passwordLength = 10;
let checkCount = 1;
handleSlider();
// set strength circle to grey
setIndicator("#ccc")


// set password Length
function handleSlider() {
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min)*100/(max-min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0 0 10px 1px ${color}`;
}

function getRndInteger(max , min) {
    return Math.floor(Math.random() * (max-min)) + min;
}

function getRandomNumber() {
    return getRndInteger(0,9);
}

function generateLowercase() {
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUppercase() {
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol() {
    const randNum = getRndInteger(0,symbol.length);
    return symbol.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;

    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(symbolCheck.checked) hasSym = true;
    if(numberCheck.checked) hasNum = true;
    
    if(hasUpper && hasLower && (hasNum || hasSym) && passwordLength >= 8) {
        setIndicator('#0f0');
    }
    else if((hasLower || hasUpper) && (hasSym && hasNum) && passwordLength >= 6) {
        setIndicator('#ff0');
    }
    else {
        setIndicator('#f00');
    }
}

async function copyContent() {
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMSG.innerText = 'Copied';
    }
    catch(e) {
        copyMSG.innerText = 'Failed';
    }
    copyMSG.classList.add('active');
    setTimeout(() => {
        copyMSG.classList.remove('active');
    }, 2000);
}

function shufflePassword(array) {
    // Fisher yates method
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

function handleCheckBoxChange() {
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked) {
            checkCount++;
        }
    });

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change' , handleCheckBoxChange);
});

inputSlider.addEventListener('input' , (e) => {
    passwordLength = e.target.value;
    handleSlider();
});

copyBtn.addEventListener('click' , () => {
    if(passwordDisplay.value) {
        copyContent();
    }
});

generateBtn.addEventListener('click' , () => {
    if(checkCount <= 0) return;

    if(passwordLength < checkCount) {
        passwordLength = checkCount;
        handleSlider();
    }

    // Let's start the journey to find the new password

    // Remove old password
    password = "";

    // Let's put the stuff mentioned by checkboxes
    // if(uppercaseCheck.checked) {
    //     password += generateUppercase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowercase();
    // }

    // if(symbolCheck.checked) {
    //     password += generateSymbol();
    // }

    // if(numberCheck.checked) {
    //     password += getRandomNumber();
    // }

    let funcArr = [];
    if(uppercaseCheck.checked) {
        funcArr.push(generateUppercase);
    }

    if(lowercaseCheck.checked) {
        funcArr.push(generateLowercase);
    }

    if(symbolCheck.checked) {
        funcArr.push(generateSymbol);
    }

    if(numberCheck.checked) {
        funcArr.push(getRandomNumber);
    }

    // Complusory addition
    for(let i=0 ; i<funcArr.length ; i++) {
        password += funcArr[i]();
    }

    for(let i=0 ; i<passwordLength-funcArr.length ; i++) {
        let randomIndex = getRndInteger(0,funcArr.length);
        password += funcArr[randomIndex]();
    }

    // Shuffle the password
    password = shufflePassword(Array.from(password));

    // Show in UI
    passwordDisplay.value = password;

    // Show strength
    calcStrength();
});