import { Button } from '@/components/ui/button';
import { handleClick } from './workers/mainthread';
import {useToast} from '@/hooks/use-toast';
import { useRef } from 'react';


export default function Workers() {
  const { toast } = useToast();
  const divRef = useRef<HTMLDivElement>(null);
   const handleWorkerClick = (_: React.MouseEvent<HTMLButtonElement> | null, message: string) => {
    toast({
      title: "Worker Clicked",
      description: `${message}`,
    });
  }
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-4xl font-bold mb-4">Workers Page</h1>
      <p className="text-lg text-gray-600">This is where you can manage your workers.</p>

      <div 
        className="h-[160px] w-full bg-gray-200 mt-6 cursor-pointer" 
        onClick={(e) => handleClick(e, divRef, handleWorkerClick)}>
        <div 
          className="h-10 w-10 bg-blue-500 rounded-full transition-transform duration-500 ease-in-out"
          ref={divRef}
        />
      </div>
      <Button onClick={(event) => handleWorkerClick(event, "You have clicked the worker button.")} className="mt-6">Click LAST</Button>
    </div>
  );
}