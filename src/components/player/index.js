import { useEffect, useRef, useState } from "react";

import './styles.css'

import Tippy from '@tippyjs/react';
import 'tippy.js/dist/tippy.css';

import UseAnimations from "react-useanimations";
import loading from 'react-useanimations/lib/loading';

export default function Player({ src, poster, title, description }) {

    const buttonFullscreen = useRef(null);
    const video = useRef(null);
    const [ playing, setPlaying ] = useState(false);
    const [ currentTime, setCurrentTime ] = useState('0:00');
    const [ currentTimeVideo, setCurrentTimeVideo ] = useState();
    const [ hoverValue, setHoverValue ] = useState(null);
    const [ hoverPosition, setHoverPosition ] = useState(null);
    const inputRangeRef = useRef();
    const [ exibirControls, setExibirControls ] = useState(true);
    const [ erroVideo, setErroVideo ] = useState(false);

    const [ widthClientTotal, setWidthClientTotal ] = useState();
    const [ heightClientTotal, setHeightClientTotal ] = useState();

    const [ carregandoVideo, setCarregandoVideo ] = useState(true);

    useEffect(()=>{

        function handleWindowResize() {
            const currentWidth = document.body.clientWidth;
            const currentHeight = document.body.clientHeight;

            setWidthClientTotal(window.screen.width);
            setHeightClientTotal(window.screen.height);
        }

        window.addEventListener('resize', handleWindowResize);
    
        return () => {
          window.removeEventListener('resize', handleWindowResize);
        };
    }, []);
    
    useEffect(()=> {
        setCarregandoVideo(true);
    }, [ video ]);
    
    const timeoutMensagemErro = useRef(null);

    const handlePlaying = ()=> {

        if (playing) {
            video.current.pause();
            setExibirControls(true);
            setPlaying(false)
        } else {
            video.current.play();
            setPlaying(true)
        }
    }

    const handleChange = (e)=> {
        const { currentTime } = e.target;
        setCurrentTime(formatTime(currentTime));
        setCurrentTimeVideo(video.current.currentTime);

        if (!video.current.paused && !playing) {
            setPlaying(true);
        }

        if (!video.current.paused && carregandoVideo) {
            setCarregandoVideo(false);
        }
    }

    function formatTime(currentTime) {
        const date = new Date(currentTime * 1000);
        const hours = date.getUTCHours();
        const minutes = date.getUTCMinutes();
        const seconds = date.getUTCSeconds();
        return (
          (hours ? hours + ":" : "") +
          String(minutes).padStart(hours ? 2 : 1, "0") +
          ":" +
          String(seconds).padStart(2, "0")
        );
    }

    const handleTimeChange = (event) => {
        const time = event.target.value;
        setCurrentTimeVideo(time)
        video.current.currentTime = time;
    };

    const handleMouseLeave = () => {
        setHoverValue(null)
    };

    const changePlay = ()=> {
        if (!playing) {
            handlePlaying();
        }
    }

    const handleMouseMove = (event) => {
        const { left, width } = inputRangeRef.current.getBoundingClientRect();
        const x = event.clientX - left;
        const value = (x / width) * inputRangeRef.current.max || 2460;
        setHoverValue(formatTime(value));
        setHoverPosition(x);
    };

    const getHoverPositionStyle = () => {
        if (inputRangeRef.current) {
            if (hoverPosition === null) {
              return { display: "none" };
            }
        
            const positionInPercentage = (hoverPosition / inputRangeRef.current.offsetWidth) * 100;
            const left = `calc(${positionInPercentage}% - 30px)`;
        
            return { left };
        }
    };
    
    const toggleFullscreen = () => {
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen();
        } else {
          if (document.exitFullscreen) {
            document.exitFullscreen();
          }
        }
    };

    useEffect(() => {
        const handleMouseMove = () => {
          setExibirControls(true);
          clearTimeout(timerId);
          timerId = setTimeout(() => {
            setExibirControls(false);
          }, 3000);
        };
    
        const handleMouseLeave = () => {
          clearTimeout(timerId);
          timerId = setTimeout(() => {
            setExibirControls(false);
          }, 3000);
        };
    
        let timerId;
    
        document.body.addEventListener('mousemove', handleMouseMove);
        document.body.addEventListener('mouseleave', handleMouseLeave);
    
        return () => {
          document.body.removeEventListener('mousemove', handleMouseMove);
          document.body.removeEventListener('mouseleave', handleMouseLeave);
          clearTimeout(timerId);
        };
    }, []);

    const recarregarVideo = () => {
        const meuVideo = video.current;
        meuVideo.src = meuVideo.src;
        setErroVideo(false)
    };
    
    const erroCarregarVideo = () => {

        setTimeout(() => {
            setErroVideo(true);
        }, 1000);
    };

    const loadDataVideo = () => {
        if (video.current.currentTime <= 1) {
            video.current.play();
        }
    }

    return (
        <div className="container">

            {/* Exibir section com temporadas e episódios */}
            {erroVideo &&
                <div className="div-erro-carregar-video">
                    <div className="content-erro-carregar-video">
                        <h3><i className="fa-solid fa-circle-exclamation"></i> Algo deu errado...</h3>
                        <p>Infelizmente, ocorreu um erro ao carregar o vídeo. Isso pode ter acontecido por um erro inesperado ou pelo fato de que o vídeo não está mais disponível.</p>
                        <section>
                            <button onClick={()=>recarregarVideo()}><i className="fa-solid fa-rotate-right"></i> Recarregar</button>
                        </section>
                    </div>
                </div>
            }

            {((video.current && exibirControls) || !playing) &&
                <div className="div-controls-player">
                    {(title || description) &&
                        <header>
                            <section>
                                {title &&
                                    <h2>{title}</h2>
                                }
                                {description && 
                                    <span className="span-info-movie">{description}</span>
                                }
                            </section>
                        </header>
                    }
                    {(!erroVideo) &&
                        <section className="progress-bar">
                            <input
                                ref={inputRangeRef}
                                className="current-time"
                                type="range"
                                min="0"
                                max={video.current ? video.current.duration : '2400'}
                                step="0.1"
                                value={currentTimeVideo || 0}
                                onChange={handleTimeChange}
                                onMouseLeave={handleMouseLeave}
                                onMouseMove={handleMouseMove}
                            />
                            {hoverValue !== null && (
                                <div className="hover-time" style={hoverValue && getHoverPositionStyle(hoverValue.percent)}
                                    >
                                    {hoverValue ? hoverValue : '00:00'}
                                </div>
                            )}
                        </section>
                    }
                    {(!erroVideo) &&
                        <section className="section-controls-player">
                            <section>
                                <span className="span-info-movie span-minutos-video"><p>{currentTime} / {formatTime((video.current && video.current.duration) ? video.current.duration : 2400)}</p></span>
                            </section>
                            {src &&
                                <section>
                                    <Tippy content="-10s">
                                        <button className="button-controls-player" onClick={()=>video.current.currentTime -= 10}><i className="fa-solid fa-rotate-left"></i></button>
                                    </Tippy>
                                    <Tippy content={playing ? 'Pause' : 'Play'}>
                                        <button className="button-controls-player" onClick={handlePlaying}>{playing ? <i className="fa-solid fa-pause"></i> : <i className="fa-solid fa-play"></i>}</button>
                                    </Tippy>
                                    <Tippy content="10s">
                                        <button className="button-controls-player" onClick={()=>video.current.currentTime += 10}><i className="fa-solid fa-rotate-right"></i></button>
                                    </Tippy>
                                </section>
                            }
                            <section>
                                <Tippy content="Configurações">
                                    <button className="button-controls-player"><i className="fa-solid fa-gear"></i></button>
                                </Tippy>
                                <Tippy content="Tela Cheia">
                                    <button className="button-controls-player" onClick={toggleFullscreen}><i className="fa-solid fa-expand"></i></button>
                                </Tippy>
                            </section>
                        </section>
                    }
                </div>
            }
            {src &&
                <div className="div-player">
                    <video src={src} ref={video} poster={poster} autoPlay={true} onDoubleClick={toggleFullscreen} onWaiting={()=>setCarregandoVideo(true)} onLoadedData={loadDataVideo} onCanPlayThrough={()=>setCarregandoVideo(false)} onClick={((widthClientTotal > heightClientTotal) && widthClientTotal <= 1100) ? ()=> setExibirControls(!exibirControls) : handlePlaying} onError={erroCarregarVideo} onPlay={changePlay} onTimeUpdate={(e)=>handleChange(e)}></video>
                    {(carregandoVideo && playing) &&
                        <section className="section-carregando-video">
                            <UseAnimations strokeColor={'#fff'} animation={loading} size={100} />
                        </section>
                    }
                </div>
            }
        </div>
    )
}
