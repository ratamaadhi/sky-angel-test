import axios from 'axios';
import Head from 'next/head';
import { useEffect, useRef, useState } from 'react';
import { Aircraft } from '../components/Aircraft';
import { Cloud } from '../components/Cloud';
import Flybird from '../components/Flybird';
import MyModal from '../components/Modal';
import Parachute from '../components/Parachute';
import Star from '../components/Star';

function isNullOrEmpty(str) {
  if (str === undefined || str == 'undefined') {
    return true;
  }
  if (str == null) {
    return true;
  }
  if (str == '') {
    return true;
  }
  if (str == 'null') {
    return true;
  }
  return false;
}

function ResultGame({ time = 0, star = 0, setName = () => {} }) {
  return (
    <div className="w-full mt-2">
      <div className="w-full flex justify-center space-x-3">
        <h2 className="text-base">Star : {star}</h2>
        <h2 className="text-base">Time : {time}</h2>
      </div>
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

function HistoryPlayer({ list = [] }) {
  let currentCount = -1;
  let currentRank = 0;
  let stack = 1;
  const newList =
    list &&
    list.length > 0 &&
    list
      .sort((a, b) => b.stars + b.time - (a.stars + b.time))
      .map((ls) => {
        const result = { ...ls };
        if (currentCount !== result.stars + result.time) {
          currentRank += stack;
          stack = 1;
        }

        result.rank = currentRank;
        currentCount = result.stars + result.time;
        return result;
      });
  return (
    <div className="border border-blue-100 rounded-md text-blue-900 px-4 py-2 mt-4">
      <h1 className="text-center text-base font-semibold mb-2">Player Rank</h1>
      <div className="max-h-24 overflow-y-scroll">
        {newList &&
          newList.length > 0 &&
          newList.map((player, idx) => (
            <div
              key={player?.id ?? idx}
              className="flex items-center mb-2 space-x-2"
            >
              <h2 className="text-base">No : {player.rank},</h2>
              <h2 className="text-base">Name : {player.name},</h2>
              <h2 className="text-base">Star : {player.stars},</h2>
              <h2 className="text-base">Time : {player.time}.</h2>
            </div>
          ))}
      </div>
    </div>
  );
}

export default function Home() {
  const hostname = useRef('');
  const [modalState, setModalState] = useState({
    isShow: false,
    title: '',
    desc: '',
    textButton: 'oke',
  });
  const [player, setPlayer] = useState({
    name: '',
    time: 0,
    stars: 0,
  });
  const [action, setAction] = useState('START_OVER');
  const aircraft = new Aircraft(1024 / 8, 768 / 2);
  let intervalGame;
  let intervalFuel;
  let canvas;
  let ctx;
  let lastBirdSpawnAt = Date.now();
  let lastCloudSpawnAt = Date.now();
  let lastParaSpawnAt = Date.now();
  let lastStarSpawnAt = Date.now();

  const randomNumber = (min, max) => Math.random() * max + min;
  let birds = [];
  let clouds = [];
  let parachutes = [];
  let stars = [];

  function startGame() {
    canvas = document.getElementById('myCanvas');
    if (!intervalFuel) {
      intervalFuel = setInterval(() => {
        if (aircraft.isStart) {
          if (aircraft.fuel > 0) {
            aircraft.decreaseFuel();
            aircraft.increaseTime();
          }
        }
      }, 1000);
    }
    if (!intervalGame) {
      intervalGame = setInterval(() => {
        if (aircraft.isStart) {
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
          if (Date.now() - lastStarSpawnAt > 1750) {
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
            const recordPlayer = JSON.parse(localStorage.getItem('record'));
            setAction('GAME_OVER');
            setModalState({
              ...modalState,
              isShow: true,
              title: 'GAME OVER',
              desc: () => (
                <>
                  <HistoryPlayer list={recordPlayer} />
                  <ResultGame
                    time={aircraft.time}
                    star={aircraft.star}
                    setName={(name) =>
                      setPlayer({
                        ...player,
                        name,
                        time: aircraft.time,
                        stars: aircraft.star,
                      })
                    }
                  />
                </>
              ),
              textButton: 'Continue',
            });
            aircraft.startPauseGame();
          }
        }
      }, 1000 / 30);
    }
  }

  function submitGame() {
    let record = JSON.parse(localStorage.getItem('record'));
    if (!record) {
      record = [];
    }
    return axios.post(
      // `http://localhost:3000/api/register`,
      `/api/register`,
      {
        name: player.name,
        time: player.time,
        stars: player.stars,
        record,
      },
      {
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: '*' },
          // ...
        ],
      }
    );
  }

  function handleActionModal() {
    if (!action) return;
    if (action === 'GAME_OVER') {
      // action game over
      const name = player.name.trim();
      if (isNullOrEmpty(name)) return;
      submitGame()
        .then((res) => {
          handleCloseModal();
          if (res.data) {
            const recordPlayer = res.data.data;
            if (recordPlayer.length > 0) {
              localStorage.setItem('record', JSON.stringify(recordPlayer));
            }
          }
          newGame();
        })
        .catch(() => {
          handleCloseModal();
          newGame();
        });
    }
    if (action === 'START_OVER') {
      handleCloseModal();
      aircraft.newGames();
      startGame();
      setAction('');
      // action = '';
    }
  }

  function handleCloseModal() {
    if (action === 'GAME_OVER') {
      const name = player.name.trim();
      if (isNullOrEmpty(name)) return;
      setAction('');
    }

    if (action === 'START_OVER') {
      startGame();
      setAction('');
    }
    setModalState({
      ...modalState,
      isShow: false,
      title: '',
      desc: '',
      textButton: 'oke',
    });
  }

  function newGame() {
    const recordPlayer = JSON.parse(localStorage.getItem('record'));
    setModalState({
      ...modalState,
      isShow: true,
      title: 'Start Game',
      desc: () => (
        <>
          <div>
            Pres <b>Space</b> for start or pause
          </div>
          <div>
            Pres <b>left</b> for go left
          </div>
          <div>
            Pres <b>right</b> for go right
          </div>
          <div>
            Pres <b>up</b> for go up{' '}
          </div>
          <div>
            Pres <b>down</b> for go down{' '}
          </div>
          <HistoryPlayer list={recordPlayer} />
        </>
      ),
      textButton: 'Start',
    });
    setAction('START_OVER');
    birds = [];
    clouds = [];
    parachutes = [];
    stars = [];
  }

  useEffect(() => {
    newGame();
    if (window !== undefined) {
      hostname.current = window.location.hostname;
    }

    return () => {};
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
