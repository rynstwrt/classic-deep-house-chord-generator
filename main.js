const generateButtonId = "generateButton";
const generatedTextWrapperId = "textWrapper";
const textSelector = "#textWrapper h2";
const numChordsId = "chordCountSelect";
const octaveId = "octaveSelect";


/* MAJOR 7CHORDS:  */
const major = {
	'C': ['C', 'E', 'G', 'B'],
	'C#': ['D', 'E', 'Ab', 'C'],
	'D': ['D', 'F', 'A', 'C'],
	'Eb': ['Eb', 'F#', 'Bb', 'C#'],
	'E': ['E', 'G', 'B', 'D'],
	'F': ['F', 'Ab', 'C', 'Eb'],
	'F#': ['F#', 'A', 'C#', 'E'],
	'G': ['G', 'Bb', 'D', 'F'],
	'Ab': ['Ab', 'B', 'Eb', 'F#'],
	'A': ['A', 'C', 'E', 'G'],
	'Bb': ['Bb', 'C#', 'F', 'Ab'],
	'B': ['B', 'D', 'F#', 'A']
};

/* MINOR 7CHORDS:  */
const minor = {
	'C': ['C', 'Eb', 'G', 'Bb'],
	'C#': ['D', 'E', 'Ab', 'B'],
	'D': ['D', 'F', 'A', 'C'],
	'Eb': ['Eb', 'F#', 'Bb', 'C#'],
	'E': ['E', 'G', 'B', 'D'],
	'F': ['F', 'Ab', 'C', 'Eb'],
	'F#': ['F#', 'A', 'C#', 'E'],
	'G': ['G', 'Bb', 'D', 'F'],
	'Ab': ['Ab', 'B', 'Eb', 'F#'],
	'A': ['A', 'C', 'E', 'G'],
	'Bb': ['Bb', 'C#', 'F', 'Ab'],
	'B': ['B', 'D', 'F#', 'A']
};

/* chord progression chart */
const arow = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const brow = ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'];
const crow = ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'];
const drow = ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'];
const erow = ['E', 'F#', 'G', 'A', 'B', 'C', 'D'];
const frow = ['F', 'G', 'Ab', 'Bb', 'C', 'C#', 'Eb'];
const grow = ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'];



function getWhichRow(key)
{
	switch(key)
	{
		case 'A':
			return arow;
			break;
		case 'B':
			return brow;
			break;
		case 'C':
			return crow;
			break;
		case 'D':
			return drow;
			break;
		case 'E':
			return erow;
			break;
		case 'F':
			return frow;
			break;
		case 'G':
			return grow;
			break;
		default:
			return 'error';
			break;
	}
}



function decideWhichPattern()
{
	const numChords = document.getElementById(numChordsId).value - 1;

	// get numbers for indexes representing i, iio, III, iv, v, VI, VII
	// these patterns are same as normal chord progressions, but minus 1.
	const patternsFour = [[5, 2, 6], [1, 4, 0], [5, 3, 4], [5, 1, 4], [4, 5, 3], [3, 5, 4], [2, 3, 4], [3, 0, 4], [3, 1, 4]];
	const patternsThree = [[3, 6], [3, 4], [5, 6], [3, 0]];

	let pattern = [];
	switch (numChords)
	{
		case 2:
		 	pattern = patternsThree;
			break;
		case 3:
			pattern = patternsFour;
			break;
		default:
			pattern = "error";
			break;
	}

	const randNum = Math.floor((Math.random() * (pattern.length - 1)));
	console.log(pattern.length);
	console.log(randNum);
	console.log(pattern);

	return pattern[randNum];
}



function selectFirstChord()
{
	const minorChords = Object.keys(minor).map(key =>
	{
		return minor[key];
	});
	const possibleFirstChords = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

	return minor[possibleFirstChords[Math.floor(Math.random() * possibleFirstChords.length)]];
}



function getNextChords(distinctNums, chosenRow)
{
	const chords = [];

	distinctNums.forEach(num =>
	{
		const majorminor = getMajorMinor(num);
		if (majorminor === '')
		{
			  // major
			  const newChord = major[chosenRow[num]];
			  chords.push(newChord);
		}
		else
		{
			 // minor
			 const newChord = minor[chosenRow[num]];
			 chords.push(newChord);
		}
	});

	return chords;
}



function playChords(chords)
{
	console.log(chords);
	const octave = document.getElementById(octaveId).value;
	chords = chords.map(x => x.map(y => y + octave));
	const firstNotes = chords.map(x => x = x[0]);

	const sequence = [];
	for (let i = 0; i < firstNotes.length; i++)
	{
		const note = {};
		note.time = ((i == 0) ? 0 : ("0:" + (i / 2) + ":0"));
		note.note = firstNotes[i];
		sequence.push(note);
	}

	const part = new Tone.Part((time, event) =>
	{
		synth.triggerAttackRelease(event.note, '8n', event.note.time);
	}, sequence);

	part.start();

	Tone.Transport.toggle();
}



function getMajorMinor(index)
{
	return (index === 2 || index === 5 || index === 6) ? "" : "m";
}



const synth = new Tone.Synth().toMaster();
document.getElementById(generateButtonId).addEventListener("click", () =>
{

	Tone.Transport.stop();
	Tone.Transport.cancel();

	const chords = [];
	const nextChord = [];

	const firstChord = selectFirstChord();
	chords.push(firstChord);

	const distinctNums = decideWhichPattern();

	const key = firstChord[0];
	const chosenRow = getWhichRow(key);

	nextChords = getNextChords(distinctNums, chosenRow);
	nextChords.forEach(chord => { chords.push(chord) });

	nextChords.unshift(firstChord);
	playChords(nextChords);

	let generatedText = "";
	chords.forEach((chord, i) =>
	{
		const scaleName = chord[0];
		const majorminor = getMajorMinor(i);
		generatedText += scaleName + majorminor + ": ";
		generatedText += chord.join(" ");
		generatedText += "\r\n";
	});

	document.getElementById(generatedTextWrapperId).style.display = "block";
	document.querySelector(textSelector).textContent = generatedText;
});
