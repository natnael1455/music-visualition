


let w;
let h;
let SIZE = 0;

let music;
let file_selector;
let audioCtx ;
let analyser;
let bufferLength
let dataArray 
window.AudioContext = window.AudioContext || window.webkitAudioContext;


window.onload = function () {
	music = document.getElementById("music");
	file_selector = document.getElementById("file_selector");
	

	file_selector.addEventListener("change", function () {
		console.log(file_selector.files[0].name)
		let fReader = new FileReader();
		fReader.readAsDataURL(file_selector.files[0]);
		fReader.onloadend = function(event){
			music.src= event.target.result;
		}
	  });

	  music.addEventListener('play',  function () {
		//console.log(audioCtx);
		try {
			audioCtx = new AudioContext();
			let source = audioCtx.createMediaElementSource(music);
			//let gainNode = audioCtx.createGain();
			let sourceJs = audioCtx.createScriptProcessor(2048, 1, 1);
			let analyser = audioCtx.createAnalyser();
			analyser.smoothingTimeConstant = 0.6;
			analyser.fftSize = 512;
			source.connect(analyser);
			analyser.connect(sourceJs);
			source.connect(audioCtx.destination);
			sourceJs.connect(audioCtx.destination);
			sourceJs.addEventListener('audioprocess', function (e) {
				let array = new Uint8Array(analyser.frequencyBinCount);
				analyser.getByteFrequencyData(array);
				let averge = array.reduce(function(a, b){
					return a + b;
				}, 0)/array.length
				let v = Math.round(averge)
				SIZE = 2*v/255;
				display();
			});
			
		} catch (error) {
			
		}
		
	  });

	 
	
 	main();
    
}




function main(){
	display();
}



function display(){
	let canvas = document.getElementById("myCanvas");
	canvas.width=canvas.offsetWidth;
	canvas.height=canvas.offsetHeight;
	h= canvas.height
	w=canvas.width
	let xc=Math.round(w/2);
	let yc=Math.round(h/2);
	let ctx = canvas.getContext("2d");
	ctx.translate(xc,yc)
	mario(h,w,ctx,0,0,SIZE);
}



function mario(h,w,ctx,x,y,size){
	ctx.beginPath();
	var mario_h=h* size;
	var mario_w=w* size;
	let xo = x-(Math.round(mario_w/2));
	let yo = y-(Math.round(mario_h/2));
	mario_image = new Image();
	mario_image.src = 'mario.png';
	mario_image.onload = function(){
    ctx.drawImage(mario_image,xo,yo,mario_w,mario_h);
  	}
}

