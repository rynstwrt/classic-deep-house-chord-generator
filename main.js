/* MAJOR 7CHORDS:  */
const major = {
	'C': ['C', 'E', 'G', 'B'],
	'Db': ['Db', 'F', 'G#', 'C'],
	'D': ['D', 'F#', 'A', 'Db'],
	'Eb': ['Eb', 'G', 'Bb', 'D'],
	'E': ['E', 'G#', 'B', 'Eb'],
	'F': ['F', 'A', 'C', 'E'],
	'F#': ['F#', 'Bb', 'Db', 'F'],
	'G': ['G', 'B', 'D', 'F#'],
	'G#': ['G#', 'C', 'Eb', 'G'],
	'A': ['A', 'Db', 'E', 'G#'],
	'Bb': ['Bb', 'D', 'F', 'A'],
	'B': ['B', 'Eb', 'F#', 'Bb']
};

/* MINOR 7CHORDS:  */
const minor = {
	'C': ['C', 'Eb', 'G', 'Bb'],
	'Db': ['Db', 'Fb', 'G#', 'Cb'],
	'D': ['D', 'F', 'A', 'C'],
	'Eb': ['Eb', 'F#', 'Bb', 'Db'],
	'E': ['E', 'G', 'B', 'D'],
	'F': ['F', 'G#', 'C', 'Eb'],
	'F#': ['F#', 'A', 'Db', 'Fb'],
	'G': ['G', 'Bb', 'D', 'F'],
	'G#': ['G#', 'Cb', 'Eb', 'F#'],
	'A': ['A', 'C', 'E', 'G'],
	'Bb': ['Bb', 'Db', 'F', 'G#'],
	'B': ['B', 'D', 'F#', 'A']
};

/* chord progression chart */
const arow = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
const brow = ['B', 'C#', 'D', 'E', 'F#', 'G', 'A'];
const crow = ['C', 'D', 'Eb', 'F', 'G', 'A', 'Bb', 'C'];
const drow = ['D', 'E', 'F', 'G', 'A', 'Bb', 'C'];
const erow = ['E', 'F#', 'G', 'A', 'B', 'C', 'D'];
const frow = ['F', 'G', 'G#', 'Bb', 'C', 'Db', 'Eb'];
const grow = ['G', 'A', 'Bb', 'C', 'D', 'Eb', 'F'];



function getWhichRow(key)
{
	if (key === 'A' || key  === 'G#')
		return arow;
	else if (key === 'B' || key ==="Bb")
		return brow;
	else if (key === 'C' || key ==="Cb")
		return crow;
	else if (key === 'D' || key ==="Db")
		return drow;
	else if (key === 'E' || key ==="Eb")
		return erow;
	else if (key === 'F' || key ==="Fb")
		return frow;
	else if (key === 'G' || key ==="F#")
		return grow;
}



function decideWhichPattern()
{
	const distinctNums = [];
	// get three distinct numbers for indexes representing i, iio, III, iv, v, VI, VII
	while (distinctNums.length < (document.getElementById("numChordsSelect").value - 1))
	{
		const rNum = Math.floor((Math.random() * 5) + 2);
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

	console.log( minor[possibleFirstChords[Math.floor(Math.random() * possibleFirstChords.length)]]);
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
	const octave = document.getElementById("octaveSelect").value;
	for (let i = 0; i < chords.length; i++)
	{
		let chord = chords[i];
		chord = chord.map(i => i + octave);
		Tone.Transport.schedule((time) =>
		{
			synth.triggerAttackRelease(chord[0], '8n', time);
		}, i / 2);
	}

	Tone.Transport.toggle();
}



function getMajorMinor(index)
{
	return (index === 2 || index === 5 || index === 6) ? "" : "m";
}



const synth = new Tone.MonoSynth(4, Tone.PluckSynth).toMaster();
document.getElementById("generatebutton").addEventListener("click", () =>
{
	synth.triggerRelease();
	Tone.Transport.stop();

	const chords = [];

	const firstChord = selectFirstChord();
	chords.push(firstChord);

	const distinctNums = decideWhichPattern();

	const key = firstChord[0];
	const chosenRow = getWhichRow(key);

	const nextChords = getNextChords(distinctNums, chosenRow);
	nextChords.forEach(chord => { chords.push(chord) });

	nextChords.unshift(firstChord)
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
