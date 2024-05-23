import { Component } from "solid-js";
import Header from "./header";
import Footer from "./footer";
import HeaderMobile from "./header_mobile.jsx";
import { CancelOutlined, CheckCircleOutline } from "@suid/icons-material";

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
                  src="https://media.commonlyodd.com/how_it_works_22.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
            <div class="md:max-w-4xl md:mx-auto px-4 text-lg   ">
              <p class="mt-2 mx-8 py-2">
                Commonly Odd is a trivia game that can be played solo or in
                groups (up to 10 teams). There are three game modes: Quick Game,
                Quick Game + and Competitive. Quick Game and Quick Game + is
                ideal for solo casual play, while Competitive is perfect for
                groups who enjoy a challenge.
              </p>
              <div class="text-2xl font-bold text-center mt-4">Game Modes</div>

              <ul class="list-disc pl-8 mt-2">
                <li class="py-2">
                  <span class="font-bold">Quick Game:</span> Ideal for solo
                  players. No setup required. This mode has fast rounds and
                  allows manual selection to override pre-set time set per
                  round.
                </li>
                <li class="py-2">
                  <span class="font-bold">Quick Game +:</span> All of Quick Game
                  except that session starter must set time per round.
                </li>
                <li class="py-2">
                  <span class="font-bold">Competitive:</span> Ideal for group
                  play, no manual selection, target score and number of teams
                  must be set, can also be played solo.
                </li>
              </ul>

              <div class="text-2xl font-bold text-center mt-4">
                Setting Up the Game
              </div>
              <ul class="list-disc pl-8 mt-2">
                <li class="py-2">
                  <span class="font-bold">Session Creation:</span> The session
                  starter sets up the game session. For Competitive games, they
                  select the number of participating teams and the total score
                  goal. For Quick Game +, only the time per round needs to be
                  set.
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
                Winning the Game
              </div>
              <div class="overflow-x-auto relative shadow-md sm:rounded-lg">
                <table class="w-full text-md  ">
                  <caption class="p-5 text-xl font-semibold text-center  ">
                    Competitive Game Scoring
                  </caption>
                  <thead class="text-base   uppercase  ">
                    <tr>
                      <th scope="col" class="py-3 px-6">
                        Points
                      </th>
                      <th scope="col" class="py-3 px-6">
                        Odd
                      </th>
                      <th scope="col" class="py-3 px-6">
                        Reason for Commonality
                      </th>
                    </tr>
                  </thead>
                  <tbody class="text-center text-base">
                    <tr class=" ">
                      <td class="py-4 px-6 text-xl">2</td>
                      <td class="py-4 px-6">
                        <CheckCircleOutline
                          fontSize="large"
                          sx={{ color: "#4ade80" }}
                        />
                      </td>
                      <td class="py-4 px-6">
                        <CheckCircleOutline
                          fontSize="large"
                          sx={{ color: "#4ade80" }}
                        />
                      </td>
                    </tr>
                    <tr class=" ">
                      <td class="py-4 px-6 text-xl">1.5</td>
                      <td class="py-4 px-6">
                        <CheckCircleOutline
                          fontSize="large"
                          sx={{ color: "#4ade80" }}
                        />
                      </td>
                      <td class="py-4 px-6">
                        <CheckCircleOutline
                          fontSize="large"
                          sx={{ color: "#fde047" }}
                        />
                      </td>
                    </tr>
                    <tr class=" ">
                      <td class="py-4 px-6 text-xl">1</td>
                      <td class="py-4 px-6">
                        <CheckCircleOutline
                          fontSize="large"
                          sx={{ color: "#4ade80" }}
                        />
                      </td>
                      <td class="py-4 px-6">
                        <CancelOutlined
                          fontSize="large"
                          sx={{ color: "#f87171" }}
                        />
                      </td>
                    </tr>
                    <tr class=" ">
                      <td class="py-4 px-6 text-xl">0</td>
                      <td class="py-4 px-6">
                        <CancelOutlined
                          fontSize="large"
                          sx={{ color: "#f87171" }}
                        />
                      </td>
                      <td class="py-4 px-6">
                        <CancelOutlined
                          fontSize="large"
                          sx={{ color: "#f87171" }}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="mt-4 flex items-center justify-center text-center">
                  <CheckCircleOutline
                    fontSize="large"
                    sx={{ color: "#fde047" }}
                  />
                  = Partially Correct
                </div>
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
                  <span class="font-bold">Time Constraint:</span> Depending on
                  what the session starter sets, players have a limited time to
                  answer each question.
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
                  <span class="font-bold">Time Limit:</span> The session starter
                  sets the time limit for each round prior to game commencement.
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
