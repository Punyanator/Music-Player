import playbutton from './assets/play-button-simple-svgrepo-com.svg';
import skipbutton from './assets/skip-next-svgrepo-com.svg'
import previousbutton from './assets/skip-previous-svgrepo-com.svg'
import resetbutton from './assets/reset-svgrepo-com.svg'
import loopbutton from './assets/loop-svgrepo-com.svg'
import pausebutton from './assets/pause-svgrepo-com.svg'
import queuebutton from './assets/queue-svgrepo-com.svg'

import { useEffect, useRef, useState } from 'react';

 function Musicplayer(){
    const [image, setImage] = useState(playbutton)
    const [duration, setDuration] = useState(0)
    const [playback, setPlayback] = useState (0)
    const [songname, setSong] = useState("[SongName]")
    const [songs, setSongs] = useState([])
    const [listdisplay, setlistdisplay] = useState("invisible")
    const [AudioURL, setAudioURL] = useState("")
    const [progresswidth, setwidth] = useState(100)
    const [left, setLeft] = useState()
    const musiclist = useRef(null)
    const Audioelement = useRef(null)
    const musicplayerovr = useRef(null)
    const seekbarelement = useRef(null)
    useEffect(() => {
        if (musiclist.current) {
    setLeft(-1 * musiclist.current.offsetWidth);
            }
        }, []);
    const formatTime =  (x) => {
        return `${Math.trunc(x/60)}:${String(Math.trunc(x)%60).padStart(2,"0")}`;
    }
    const handlefile = (event) => {
        let newsongs = Array.from(event.target.files).map(file => ({ 'name' : file.name , 'url' : URL.createObjectURL(file)

        }))
        setSongs(newsongs);
        alert(newsongs[0].name);
        setSong(newsongs[0].name);
        setAudioURL(newsongs[0].url);
    }


    useEffect(()=>{
        if(!Audioelement.current){ return;}

        let intervalID;
        setwidth(0);
        const handleaudioend = ()=>{
            setImage(playbutton);
        }      
        const startProgress = ()=>{
        setDuration(Audioelement.current.duration);
        
        intervalID = setInterval(()=>{
        setPlayback(Audioelement.current.currentTime);
        setwidth((Audioelement.current.currentTime/Audioelement.current.duration)* seekbarelement.current.offsetWidth)},1000)
        Audioelement.current.play();
        setImage(pausebutton);}
        
        Audioelement.current.load();
        Audioelement.current.addEventListener("loadedmetadata", startProgress);
        Audioelement.current.addEventListener("ended", handleaudioend);


        return () => {
        if(Audioelement.current){Audioelement.current.removeEventListener("loadedmetadata", startProgress);
         Audioelement.current.removeEventListener("ended", handleaudioend);}
        if (intervalID){ clearInterval(intervalID)};
  };
    }, [AudioURL])

    const skipaudio = () => {
         if(songs.length<=1){
            alert("no next song");
        }
        else{
        for (let i=0;i<songs.length;i++){
            if (songs[i].url == AudioURL){
                if(i==(songs.length-1)){
                    setAudioURL(songs[0].url)
                    setSong(songs[0].name)}
                
           else{ setAudioURL(songs[i+1].url)
            setSong(songs[i+1].name)}}
        }
    }
    }
    const previousaudio = () => {
        if(songs.length<=1){
            alert("no previous song");
        }
        else{
        for (let i=0;i<songs.length;i++){
            if (songs[i].url == AudioURL){
                if(i==0){
                    setAudioURL(songs[songs.length-1].url)
                    setSong(songs[songs.length-1].name)}
                else{ setAudioURL(songs[i-1].url)
                        setSong(songs[i-1].name)}
        }
        }
        }
        }
    
    const resetaudio = () => {
         if(!AudioURL){
            alert("no song added");
        }
        else{
        Audioelement.current.load();
        Audioelement.current.play();
        }
    }
    const playaudio = () =>  {
        if(!AudioURL){
            alert("no song added");
        }
        else{
        if(image ==pausebutton){
        
        Audioelement.current.pause();
    }
        else{
        Audioelement.current.play();
        
        }}
    }
    const choosemusic = (e) => {
        e.stopPropagation();
                for (let i=0;i<songs.length;i++){
            if (songs[i].name == e.target.innerText){
                
                    setAudioURL(songs[i].url);
                    setSong(songs[i].name)
            }
                }
            }
    const handleDisplay =  () =>{
        if(listdisplay=="invisible")setlistdisplay("visible");
        else{setlistdisplay("invisible");}

        musicplayerovr.current.classList.toggle("disabled");
        if(left==(-1*(musiclist.current.offsetWidth)))setLeft(0);
        else{setLeft(-1*(musiclist.current.offsetWidth));}


    }

    return(
        <div onClick={()=>{if(listdisplay=="visible") handleDisplay()}} ref={musicplayerovr} className='musicplayeroverall '>
            <ul ref={musiclist} onClick={(e)=>{e.stopPropagation()}} style ={{left:`${left}px`}} ><li>
                <img  onClick={(e)=>{e.stopPropagation();handleDisplay();}} className="queuebutton" src={queuebutton}/>
                </li>{songs.map((song) =>
                 <li onClick={choosemusic} key={song.url} style={song.url === AudioURL? { backgroundColor: "white", color: "black" }: {  }}>{song.name}</li> )}
                </ul>
            <div id="songchoicearea">
                <img  onClick={handleDisplay} className="queuebutton" src={queuebutton}></img>
                <label id="filebutton" for="file-input">Select Song(s)</label>
                <input id="file-input" style = {{display:'none'}} multiple type='file' accept="audio/*" onChange={handlefile}/>
            </div>
            <audio ref={Audioelement} onPlay={()=>setImage(pausebutton)} onPause={()=>setImage(playbutton)}>
                <source src={AudioURL} type='audio/mpeg'/>
            </audio>       
            <p id="songname">{songname}</p> 
            <p id="artistname">Artist Name</p>
            <div id="taskbar">
                <div className="controls">
                <img src={resetbutton} onClick={resetaudio}/>
                <img src={previousbutton} onClick={previousaudio}  alt="Previous button in controls" />
                <img src={image} onClick={playaudio}  alt="Play button in controls" />
                <img src={skipbutton} onClick={skipaudio} alt="Skip button in controls" />
                <img src={loopbutton}/>
                </div>
                
                <div id="playbackcontrol">
                <p>{formatTime(playback)}</p>
                <div ref={seekbarelement} id="seekbar"><span style ={{width:`${progresswidth}px`,position:'absolute', height:'1rem', backgroundColor:'green'}} id="progress"></span></div>
                <p>{formatTime(duration)}</p>
                </div>
            </div>
        </div>
    )
}


export default Musicplayer