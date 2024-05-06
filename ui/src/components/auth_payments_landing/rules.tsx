import { Component } from "solid-js";
import Header from "./header";
import Footer from "./footer";
import HeaderMobile from "./header_mobile.jsx";

const Rules: Component = () => {
  return (
    <>
      <div class="bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 px-4 text-gray-200">
        <div class="flex flex-col   max-w-7xl mx-auto min-h-screen">
          <div class="hidden md:block">
            <Header />
          </div>
          <div class="block md:hidden">
            <HeaderMobile />
          </div>

          <main class="flex flex-col justify-center items-center   gap-4   text-gray-300 ">
            <div class="text-3xl font-bold text-center">Game Rules</div>
            <div class="w-full mb-4 text-base md:text-lg">
              <video controls class="w-full h-auto shadow-lg">
                <source
                  src="https://media.commonlyodd.com/payment_succes_video.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div class="md:max-w-4xl md:mx-auto px-4 text-lg   ">
              <p class="mt-2 mx-8 py-2">
                Commonly Odd is a trivia game that can be played by a single
                player or a group (up to 10 teams). Each team goes one after the
                other in a round robin style.
              </p>
              <p class="mt-2 mx-8 py-2">
                Players are presented with four items per round. The team must
                correctly determine which of four items is the outlier and the
                commonality shared by the other three. Each round is
                time-limited to 10 seconds.
              </p>

              <div class="text-2xl font-bold text-center mt-4  ">
                Setting Up the Game
              </div>
              <ul class="list-disc pl-8 mt-2">
                <li class="py-2">
                  <span class="font-bold">Session Creation:</span> A designated
                  individual, the session starter, sets up the game session.
                  They select the number of participating teams (up to 10) and
                  the total score goal (up to 30).
                </li>
                <li class="py-2">
                  <span class="font-bold">Link Distribution:</span> A unique
                  session link is generated for sharing with other players.
                </li>
                <li class="py-2">
                  <span class="font-bold">Game Commencement:</span> The session
                  starter initiates the game once all players are on the same
                  game session link.
                </li>
              </ul>

              <div class="text-2xl font-bold text-center mt-4">
                Scoring Points
              </div>
              <ul class="list-disc pl-8 mt-2">
                <li class="py-2">
                  <span class="font-bold">2:</span> Awarded for correctly
                  identifying the outlier and its exact reasoning.
                </li>
                <li class="py-2">
                  <span class="font-bold">1.5:</span> Given for correctly
                  identifying the outlier and partially correct reasoning.
                </li>
                <li class="py-2">
                  <span class="font-bold">1:</span> For partial correctness,
                  either in identifying the outlier or reasoning.
                </li>
                <li class="py-2">
                  <span class="font-bold">0:</span> For incorrect guesses or no
                  response.
                </li>
              </ul>

              <div class="text-2xl font-bold text-center mt-4">
                Winning the Game
              </div>
              <p class="mt-2 mx-8 py-2">
                The game is won by the first team to meet or exceed the target
                score. Post-game, the session starter can launch a new game or
                end the session.
              </p>

              <div class="text-2xl font-bold text-center mt-4">Gameplay</div>
              <ul class="list-disc pl-8 mt-2">
                <li class="py-2">
                  <span class="font-bold">Session Starter's Role:</span>{" "}
                  Controls game flow, including question selection, answer
                  reveals, and scorekeeping.
                </li>
                <li class="py-2">
                  <span class="font-bold">Time Constraint:</span> Teams have a
                  10-second window per round for decision-making.
                </li>
                <li class="py-2">
                  <span class="font-bold">Answer Revelation:</span> The session
                  starter reveals the correct answers after each round.
                </li>
                <li class="py-2">
                  <span class="font-bold">Scoring System:</span> Points are
                  awarded based on accuracy.
                </li>
                <li class="py-2">
                  <span class="font-bold">Sportsmanship:</span> Players are
                  encouraged to maintain a friendly and respectful environment
                  during gameplay.
                </li>
              </ul>

              <div class="text-2xl font-bold text-center mt-4">Terminology</div>
              <ul class="list-disc pl-8 mt-2">
                <li class="py-2">
                  <span class="font-bold">Session Starter:</span> The individual
                  responsible for initiating and managing the game session.
                </li>
                <li class="py-2">
                  <span class="font-bold">Session Link:</span> A unique URL used
                  by players to join the game session.
                </li>
                <li class="py-2">
                  <span class="font-bold">Outlier Object:</span> The object that
                  differs from the other three.
                </li>
                <li class="py-2">
                  <span class="font-bold">Commonality:</span> The shared
                  attribute or connection between three of the objects.
                </li>
                <li class="py-2">
                  <span class="font-bold">Game Session:</span> The period from
                  the start of the game until it ends or a new game begins.
                </li>
                <li class="py-2">
                  <span class="font-bold">Time Limit:</span> Each
                  decision-making round is restricted to 10 seconds.
                </li>
              </ul>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Rules;
