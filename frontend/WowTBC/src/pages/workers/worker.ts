type WorkerMessage = {
    posx: number;
    posy: number;
}

onmessage = function(event: MessageEvent<WorkerMessage>) {
    const { data } = event;

    console.log("worker data: ", data)
    let sum = 0;
    for (let i = 0; i < 100000000; i++) {
        sum += Math.sqrt(data.posx) + Math.sin(data.posy) + Math.cos(i);
    }
    postMessage(sum as number);
}