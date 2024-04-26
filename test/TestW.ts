
import * as fastq from "fastq";
import type { queueAsPromised } from "fastq";

type SignalWorkQueueTask = () => any

let workQueue: queueAsPromised<SignalWorkQueueTask> = fastq.promise( (j) => j (), 1 )


function chaos (i) {
	let j = 10; 
	return new Promise ((resolve, reject) => {
		function f () {
			console.log (`chaos ${i}`)
			if (j -- > 0 ) {
				setTimeout(f, 10)
			} else {
				resolve (i)
			}
		} 
		f () 
	})
}


(async () => {

	for (let i = 0; i < 10; i++) {
		await workQueue.push (() => chaos (i))
		console.log("---")
	}

} )  ()