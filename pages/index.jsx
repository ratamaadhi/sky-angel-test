import axios from 'axios';
import Head from 'next/head';
import { useEffect, useState } from 'react';
import { Aircraft } from '../components/Aircraft';
import { Cloud } from '../components/Cloud';
import Flybird from '../components/Flybird';
import MyModal from '../components/Modal';
import Parachute from '../components/Parachute';
import Star from '../components/Star';

function ResultGame({ time = 0, star = 0, setName = () => {} }) {
  return (
    <div>
      <h2 className="text-base">Time : {time}</h2>
      <h2 className="text-base">Star : {star}</h2>
      <input
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mt-2"
        id="playername"
        type="text"
        placeholder="Your Name"
        onChange={(e) => setName(e.target.value)}
      />
    </div>
  );
}

export default function Home() {
  const [modalState, setModalState] = useState({
    isShow: false,
    title: '',
    desc: '',
    textButton: 'oke',
  });
  const [player, setPlayer] = useState({
    name: '',
    time: 0,
    star: 0,
  });
  const [action, setAction] = useState('');
  const aircraft = new Aircraft(1024 / 8, 768 / 2);
  let intervalGame;
  let intervalFuel;
  let canvas;
  let ctx;
  let lastBirdSpawnAt = Date.now();
  let lastCloudSpawnAt = Date.now();
  let lastParaSpawnAt = Date.now();
  let lastStarSpawnAt = Date.now();
  let isStart = false;

  const randomNumber = (min, max) => Math.random() * max + min;
  const birds = [];
  const clouds = [];
  const parachutes = [];
  const stars = [];

  function clearIntervalGame() {
    clearInterval(intervalGame);
    clearInterval(intervalFuel);
    intervalGame = null;
    intervalFuel = null;
  }

  function startGame() {
    canvas = document.getElementById('myCanvas');
    if (!intervalFuel) {
      intervalFuel = setInterval(() => {
        if (aircraft.fuel > 0) {
          aircraft.decreaseFuel();
          aircraft.increaseTime();
        }
      }, 1000);
    }
    if (!intervalGame) {
      intervalGame = setInterval(() => {
        ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, 1024, 768);

        const random = randomNumber(100, 700);
        if (Date.now() - lastBirdSpawnAt > 1000) {
          const newBird = Flybird(1026, random);
          birds.push(newBird);
          lastBirdSpawnAt = Date.now();
        }

        const randomClouds = randomNumber(-50, 700);
        if (Date.now() - lastCloudSpawnAt > 1000) {
          const newCloud = new Cloud(1060, randomClouds);
          clouds.push(newCloud);
          lastCloudSpawnAt = Date.now();
        }

        const randomParahcure = randomNumber(0, 1000);
        if (Date.now() - lastParaSpawnAt > 3500) {
          const newPara = Parachute(randomParahcure, -50);
          parachutes.push(newPara);
          lastParaSpawnAt = Date.now();
        }

        const randomStar = randomNumber(0, 1000);
        if (Date.now() - lastStarSpawnAt > 2500) {
          const newStar = Star(randomStar, -50);
          stars.push(newStar);
          lastStarSpawnAt = Date.now();
        }

        clouds
          .filter((cloud) => !cloud.isDespawn())
          .forEach((cl) => {
            cl.update();
            cl.draw(ctx);
          });

        parachutes
          .filter((pr) => !pr.isDead())
          .forEach((prct) => {
            prct.update(aircraft);
            prct.draw(ctx);
          });

        stars
          .filter((st) => !st.isDead())
          .forEach((str) => {
            str.update(aircraft);
            str.draw(ctx);
          });

        birds
          .filter((enemy) => !enemy.isDead())
          .forEach((bird) => {
            bird.update(aircraft);
            bird.draw(ctx);
          });

        aircraft.update();
        aircraft.draw(ctx);

        if (aircraft.ending) {
          setAction('GAME_OVER');
          setPlayer({
            name: '',
            time: aircraft.time,
            star: aircraft.star,
          });
          setModalState({
            ...modalState,
            isShow: true,
            title: 'GAME OVER',
            desc: () => (
              <ResultGame
                time={aircraft.time}
                star={aircraft.star}
                setName={(name) => setPlayer({ ...player, name })}
              />
            ),
            textButton: 'Continue',
          });
          clearIntervalGame();
        }
      }, 1000 / 30);
    }
  }

  function submitGame() {
    return axios.post('http://xxxxxxxxx/register.php', {
      name: player.name,
      time: player.time,
      stars: player.star,
    });
  }

  function setRecordPlayer() {
    const recordPlayer = { ...player };
    let storagePlayer = JSON.parse(localStorage.getItem('record'));
    if (!storagePlayer) {
      storagePlayer = [recordPlayer];
    } else {
      storagePlayer = [...storagePlayer, recordPlayer];
    }

    localStorage.setItem('record', JSON.stringify(storagePlayer));
  }

  function handleActionModal() {
    console.log('action', action);

    if (!action) return;
    if (action === 'GAME_OVER') {
      // action game over
      console.log('player.name', player.name);
      if (!player.name) return;
      submitGame()
        .then((res) => {
          handleCloseModal();
          newGame();
        })
        .catch((err) => {
          setRecordPlayer();
          handleCloseModal();
          newGame();
        });
      setAction('');
    }
    if (action === 'START_OVER') {
      handleCloseModal();
      startGame();
      setAction('');
    }
  }

  function handleCloseModal() {
    setModalState({
      ...modalState,
      isShow: false,
      title: '',
      desc: '',
      textButton: 'oke',
    });
  }

  function handleKeydown(e) {
    console.log('e.keyCode', e.keyCode);
    console.log('isStart', isStart);
    if (e.keyCode === 32) {
      if (aircraft.ending) return;
      if (action === 'START_OVER') return;
      if (isStart) {
        clearIntervalGame();
      } else {
        startGame();
      }
      isStart = !isStart;
    }
  }

  function newGame() {
    setModalState({
      ...modalState,
      isShow: true,
      title: 'Start Game',
      desc: "Hit 'Space' for start or pause",
      textButton: 'Start',
    });
    setAction('START_OVER');
    aircraft.ending = false;
    aircraft.time = 0;
    aircraft.star = 0;
    aircraft.fuel = 10;
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeydown);
    newGame();

    return () => {
      window.removeEventListener('keydown', handleKeydown);
    };
  }, []);

  return (
    <div className="w-full h-screen">
      <MyModal
        show={modalState.isShow}
        title={modalState.title}
        desc={modalState.desc}
        action={handleActionModal}
        closeModal={handleCloseModal}
        textButton={modalState.textButton}
      />

      <Head>
        <title>Sky Angel</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="w-full h-full flex flex-row items-center justify-center">
        <canvas
          id="myCanvas"
          width="1024"
          height="768"
          className="border border-black bg-[#BFEAF5]"
        />
      </div>
    </div>
  );
}
