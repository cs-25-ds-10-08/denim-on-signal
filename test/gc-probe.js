let gc = require ('gc-stats')()

let _gc_counter = 0;
gc.on ('stats', (stats)=> {
	console.log (`GC happened ${_gc_counter}`)
	_gc_counter ++
})

function allocateMemory(size) {
	// Simulate allocation of bytes
	const numbers = size / 8;
	const arr = [];
	arr.length = numbers;
	for (let i = 0; i < numbers; i++) {
	  arr[i] = i;
	}
	return arr;
      }

function main () {
	const memoryLeakAllocations = [];
	
	const field = "heapUsed";
	const allocationStep = 10000 * 1024; // 10MB
	
	const TIME_INTERVAL_IN_MSEC = 40;
	
	setInterval(() => {
	const allocation = allocateMemory(allocationStep);
	
	memoryLeakAllocations.push(allocation);
	
	const mu = process.memoryUsage();
	// # bytes / KB / MB / GB
	const gbNow = mu[field] / 1024 / 1024 / 1024;
	const gbRounded = Math.round(gbNow * 100) / 100;
	
	// console.log(`Heap allocated ${gbRounded} GB`);
	}, TIME_INTERVAL_IN_MSEC);
}

try {
	main ()
} catch (err) {

	console.log (err)
}

console.log (`GC counter ${_gc_counter}`)