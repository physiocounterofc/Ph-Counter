// ==================================================
// PHYSIO COUNTER
// ==================================================


// ==========================
// VARIÁVEIS
// ==========================

let count = 0;

let currentSeries = 1;

let totalSeries = 4;

let totalReps = 30;

let startTime = null;

let seriesStartTime = null;

let timer = null;

let running = false;

let seriesTimes = [];


// ==========================
// HISTÓRICO
// ==========================

let history = JSON.parse(
    localStorage.getItem(
        "physioHistory"
    )
) || [];


// ==========================
// ELEMENTOS
// ==========================

const counter =
    document.getElementById("counter");

const timerDisplay =
    document.getElementById("timer");

const currentSeriesDisplay =
    document.getElementById("currentSeries");

const totalSeriesDisplay =
    document.getElementById("totalSeries");

const totalRepsDisplay =
    document.getElementById("totalReps");

const progressBar =
    document.getElementById("progressBar");

const progressText =
    document.getElementById("progressText");

const status =
    document.getElementById("status");

const setup =
    document.getElementById("setup");

const exerciseArea =
    document.getElementById("exerciseArea");

const finished =
    document.getElementById("finished");

const finalTime =
    document.getElementById("finalTime");

const seriesResults =
    document.getElementById("seriesResults");


const plus =
    document.getElementById("plus");

const minus =
    document.getElementById("minus");

const reset =
    document.getElementById("reset");

const startButton =
    document.getElementById("startButton");


const seriesMinus =
    document.getElementById("seriesMinus");

const seriesPlus =
    document.getElementById("seriesPlus");

const repsMinus =
    document.getElementById("repsMinus");

const repsPlus =
    document.getElementById("repsPlus");


// ==========================
// HISTÓRICO ELEMENTOS
// ==========================

const historyButton =
    document.getElementById(
        "historyButton"
    );

const historyModal =
    document.getElementById(
        "historyModal"
    );

const closeHistory =
    document.getElementById(
        "closeHistory"
    );

const historyList =
    document.getElementById(
        "historyList"
    );

const emptyHistory =
    document.getElementById(
        "emptyHistory"
    );

const historyCount =
    document.getElementById(
        "historyCount"
    );

const clearHistory =
    document.getElementById(
        "clearHistory"
    );


// ==========================
// FORMATAR TEMPO
// ==========================

function formatTime(time) {

    time = Math.max(
        0,
        Math.floor(time)
    );

    const minutes =
        Math.floor(
            time / 60000
        );

    const seconds =
        Math.floor(
            (time % 60000) / 1000
        );

    const milliseconds =
        time % 1000;


    return (

        String(minutes)
            .padStart(2, "0")

        + ":"

        + String(seconds)
            .padStart(2, "0")

        + "."

        + String(milliseconds)
            .padStart(3, "0")

    );
}


// ==========================
// FORMATAR DATA
// ==========================

function formatDate(timestamp) {

    const date =
        new Date(timestamp);

    return date.toLocaleDateString(
        "pt-BR",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );
}


// ==========================
// FORMATAR HORA
// ==========================

function formatClock(timestamp) {

    const date =
        new Date(timestamp);

    return date.toLocaleTimeString(
        "pt-BR",
        {
            hour: "2-digit",
            minute: "2-digit"
        }
    );
}


// ==========================
// ATUALIZAR CONTADOR
// ==========================

function updateCounter() {

    counter.textContent =
        count;


    progressText.textContent =
        `${count} / ${totalReps}`;


    const percentage =
        (count / totalReps) * 100;


    progressBar.style.width =
        `${Math.min(
            percentage,
            100
        )}%`;


    counter.style.transform =
        "scale(1.08)";


    setTimeout(() => {

        counter.style.transform =
            "scale(1)";

    }, 80);
}


// ==========================
// CONFIGURAÇÕES
// ==========================

function updateSettings() {

    document.getElementById(
        "seriesValue"
    ).textContent =
        totalSeries;


    document.getElementById(
        "repsValue"
    ).textContent =
        totalReps;


    totalSeriesDisplay.textContent =
        totalSeries;


    totalRepsDisplay.textContent =
        totalReps;


    currentSeriesDisplay.textContent =
        currentSeries;


    updateCounter();
}


// ==========================
// CRONÔMETRO
// ==========================

function updateTimer() {

    if (
        !running ||
        startTime === null
    ) {
        return;
    }


    const elapsed =
        performance.now() -
        startTime;


    timerDisplay.textContent =
        formatTime(elapsed);
}


// ==========================
// COMEÇAR
// ==========================

