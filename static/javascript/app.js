let Developer = require('./developer.js');
{
	let me = new Developer('Robert', 27, 'JavaScript', 'HTML', 'CSS');
	console.log(me.sayHello());
}

// should be undefined
console.log('me is', typeof me);
