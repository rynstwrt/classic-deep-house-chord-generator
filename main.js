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
	const distinctNums = [];
	const numChords = document.getElementById("numChordsSelect").value - 1;

	// get three numbers for indexes representing i, iio, III, iv, v, VI, VII
	while (distinctNums.length < numChords)
	{
		const rNum = Math.floor((Math.random() * 5) + 1);
		if (!distinctNums.includes(rNum))
			distinctNums.push(rNum);
	}
	distinctNums.sort();

	return distinctNums;
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

	synth.triggerRelease();
	Tone.Transport.stop();

	const octave = document.getElementById("octaveSelect").value;
	chords = chords.map(x => x.map(y => y + octave));

	console.log(chords.length);

	for (let i = 0; i < chords.length; i++)
	{
		let chord = chords[i];

		Tone.Transport.schedule((time) =>
		{
			console.log('triggerd');
			synth.triggerAttackRelease(chord[0], '8n', time);
		}, (i / 2));
	}

	Tone.Transport.toggle();
}



function getMajorMinor(index)
{
	return (index === 2 || index === 5 || index === 6) ? "" : "m";
}



const synth = new Tone.Synth().toMaster();
document.getElementById("generatebutton").addEventListener("click", () =>
{


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
	document.getElementById("generatedtext").textContent = generatedText;
});
