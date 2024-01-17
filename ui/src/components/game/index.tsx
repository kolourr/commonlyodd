import { createSignal } from "solid-js";
import { Button } from "@suid/material";
import {
  SportsEsportsOutlined,
  RuleOutlined,
  SearchOutlined,
  PrivacyTipOutlined,
  SportsScoreOutlined,
  Score,
} from "@suid/icons-material";
import InfoModal from "./info_modal";
import { gameRules } from "~/public/data/gamerules";
import { faqTerminology } from "~/public/data/faq";
import { legalDocuments } from "~/public/data/legal";
import StartSession from "./start_session";
import CopyLink from "./start_session/copy_link";
import EndGameSession from "./end_game_session";
import StartGame, { objectsImages } from "./start_game";
import GameImages from "./start_game/images";
import Timer from "./start_game/timer";

export const [sessionLink, setSessionLink] = createSignal(
  "https://co.com/click-to-start"
);

export default function Game() {
  const [showRulesModal, setShowRulesModal] = createSignal(false);
  const [showFAQModal, setShowFAQModal] = createSignal(false);
  const [showLegalModal, setShowLegalModal] = createSignal(false);

  return (
    <div class="flex flex-col h-screen md:max-w-5xl lg:max-w-7xl mx-auto">
      <div class="bg-slate-50 text-center py-4">
        <h1 class="text-3xl font-bold">Commonly Odd</h1>
      </div>

      <div class="flex flex-grow">
        <div class="flex flex-col w-2/12 justify-start bg-slate-50">
          <div class="flex flex-col items-center justify-start space-y-20 ">
            {" "}
            <StartSession />
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
            <StartGame />
          </div>
          <GameImages gameData={objectsImages()} />
        </div>
        <div class="flex flex-col w-2/12 justify-start bg-slate-50">
          <Timer />
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
