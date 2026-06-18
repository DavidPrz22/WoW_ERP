type WorkerMessage = {
    posx: number;
    posy: number;
}


export const handleClick = (
    e: React.MouseEvent<HTMLDivElement | HTMLButtonElement>, 
    divRef: React.RefObject<HTMLDivElement | null>,
    toastCallback: (event: React.MouseEvent<HTMLButtonElement> | null, message: string) => void
) => {
    const worker = new Worker(new URL('./worker.ts', import.meta.url));

    const posx = e.nativeEvent.offsetX;
    const posy = e.nativeEvent.offsetY;

    console.log(`Clicked at position: (${posx}, ${posy})`);

    worker.postMessage({ posx, posy } as WorkerMessage);
    worker.onmessage = function(event: MessageEvent<number>) {
        const { data: sum} = event;
        toastCallback(null, `Worker completed with result: ${sum}`);
        worker.terminate();
    }

    if (divRef.current) {
            divRef.current.style.transform = `translate(${posx}px, ${posy}px) translate(-50%, -50%)`;
    }
    
};