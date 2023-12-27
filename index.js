const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNumber]");

const passwordDisplay = document.querySelector("[data-PasswordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const copyMsg = document.querySelector("[data-copyMsg]");
const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[data-indicator]");
const generateBtn = document.querySelector(".generateButton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*(-+_){}[]/\;\|><?.';

let password = "";
let passwordLength = 10;
let checkCount = 0 ;
handleSlider();
// ste strength circle color to grey

setIndicator("#ccc");

//set passwordLength
function handleSlider(){
    inputSlider.value = passwordLength;
    lengthDisplay.innerText = passwordLength;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ((passwordLength - min) * 100/(max - min)) + "% 100%"
}

function setIndicator(color) {
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
    //shadow
}

function getRndInteger(min, max){
    return Math.floor(Math.random() * (max - min)) + min;//0 - 1
} 

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

function generateSymbol(){
    const random = getRndInteger(0,symbols.length);
    return symbols.charAt(random);
}

function calcStrength(){
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if(uppercaseCheck.checked) hasUpper = true;
    if(lowercaseCheck.checked) hasLower = true;
    if(numbersCheck.checked) hasNum = true;
    if(symbolCheck.checked) hasSym = true;

    if(hasUpper && hasLower && (hasNum || hasSym) && (passwordLength >= 8)) {
        setIndicator("#0f0");
    }
    else if(
        (hasLower || hasUpper) && 
        (hasNum || hasSym) &&
        (passwordLength >= 6)
    ) {
        setIndicator("#ff0");
    } else{
        setIndicator("#f00");
    }
}

async function copyContent() {
    try{
    await navigator.clipboard.writeText(passwordDisplay.value); //it is a async operation so we wait until it's not complete so we use awit keyword
    copyMsg.innerText = "copied"; //after awit we show copied msg to screen
}
    catch(e){
        copyMsg.innerText = "Failed";
    }
    //to make copy span visible
    copyMsg.classList.add("active");

    setTimeout(( )=>{
        copyMsg.classList.remove("active");
    },2000);//it invisible after 2sec  
}


function shufflePasswprd(array){
    //Fisher Yates Method
    for(let i = array.length - 1; i > 0; i--){
        //random j, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
    }
    let str = "";
    array.forEach((el) => (str += el));
    return str;

}

function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox) => {
        if(checkbox.checked)
            checkCount++;
    });

    //special condition

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    passwordLength = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(passwordDisplay.value)
        copyContent();
})

generateBtn.addEventListener('click', () => {
    //none of the checkbox are selected
    if(checkCount <= 0) return;

    if(passwordLength < checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    //let's start the to find new password 

    
    //remove old password
    password = "";

    //let's  put the stuff mentioned by checkboxs


    let funArr = [];

    if(uppercaseCheck.checked)
        funArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
        funArr.push(generateLowerCase);
    if(numbersCheck.checked)
        funArr.push(generateRandomNumber);
    if(symbolCheck.checked)
        funArr.push(generateSymbol);

    //compulsory addition

    for(let i = 0; i < funArr.length; i++){
        password += funArr[i]();
    }

    //remaining addition

    for(let i = 0; i < passwordLength-funArr.length; i++){
        let randIndex = getRndInteger(0, funArr.length);
        password += funArr[randIndex]();
    }

    //suffle the password
    password = shufflePasswprd(Array.from(password));

    //show in UI
    passwordDisplay.value = password;

    //calculate strength
    calcStrength();
    
});