/* MAJOR 7CHORDS:  */
const major = {
	'C': ['C', 'E', 'G', 'B'],
	'Db': ['Db', 'F', 'Ab', 'C'],
	'D': ['D', 'Gb', 'A', 'Db'],
	'Eb': ['Eb', 'G', 'Bb', 'D'],
	'E': ['E', 'Ab', 'B', 'Eb'],
	'F': ['F', 'A', 'C', 'E'],
	'Gb': ['Gb', 'Bb', 'Db', 'F'],
	'G': ['G', 'B', 'D', 'Gb'],
	'Ab': ['Ab', 'C', 'Eb', 'G'],
	'A': ['A', 'Db', 'E', 'Ab'],
	'Bb': ['Bb', 'D', 'F', 'A'],
	'B': ['B', 'Eb', 'F#', 'Bb']
};

/* MINOR 7CHORDS:  */
const minor = {
	'C': ['C', 'Eb', 'G', 'Bb'],
	'Db': ['Db', 'Fb', 'Ab', 'Cb'],
	'D': ['D', 'F', 'A', 'C'],
	'Eb': ['Eb', 'Gb', 'Bb', 'Db'],
	'E': ['E', 'G', 'B', 'D'],
	'F': ['F', 'Ab', 'C', 'Eb'],
	'Gb': ['Gb', 'A', 'Db', 'Fb'],
	'G': ['G', 'Bb', 'D', 'F'],
	'Ab': ['Ab', 'Cb', 'Eb', 'Gb'],
	'A': ['A', 'C', 'E', 'G'],
	'Bb': ['Bb', 'Db', 'F', 'Ab'],
	'B': ['B', 'D', 'Gb', 'A']
};

/* chord progression chart */
const arow = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const brow = ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'];
const crow = ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb', 'C'];
const drow = ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'];
const erow = ['E', 'F#', 'G', 'A', 'B', 'C', 'D'];
const frow = ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'];
const grow = ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'];


//const synth = new Tone.PolySynth(4, Tone.Synth).toMaster();
const synth = new Tone.MonoSynth(4, Tone.PluckSynth, {
}).toMaster();



document.getElementById("generatebutton").addEventListener("click", () =>
{
	synth.triggerRelease();
	Tone.Transport.stop();
	let chords = [];



	// get first minor chord (random)
	const minorChords = Object.keys(minor).map(key =>
	{
		return minor[key];
	});
	const possibleFirstChords = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
	const firstChord = minor[possibleFirstChords[Math.floor(Math.random() * possibleFirstChords.length)]];
	const key = firstChord[0];
	console.log("firstkey: " + firstChord);
	chords.push(firstChord);



	// get three distinct numbers for indexes representing i, iio, III, iv, v, VI, VII
	const distinctNums = [];
	while (distinctNums.length < 3)
	{
		const rNum = Math.floor((Math.random() * 5) + 2);
		if (!distinctNums.includes(rNum))
			distinctNums.push(rNum);


	}
	distinctNums.sort();

	let keyRow = [];
	if (key === 'A' || key  === 'Ab')
		keyRow = arow;
	else if (key === 'B' || key ==="Bb")
		keyRow = brow;
	else if (key === 'C' || key ==="Cb")
		keyRow = crow;
	else if (key === 'D' || key ==="Db")
		keyRow = drow;
	else if (key === 'E' || key ==="Eb")
		keyRow = erow;
	else if (key === 'F' || key ==="Fb")
		keyRow = frow;
	else if (key === 'G' || key ==="Gb")
		keyRow = grow;

	distinctNums.forEach(num =>
	{
		if (num === 2 || num === 5 || num === 6)
		{
			  // major
			  let newChord = major[keyRow[num]];
			  chords.push(newChord);
		}
		else
		{
			console.log(keyRow[num]);
			 // minor
			 let newChord = minor[keyRow[num]];
			 chords.push(newChord);
		}
	});



	for (let i = 0; i < chords.length; i++)
	{
		let chord = chords[i];
		console.log(chords);
		chord = chord.map(i => i + 4);
		Tone.Transport.schedule((time) =>
		{
			synth.triggerAttackRelease(chord[0], '8n', time);
		}, i / 2);
	}



	Tone.Transport.toggle();
	// set generated text
	let generatedText = "";
	chords.forEach(chord =>
	{
		generatedText += chord.join(" ");
		generatedText += "\r\n";
	});
	document.getElementById("generatedtext").textContent = generatedText;
});
