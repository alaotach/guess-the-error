let errorCode;
let mode = "cat";
let options = []

function initGame(type){
    mode = type;
    loadNewCar();
}

const codes = [
    100, 101, 102, 200, 201, 202, 203, 204, 205, 206, 207, 208, 226, 300, 301, 302, 303, 304, 305, 307, 308, 400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 412, 413, 414, 415, 416, 417, 418, 421, 422, 423, 424, 425, 426, 428, 429, 431, 451,500, 501, 502, 503, 504, 505, 506, 507, 508, 510, 511
];

function loadNewCar(){
    errorCode = codes[Math.floor(Math.random() * codes.length)];
    const img = document.getElementById("car-image");
    img.src = mode === "cat" ? `https://http.cat/${errorCode}`:`https://http.dog/${errorCode}`;
    document.getElementById("result").innerHTML = "";
    document.getElementById("choices").innerHTML = "";
    genOptions();
}

function genOptions(){
    options = [errorCode];
    while (options.length < 4){
        const code = codes[Math.floor(Math.random() * codes.length)];
        if (!options.includes(code)){
            options.push(code);
        }
    }
    options.sort(() => Math.random() - 0.5);
    const choices = document.getElementById("choices");
    choices.innerHTML = "";
    options.forEach(option => {
        const btn = document.createElement("button");
        btn.innerText = option;
        btn.onclick = () => checkAnswer(option);
        choices.appendChild(btn);
    });
}

function checkAnswer(selectedCode){
    const resultDiv = document.getElementById("result");
    if (selectedCode == errorCode){
        resultDiv.innerHTML = "Correct!";
        } 
    else {
        resultDiv.innerHTML = `Wrong, Try Again!`
        };
}