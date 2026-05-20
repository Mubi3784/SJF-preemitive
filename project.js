const executeBtn = document.getElementById("execute-btn");
const arrivalTimeInput = Array.from(document.getElementsByClassName("arrival-time"));
const burstTimeInput = Array.from(document.getElementsByClassName("burst-time"));
const processes = Array.from(document.getElementsByClassName("process"));
const ganttChart = document.getElementById("gantt-chart");
const filteredGanttChart = document.getElementById("filtered-gantt-chart");
const chartHeadings = Array.from(document.getElementsByClassName("chart-headings"));
const statsTable = document.getElementById("stats-table");
const statsBody = document.getElementById("stats-body");
let processData = [];
let readyQueue = [];
let filteredGanttArray = [[], []];
let statsArr = [];
let time = 0;

executeBtn.addEventListener("click", () => {
    event.preventDefault();
    ganttChart.innerHTML = "";
    filteredGanttChart.innerHTML = "";
    statsBody.innerHTML = "";
    processData = [];
    readyQueue = [];
    filteredGanttArray = [[], []];
    statsArr = [];
    
    time = 0;

    if (inputsValidator(arrivalTimeInput, burstTimeInput)) {
        alert("Enter all the required inputs!");
        inputsCleaner(arrivalTimeInput, burstTimeInput);
        return;
    }

    const arrivalTime = [];
    arrivalTimeInput.forEach((input) => {
        arrivalTime.push(input.value);
    })
    const burstTime = [];
    burstTimeInput.forEach((input) => {
        burstTime.push(input.value);
    })

    for (let i = 0; i < arrivalTime.length; i++) {
        let obj = {
            "id": i + 1,
            "arrival-time": arrivalTime[i],
            "burst-time": burstTime[i]
        }
        processData.push(obj);
    }

    for(let i = 0; i < processData.length; i++){
        let obj = {
            "name": `P-${processData[i].id }`,
            "arrival-time": processData[i]["arrival-time"],
            "burst-time": processData[i]["burst-time"],
            "completion-time": "",
            "waiting-time": "",
            "turnaround-time": "",
            "response-time": ""
        }
        statsArr.push(obj);
    }

    while (!(processData.length == 0)) {
        console.log("time = " + time);
        if (time == 0) {
            filteredGanttArray[0].push(time);
        }

        processData.forEach((process) => {
            if (time == process["arrival-time"]) {
                readyQueue.push(process);
            }
        })

        let lowestBT;
        let lowestBTIndex;

        if (readyQueue.length >= 2) {
            for (let i = 0; i < readyQueue.length - 1; i++) {
                if (i == 0) {
                    lowestBT = readyQueue[i];
                }

                if (lowestBT["burst-time"] < readyQueue[i + 1]["burst-time"]) {
                } else if (lowestBT["burst-time"] > readyQueue[i + 1]["burst-time"]) {
                    lowestBT = readyQueue[i + 1];
                    lowestBTIndex = i + 1;
                } else {
                    lowestBT = readyQueue[i]
                    lowestBTIndex = i;
                }
            }

            readyQueue[lowestBTIndex]["burst-time"]--;

        } else if (readyQueue.length === 1) {
            lowestBT = readyQueue[0];
            lowestBTIndex = 0;
            readyQueue[lowestBTIndex]["burst-time"]--;

        } else {
            console.log("The ready queue is empty!");
            ganttChart.insertAdjacentHTML("beforeend", `
                <div class="gantt-container">
                    <div>
                        <div class="gantt-process"></div>
                        <span class="arrow"><i class="bi bi-arrow-right"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                    fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                    <path fill-rule="evenodd"
                                        d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                                </svg></i>
                        </span>
                    </div>
                    <div class="time">${time}</div>
                </div>`);
            time++;
            continue;
        }

        let pName = `P-${lowestBT.id}`;

        if (filteredGanttArray[filteredGanttArray.length - 1].length == 0) {
            filteredGanttArray[1].push(pName);
        } else if (!(pName == filteredGanttArray[1][filteredGanttArray[1].length - 1])) {
            filteredGanttArray[1].push(pName);
            filteredGanttArray[0].push(time);
        }

        if (readyQueue[lowestBTIndex]['burst-time'] == 0) {
            readyQueue.splice(lowestBTIndex, 1);
            for (let i = 0; i < processData.length; i++) {
                if (processData[i].id === lowestBT.id) {
                    processData.splice(i, 1);
                }
            }
        }

        console.log(lowestBT);
        ganttChart.insertAdjacentHTML("beforeend", `<div class="gantt-container">
        <div>
            <div class="gantt-process">P-${lowestBT["id"]}</div><span class="arrow"><i class="bi bi-arrow-right"><svg
                        xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                    </svg></i></span>
        </div>
        <div class="time">${time}</div>
    </div>`);
        time++;
        console.log(processData);
        console.log(readyQueue);
    }

    for(let i = 0; i < filteredGanttArray[0].length; i++){
        filteredGanttChart.insertAdjacentHTML("beforeend", `
            <div class="gantt-container">
                <div>
                    <div class="gantt-process">${filteredGanttArray[1][i]}</div>
                    <span class="arrow" ><i class="bi bi-arrow-right"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16"
                                fill="currentColor" class="bi bi-arrow-right" viewBox="0 0 16 16">
                                <path fill-rule="evenodd"
                                    d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                            </svg></i>
                    </span>
                </div>
                <div class="time">${filteredGanttArray[0][i]}</div>
            </div>`)
    }

    chartHeadings.forEach((heading)=> {
        heading.style.display = "block"; 
    })

    ganttChart.insertAdjacentHTML("beforeend", `
        <span class="last-time">${time}</span>
    `)

    filteredGanttChart.insertAdjacentHTML("beforeend", `
        <span class="last-time">${time}</span>
    `)

    statsTable.style.display = "block";
    
    statsArr.forEach((process) => {
        let lastIndex = filteredGanttArray[1].findLastIndex((element) => element == process.name);
        if(lastIndex == filteredGanttArray[1].length - 1){
            process["completion-time"] = time;
        }else {
            process["completion-time"] = filteredGanttArray[0][lastIndex + 1];
        }
        
        let firstIndex = filteredGanttArray[1].findIndex((element) => element == process.name);
        if(firstIndex == 0){
            process["response-time"] = 0;
        } else{
            process["response-time"] = filteredGanttArray[0][firstIndex - 1];
        }
        process["turnaround-time"] = process["completion-time"] - process["arrival-time"];
        process["waiting-time"] = process["turnaround-time"] - process["burst-time"]; 
        statsBody.insertAdjacentHTML("beforeend", `
            <tr>
                <td>${process.name}</td>
                <td>${process["arrival-time"]}</td>
                <td>${process["burst-time"]}</td>
                <td>${process["waiting-time"]}</td>
                <td>${process["turnaround-time"]}</td>
                <td>${process["response-time"]}</td>
                <td>${process["completion-time"]}</td>
            </tr>`)
    })
})


const inputsValidator = (arrivalArray, burstArray) => {
    for (let i = 0; i < arrivalArray.length; i++) {
        if ((arrivalArray[i].value == "") || (burstArray[i].value == "")) {
            return true;
        }
    }
    return false;
}

const inputsCleaner = (arrivalArray, burstArray) => {
    for (let i = 0; i < arrivalArray.length; i++) {
        arrivalArray[i].value = "";
        burstArray[i].value = "";
    }
}