function startExercise() {

    if (running) {
        return;
    }


    running = true;


    const now =
        performance.now();


    startTime =
        now;


    seriesStartTime =
        now;


    status.textContent =
        "EM ANDAMENTO";


    startButton.textContent =
        "EM ANDAMENTO";


    startButton.disabled =
        true;


    setup.style.opacity =
        "0.45";


    timer =
        setInterval(
            updateTimer,
            30
        );
}


// ==========================
// SALVAR HISTÓRICO
// ==========================

function saveSession(
    totalTime
) {

    const session = {

        id:
            Date.now(),

        date:
            Date.now(),

        series:
            totalSeries,

        repetitions:
            totalReps,

        totalTime:
            totalTime,

        seriesTimes:
            [...seriesTimes]

    };


    history.unshift(
        session
    );


    // Limita o histórico
    // às últimas 100 sessões

    if (
        history.length > 100
    ) {

        history =
            history.slice(
                0,
                100
            );

    }


    localStorage.setItem(

        "physioHistory",

        JSON.stringify(
            history
        )

    );
}


// ==========================
// FINALIZAR
// ==========================

function finishExercise() {

    running = false;


    clearInterval(
        timer
    );


    timer = null;


    const totalTime =
        performance.now() -
        startTime;


    timerDisplay.textContent =
        formatTime(
            totalTime
        );


    finalTime.textContent =
        formatTime(
            totalTime
        );


    status.textContent =
        "CONCLUÍDO";


    // SALVA AUTOMATICAMENTE

    saveSession(
        totalTime
    );


    exerciseArea.classList.add(
        "hidden"
    );


    setup.classList.add(
        "hidden"
    );


    startButton.classList.add(
        "hidden"
    );


    finished.classList.remove(
        "hidden"
    );


    seriesResults.innerHTML =
        "";


    seriesTimes.forEach(
        (
            time,
            index
        ) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "series-result";


            item.innerHTML = `

                <span>
                    SÉRIE ${index + 1}
                </span>

                <strong>
                    ${formatTime(time)}
                </strong>

            `;


            seriesResults.appendChild(
                item
            );

        }
    );
}


// ==========================
// TERMINAR SÉRIE
// ==========================

function completeSeries() {

    const now =
        performance.now();


    const seriesTime =
        now -
        seriesStartTime;


    seriesTimes.push(
        seriesTime
    );


    if (
        currentSeries >=
        totalSeries
    ) {

        count =
            totalReps;


        updateCounter();


        finishExercise();


        return;
    }


    currentSeries++;


    count = 0;


    seriesStartTime =
        now;


    status.textContent =
        `SÉRIE ${currentSeries}`;


    updateSettings();
}


// ==========================
// +
// ==========================

function addRepetition() {

    if (!running) {
        return;
    }


    if (
        count >=
        totalReps
    ) {
        return;
    }


    count++;


    updateCounter();


    if (
        count >=
        totalReps
    ) {

        completeSeries();

    }
}


// ==========================
// -
// ==========================

function removeRepetition() {

    if (!running) {
        return;
    }


    if (
        count <= 0
    ) {
        return;
    }


    count--;


    updateCounter();
}


// ==========================
// POINTER ACTION
// ==========================

function addPointerAction(
    element,
    action
) {

    element.addEventListener(

        "pointerdown",

        (event) => {

            event.preventDefault();

            action();

        },

        {
            passive: false
        }

    );
}


// ==========================
// BOTÕES PRINCIPAIS
// ==========================

addPointerAction(
    plus,
    addRepetition
);


addPointerAction(
    minus,
    removeRepetition
);


// ==========================
// CONFIGURAÇÃO
// ==========================

addPointerAction(

    seriesPlus,

    () => {

        if (running)
            return;


        if (
            totalSeries >= 99
        )
            return;


        totalSeries++;


        updateSettings();

    }

);


addPointerAction(

    seriesMinus,

    () => {

        if (running)
            return;


        if (
            totalSeries <= 1
        )
            return;


        totalSeries--;


        updateSettings();

    }

);


addPointerAction(

    repsPlus,

    () => {

        if (running)
            return;


        if (
            totalReps >= 999
        )
            return;


        totalReps++;


        updateSettings();

    }

);


addPointerAction(

    repsMinus,

    () => {

        if (running)
            return;


        if (
            totalReps <= 1
        )
            return;


        totalReps--;


        updateSettings();

    }

);


// ==========================
// COMEÇAR
// ==========================

addPointerAction(
    startButton,
    startExercise
);


// ==========================
// RESET
// ==========================

