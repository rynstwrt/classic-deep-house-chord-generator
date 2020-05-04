const generateButtonId = "generateButton";
const generatedTextWrapperId = "textWrapper";
const textSelector = "#textWrapper h2";
const numChordsId = "chordCountSelect";
const octaveId = "octaveSelect";


/* MAJOR 7CHORDS:  */
const major = {
	'C': ['C', 'E', 'G', 'B'],
	'C#': ['C#', 'F', 'G#', 'C'],
	'Db': ['Db', 'F', 'Ab', 'C'],
	'D': ['Db', 'F', 'Ab', 'C'],
	'D#': ['D#', 'G', 'A#', 'D'],
	'Eb': ['Eb', 'G', 'Bb', 'D'],
	'E': ['E', 'G#', 'B', 'D#'],
	'F': ['F', 'A', 'C', 'E'],
	'F#': ['F#', 'A#', 'C#', 'F'],
	'Gb': ['Gb', 'Bb', 'Db', 'F'],
	'G': ['G', 'B', 'D', 'F#'],
	'G#': ['G#', 'C', 'D#', 'G'],
	'Ab': ['Ab', 'C', 'Eb', 'G'],
	'A': ['A', 'C#', 'E', 'G#'],
	'A#': ['A#', 'D', 'F', 'A'],
	'Bb': ['Bb', 'D', 'F', 'A'],
	'B': ['B', 'D#', 'F#', 'A#']
};

/* MINOR 7CHORDS:  */
const minor = {
	'C': ['C', 'Eb', 'G', 'Bb'],
	'C#': ['C#', 'E', 'G#', 'B'],
	'Db': ['Db', 'E', 'Ab', 'B'],
	'D': ['D', 'F', 'A', 'C'],
	'D#': ['D#', 'F#', 'A#', 'C#'],
	'Eb': ['Eb', 'Gb', 'Bb', 'Db'],
	'E': ['E', 'G', 'B', 'D'],
	'F': ['F', 'Ab', 'C', 'Eb'],
	'F#': ['F#', 'A', 'C#', 'E'],
	'Gb': ['Gb', 'A', 'Db', 'E'],
	'G': ['G', 'Bb', 'D', 'F'],
	'G#': ['G#', 'B', 'D#', 'F#'],
	'Ab': ['Ab', 'B', 'Eb', 'Gb'],
	'A': ['A', 'C', 'E', 'G'],
	'A#': ['A#', 'C#', 'F', 'G#'],
	'Bb': ['Bb', 'Db', 'F', 'Ab'],
	'B': ['B', 'D', 'F#', 'A']
};

/* chord progression chart */
const arow = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const brow = ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'];
const crow = ['C', 'D', 'Eb', 'F', 'G', 'Ab', 'Bb'];
const drow = ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'];
const erow = ['E', 'F#', 'G', 'A', 'B', 'C', 'D'];
const frow = ['F', 'G', 'Ab', 'Bb', 'C', 'Db', 'Eb'];
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
	const patternsFour = [[5, 6, 0, 0], [0, 5, 2, 6], [0, 1, 4, 0], [0, 5, 3, 4], [0, 5, 1, 4], [0, 4, 5, 3], [0, 3, 5, 4], [0, 2, 3, 4], [0, 3, 0, 4], [0, 3, 1, 4], [0, 4, 0, 3], [0, 4, 5, 4], [0, 6, 0, 1], [0, 2, 3, 6]];
	const patternsThree = [[0, 3, 6], [0, 3, 4], [0, 5, 6], [0, 3, 0], [1, 4,  0]];

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

	return pattern[randNum];
}



function getChords(distinctNums, chosenRow)
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

	let chords = [];

	const decidedPattern = decideWhichPattern();
	const keys = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
	const keyNum = Math.floor(Math.random() * (keys.length - 1));
	const key = keys[keyNum];
	const chosenRow = getWhichRow(key);

	chords = getChords(decidedPattern, chosenRow);

	playChords(chords);

	let generatedText = "";
	chords.forEach((chord, i) =>
	{
		const scaleName = chord[0];
		const majorminor = getMajorMinor(i);
		generatedText += scaleName + majorminor + ": ";
		generatedText += chord.join(", ");
		generatedText += "\r\n";
	});

	document.getElementById(generatedTextWrapperId).style.display = "block";
	document.querySelector(textSelector).textContent = generatedText;
});
