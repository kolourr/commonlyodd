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
import InfoModal from "../game/info_modal";
import { gameRules } from "~/public/data/gamerules";
import { faqTerminology } from "~/public/data/faq";
import { legalDocuments } from "~/public/data/legal";
import TimesUp from "./times_up";

export default function Game() {
  const [timer, setTimer] = createSignal("00:00");
  const [sessionLink, setSessionLink] = createSignal(
    "commonlyodd.com/join?session=12345"
  );
  const [showRulesModal, setShowRulesModal] = createSignal(false);
  const [showFAQModal, setShowFAQModal] = createSignal(false);
  const [showLegalModal, setShowLegalModal] = createSignal(false);

  return (
    <div class="flex flex-col h-screen md:max-w-5xl lg:max-w-7xl mx-auto">
      {/* Header */}
      <div class="bg-slate-50 text-center py-4">
        <h1 class="text-3xl font-bold">Commonly Odd</h1>
      </div>

      {/* Main Section */}
      <div class="flex flex-row bg-slate-50">
        <div class="flex w-1/5 justify-center items-center">
          <Button size="large">Start Session</Button>
        </div>
        <div class="flex w-3/5 flex-row items-center justify-center">
          <ContentCopy
            onClick={() => navigator.clipboard.writeText(sessionLink())}
          />
          <input
            type="text"
            class="border p-2 rounded ml-2 w-full md:w-auto lg:w-5/12"
            readOnly
            value={sessionLink()}
          />
        </div>
        <div class="flex w-1/5 justify-center items-center">
          <div class="text-center">
            <p class="text-lg">Timer</p>
            <p class="text-lg font-bold">{timer()}</p>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div class="flex flex-grow">
        <div class="flex flex-col items-center w-2/12 pt-20 lg:pt-6 sm:justify-start lg:justify-center bg-slate-50">
          <div class="flex flex-col space-y-20 items-center">
            <Button sx={{ bgcolor: "#fecdd3", color: "#db2777" }}>
              <InfoModal
                title={gameRules.title}
                content={gameRules.content}
                icon={<RuleOutlined fontSize="large" />}
                openModal={showRulesModal()}
                setOpenModal={setShowRulesModal}
              />
            </Button>
            <Button sx={{ bgcolor: "#fecdd3", color: "#db2777" }}>
              <InfoModal
                title={faqTerminology.title}
                content={faqTerminology.content}
                icon={<SportsEsportsOutlined fontSize="large" />}
                openModal={showFAQModal()}
                setOpenModal={setShowFAQModal}
              />
            </Button>
            <Button sx={{ bgcolor: "#fecdd3", color: "#db2777" }}>
              <SearchOutlined fontSize="large" />
            </Button>
          </div>
        </div>
        <div class="flex w-11/12 flex-col lg:flex-row items-center lg:space-x-4 bg-slate-100">
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
        <div class="flex flex-col items-center w-2/12 pt-20 lg:pt-6 sm:justify-start lg:justify-center bg-slate-50">
          <div class="flex flex-col space-y-20 items-center">
            <Button sx={{ bgcolor: "#fecdd3", color: "#db2777" }}>
              <CancelOutlined fontSize="large" />
            </Button>
            <Button sx={{ bgcolor: "#fecdd3", color: "#db2777" }}>
              <InfoModal
                title={legalDocuments.title}
                content={legalDocuments.content}
                icon={<PrivacyTipOutlined fontSize="large" />}
                openModal={showLegalModal()}
                setOpenModal={setShowLegalModal}
              />
            </Button>
            <Button sx={{ bgcolor: "#fecdd3", color: "#db2777" }}>
              <SportsScoreOutlined fontSize="large" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