addPointerAction(

    reset,

    () => {

        clearInterval(
            timer
        );


        timer = null;


        count = 0;


        currentSeries = 1;


        startTime = null;


        seriesStartTime =
            null;


        running = false;


        seriesTimes = [];


        status.textContent =
            "PRONTO";


        startButton.textContent =
            "COMEÇAR";


        startButton.disabled =
            false;


        setup.classList.remove(
            "hidden"
        );


        setup.style.opacity =
            "1";


        exerciseArea.classList.remove(
            "hidden"
        );


        finished.classList.add(
            "hidden"
        );


        startButton.classList.remove(
            "hidden"
        );


        timerDisplay.textContent =
            "00:00.000";


        updateSettings();

    }

);


// ==================================================
// HISTÓRICO
// ==================================================


// ==========================
// RENDERIZAR HISTÓRICO
// ==========================

function renderHistory() {

    historyList.innerHTML =
        "";


    historyCount.textContent =

        history.length === 1

            ? "1 sessão"

            : `${history.length} sessões`;


    if (
        history.length === 0
    ) {

        emptyHistory.classList.remove(
            "hidden"
        );

        return;
    }


    emptyHistory.classList.add(
        "hidden"
    );


    history.forEach(
        (session) => {

            const item =
                document.createElement(
                    "div"
                );


            item.className =
                "history-item";


            const chips =
                session.seriesTimes
                    .map(
                        (
                            time,
                            index
                        ) => `

                        <span
                            class="history-series-chip"
                        >
                            S${index + 1}
                            ${formatTime(time)}
                        </span>

                    `
                    )
                    .join("");


            item.innerHTML = `

                <div
                    class="history-item-top"
                >

                    <span
                        class="history-date"
                    >
                        ${formatDate(
                            session.date
                        )}
                    </span>

                    <span
                        class="history-time"
                    >
                        ${formatClock(
                            session.date
                        )}
                    </span>

                </div>


                <div
                    class="history-main"
                >

                    <span
                        class="history-exercise"
                    >
                        ${session.series}
                        ×
                        ${session.repetitions}
                        REPETIÇÕES
                    </span>

                    <strong
                        class="history-total"
                    >
                        ${formatTime(
                            session.totalTime
                        )}
                    </strong>

                </div>


                <div
                    class="history-series"
                >
                    ${chips}
                </div>


                <button
                    class="delete-session"
                    type="button"
                    data-id="${session.id}"
                >
                    ×
                </button>

            `;


            historyList.appendChild(
                item
            );

        }
    );
}


// ==========================
// ABRIR HISTÓRICO
// ==========================

addPointerAction(

    historyButton,

    () => {

        renderHistory();

        historyModal.classList.remove(
            "hidden"
        );

    }

);


// ==========================
// FECHAR HISTÓRICO
// ==========================

addPointerAction(

    closeHistory,

    () => {

        historyModal.classList.add(
            "hidden"
        );

    }

);


// ==========================
// FECHAR CLICANDO FORA
// ==========================

document
    .querySelector(
        ".modal-background"
    )
    .addEventListener(
        "pointerdown",
        () => {

            historyModal.classList.add(
                "hidden"
            );

        }
    );


// ==========================
// DELETAR SESSÃO
// ==========================

historyList.addEventListener(

    "pointerdown",

    (event) => {

        const button =
            event.target.closest(
                ".delete-session"
            );


        if (!button) {
            return;
        }


        event.preventDefault();


        const id =
            Number(
                button.dataset.id
            );


        history =
            history.filter(
                session =>
                    session.id !== id
            );


        localStorage.setItem(

            "physioHistory",

            JSON.stringify(
                history
            )

        );


        renderHistory();

    },

    {
        passive: false
    }

);


// ==========================
// APAGAR TUDO
// ==========================

addPointerAction(

    clearHistory,

    () => {

        if (
            history.length === 0
        ) {
            return;
        }


        const confirmed =
            confirm(
                "Apagar todo o histórico?"
            );


        if (!confirmed) {
            return;
        }


        history = [];


        localStorage.removeItem(
            "physioHistory"
        );


        renderHistory();

    }

);


// ==========================
// ESTADO INICIAL
// ==========================

updateSettings();


timerDisplay.textContent =
    "00:00.000";


// ==========================
// SERVICE WORKER
// ==========================

if (
    "serviceWorker" in navigator
) {

    window.addEventListener(

        "load",

        () => {

            navigator.serviceWorker
                .register("./sw.js")
                .then(() => {

                    console.log(
                        "Physio Counter offline ativo."
                    );

                })
                .catch(
                    (error) => {

                        console.error(
                            "Erro no Service Worker:",
                            error
                        );

                    }
                );

        }

    );

}