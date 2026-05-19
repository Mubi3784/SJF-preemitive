const executeBtn = document.getElementById("execute-btn");
const arrivalTimeInput = Array.from(document.getElementsByClassName("arrival-time"));
const burstTimeInput = Array.from(document.getElementsByClassName("burst-time"));
const processes = Array.from(document.getElementsByClassName("process"));
const readyQueue = [];
const terminationQueue = [];
const ganttChart = document.getElementById("gantt-chart");
let time = 0;

executeBtn.addEventListener("click", () => {
    event.preventDefault();

    const processData = [];


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

    let totalTime = 0;
    for (let i = 0; i < burstTime.length; i++) {
        totalTime += parseInt(burstTime[i]);
    }

    for (let i = 0; i <= totalTime - 1; i++) {
        console.log("time = " + time);

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
                    console.log(lowestBT);
                } else {
                    lowestBT = readyQueue[i]
                    lowestBTIndex = i;
                }
            }


            readyQueue[lowestBTIndex]["burst-time"]--;
            if(readyQueue[lowestBTIndex]['burst-time'] == 0){
                readyQueue.splice(lowestBTIndex, 1);
            }
        } else if (readyQueue.length === 1) {
            lowestBT = readyQueue[0];
            lowestBTIndex = 0;
            readyQueue[lowestBTIndex]["burst-time"]--;
            if(readyQueue[lowestBTIndex]['burst-time'] == 0){
                readyQueue.splice(lowestBTIndex, 1);
            }
        } else {
            console.log("The ready queue is empty!");
        }

        console.log(lowestBT);
        ganttChart.insertAdjacentHTML("beforeend", `<div class="gantt-container">
        <div>
            <div class="gantt-process">P-${lowestBT["id"]}</div><span><i class="bi bi-arrow-right"><svg
                        xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"
                        class="bi bi-arrow-right" viewBox="0 0 16 16">
                        <path fill-rule="evenodd"
                            d="M1 8a.5.5 0 0 1 .5-.5h11.793l-3.147-3.146a.5.5 0 0 1 .708-.708l4 4a.5.5 0 0 1 0 .708l-4 4a.5.5 0 0 1-.708-.708L13.293 8.5H1.5A.5.5 0 0 1 1 8" />
                    </svg></i></span>
        </div>
        <div class="time">${time}</div>
    </div>`);

        time++;
    }

    console.log(readyQueue);
})