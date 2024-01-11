import { createSignal } from "solid-js";
import { Button } from "@suid/material";
import {
  ContentCopy,
  SportsEsportsOutlined,
  RuleOutlined,
  SearchOutlined,
  CancelOutlined,
  PrivacyTipOutlined,
  SportsScoreOutlined,
} from "@suid/icons-material";
import InfoModal from "./info_modal";
import { gameRules } from "~/public/data/gamerules";
import { faqTerminology } from "~/public/data/faq";
import { legalDocuments } from "~/public/data/legal";
import StartSession from "./start_session";
import CopyLink from "./start_session/copy_link";
import EndGameSession from "./end_game_session";

export const [sessionLink, setSessionLink] = createSignal(
  "https://co.com/click-to-start"
);

export default function Game() {
  const [timer, setTimer] = createSignal("00:00");
  const [showRulesModal, setShowRulesModal] = createSignal(false);
  const [showFAQModal, setShowFAQModal] = createSignal(false);
  const [showLegalModal, setShowLegalModal] = createSignal(false);

  return (
    <div class="flex flex-col h-screen md:max-w-5xl lg:max-w-7xl mx-auto">
      {/* Header */}
      <div class="bg-slate-50 text-center py-4">
        <h1 class="text-3xl font-bold">Commonly Odd</h1>
      </div>

      {/* Bottom Section */}
      <div class="flex flex-grow">
        <div class="flex flex-col w-2/12 justify-start bg-slate-50">
          <div class="flex flex-col items-center justify-start space-y-20 ">
            <Button>Start Game</Button>
          </div>
          <div class="flex flex-col space-y-20 items-center justify-center pt-44">
            <InfoModal
              title={gameRules.title}
              content={gameRules.content}
              icon={<RuleOutlined fontSize="large" />}
              openModal={showRulesModal()}
              setOpenModal={setShowRulesModal}
            />
            <InfoModal
              title={faqTerminology.title}
              content={faqTerminology.content}
              icon={<SportsEsportsOutlined fontSize="large" />}
              openModal={showFAQModal()}
              setOpenModal={setShowFAQModal}
            />
            <Button sx={{ bgcolor: "#fecdd3", color: "#db2777" }}>
              <SearchOutlined fontSize="large" />
            </Button>
          </div>
        </div>
        {/* flex-col lg:flex-row items-center lg:space-x-4 */}
        <div class="flex w-11/12 flex-col bg-slate-100 ">
          <div class="flex flex-row items-center justify-center bg-slate-50   ">
            <CopyLink />
            <input
              type="text"
              class="border p-2 rounded ml-2 w-full md:w-auto lg:w-5/12"
              readOnly
              value={sessionLink()}
            />
          </div>

          <div class="flex flex-row items-center justify-center  pt-12   ">
            <StartSession />
          </div>

          <div class="flex flex-col lg:flex-row justify-center items-center lg:space-x-4 lg:pt-20  ">
            <div class="py-4">
              <p class="text-center">Obj1</p>
              <img src="https://via.placeholder.com/400" alt="Obj1" />
            </div>
            <div class="py-4">
              <p class="text-center">Obj2</p>
              <img src="https://via.placeholder.com/400" alt="Obj2" />
            </div>
            <div class="py-4">
              <p class="text-center">Obj3</p>
              <img src="https://via.placeholder.com/400" alt="Obj3" />
            </div>
          </div>
        </div>
        <div class="flex flex-col w-2/12 justify-start bg-slate-50">
          <div class="flex flex-col items-center justify-start space-y-20 ">
            <div class="text-center">
              <p class="text-lg">Timer</p>
              <p class="text-lg font-bold">{timer()}</p>
            </div>
          </div>
          <div class="flex flex-col space-y-20 items-center justify-center pt-40">
            <EndGameSession />
            <InfoModal
              title={legalDocuments.title}
              content={legalDocuments.content}
              icon={<PrivacyTipOutlined fontSize="large" />}
              openModal={showLegalModal()}
              setOpenModal={setShowLegalModal}
            />
            <Button sx={{ bgcolor: "#fecdd3", color: "#db2777" }}>
              <SportsScoreOutlined fontSize="large" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
