import {
  Slide,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogContentText,
  DialogActions,
  Button,
} from "@suid/material";
import {
  JSXElement,
  Show,
  createEffect,
  createResource,
  createSignal,
  onCleanup,
  onMount,
} from "solid-js";
import {
  NotesRounded,
  LogoutOutlined,
  HomeOutlined,
  CardMembershipOutlined,
  DeleteForeverOutlined,
} from "@suid/icons-material";
import { checkAuth } from "../auth_payments_landing/use_auth";
import { TransitionProps } from "@suid/material/transitions";
import EndSessionLogout from "./endsession_logout";
import { handleClickOpenEndGameSession } from "../game/end_game_session";
import { stripePortal } from "../auth_payments_landing/stripe_portal";
import DeleteAccount from "./delete_account";
import { useLocation, useNavigate } from "solid-app-router";
import LightsUp from "./lights_up";
import { sendMessage } from "../game/start_game";
import {
  refetchSubStatus,
  subscriptionStatus,
} from "../auth_payments_landing/user";

const Transition = function Transition(
  props: TransitionProps & {
    children: JSXElement;
  }
) {
  return <Slide direction="down" {...props} />;
};

const dialogTextStyle = {
  color: "#f9fafb",
};

const BASE_API = import.meta.env.CO_API_URL;

export default function AccountMenu() {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [openLogout, setOpenLogout] = createSignal(false);
  const [openDeleteAccount, setOpenDeleteAccount] = createSignal(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [gameInSession, setGameInSession] = createSignal(false);
  const [openLeaveGame, setOpenLeaveGame] = createSignal(false);
  const [goToDashboard, setGoToDashboard] = createSignal(false);
  const [goToRules, setGoToRules] = createSignal(false);
  const [goToHome, setGoToHome] = createSignal(false);
  const [goToStripePortal, setGoToStripePortal] = createSignal(false);
  const [goToLogin, setGoToLogin] = createSignal(false);

  //Logout
  const handleClickOpenLogout = () => {
    setOpenLogout(true);
  };
  const handleCloseLogout = () => {
    setOpenLogout(false);
  };

  //Delete Account
  const handleOpenDeleteAccount = () => {
    setOpenDeleteAccount(true);
  };
  const handleCloseDeleteAccount = () => {
    setOpenDeleteAccount(false);
  };

  const handleOpenLeaveGame = () => {
    setOpenLeaveGame(true);
  };
  const handleCloseLeaveGame = () => {
    setOpenLeaveGame(false);
  };

  // Here
  const handleDashboardNavigate = () => {
    if (location.pathname.startsWith("/game") && gameInSession()) {
      setGoToDashboard(true);
      setOpenLeaveGame(true);
    } else {
      window.location.href = `/user`;
    }
  };

  // Here
  const handleNavigateRules = () => {
    if (location.pathname.startsWith("/game") && gameInSession()) {
      setGoToRules(true);
      setOpenLeaveGame(true);
    } else {
      window.location.href = `/rules`;
    }
  };

  // Here
  const handleHome = () => {
    if (location.pathname.startsWith("/game") && gameInSession()) {
      setGoToHome(true);
      setOpenLeaveGame(true);
    } else {
      window.location.href = `/`;
    }
  };

  // Here
  const handleStripePortal = () => {
    if (location.pathname.startsWith("/game") && gameInSession()) {
      setGoToStripePortal(true);
      setOpenLeaveGame(true);
    } else {
      stripePortal();
    }
  };

  const handleLogin = () => {
    if (location.pathname.startsWith("/game") && gameInSession()) {
      setGoToLogin(true);
      setOpenLeaveGame(true);
    } else {
      window.location.href = `${BASE_API}/login`;
    }
  };

  const handleLeaveGame = () => {
    setOpenLeaveGame(false);
    const sessionUuidFromStorage = localStorage.getItem("session_uuid");

    if (sessionUuidFromStorage) {
      sendMessage({ game_state: "end" });
      localStorage.removeItem("session_uuid");
      localStorage.removeItem("starter_token");
      localStorage.removeItem("type");
      localStorage.removeItem("total_score");
      localStorage.removeItem("user_score");
    }

    if (goToDashboard()) {
      window.location.href = "/user";
      setGoToDashboard(false);
    } else if (goToRules()) {
      window.location.href = "/rules";
      setGoToRules(false);
    } else if (goToHome()) {
      window.location.href = "/";
      setGoToHome(false);
    } else if (goToStripePortal()) {
      stripePortal();
      setGoToStripePortal(false);
    } else if (goToLogin()) {
      window.location.href = `${BASE_API}/login`;
      setGoToLogin(false);
    }
  };

  const handlePricingPlans = () => {
    window.location.href = `/user#pricingplans`;
  };

  const handlePlayGame = () => {
    window.location.href = `/game`;
  };

  createEffect(async () => {
    const auth = await checkAuth();
    setIsAuthenticated(auth);
  });

  // Polling function to check session_uuid from local storage and URL parameters
  const pollSessionUuid = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionUuidFromUrl = urlParams.get("session");
    const sessionUuidFromStorage = localStorage.getItem("session_uuid");
    const sessionUuid = sessionUuidFromUrl || sessionUuidFromStorage;

    setGameInSession(sessionUuid !== null);
  };

  createEffect(() => {
    pollSessionUuid();
    const intervalId = setInterval(pollSessionUuid, 1000);
    onCleanup(() => {
      clearInterval(intervalId);
    });
  });

  onMount(() => {
    pollSessionUuid();
    setTimeout(() => {
      refetchSubStatus();
    }, 300);
  });

  return (
    <>
      <Show when={!subscriptionStatus() && !isAuthenticated()}>
        <Show when={location.pathname === "/"}>
          <div class="text-center    flex flex-row    mt-6 mb-24 ">
            <div
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              class="flex flex-row w-1/6 justify-start items-center font-bold  "
            >
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/100x100"
                alt="logo"
                width={40}
                height={40}
              />
              <span class="pr-2 text-4xl text-gray-100">Commonly</span>
              <LightsUp />
            </div>

            <div class="flex flex-row w-4/6 justify-center items-center text-gray-200 ml-32">
              <div class="flex flex-row items-center justify-center  text-xl">
                <a href="#howitworks">
                  <div class="px-4">How it Works</div>
                </a>
                <a href="#features">
                  <div class="px-4">Features</div>
                </a>
                <a href="#pricing-plans">
                  <div class="px-4">Explore Plans</div>
                </a>
              </div>
            </div>
            <div class="flex flex-row w-1/6 justify-end items-center">
              <div class="flex flex-row items-center justify-center ">
                <div class="text-lg mr-4 ">
                  <div onClick={handleLogin} style={{ cursor: "pointer" }}>
                    <div class="w-[60px] ">Log in</div>
                  </div>
                </div>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleLogin}
                    sx={{
                      width: "150px",
                      height: "45px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#1976D2",
                    }}
                  >
                    Get Started
                  </Button>{" "}
                </div>
              </div>
            </div>
          </div>
        </Show>
        <Show when={location.pathname !== "/" && location.pathname !== "/game"}>
          <div class="text-center    flex flex-row     mt-6   ">
            <div
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              class="flex flex-row w-1/6 justify-start items-center font-bold  "
            >
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/100x100"
                alt="logo"
                width={40}
                height={40}
              />
              <span class="pr-2 text-4xl text-gray-100">Commonly</span>
              <LightsUp />
            </div>

            <div class="w-4/6 "></div>
            <div class="flex flex-row w-1/6 justify-end items-center">
              <div class="flex flex-row items-center justify-center ">
                <div class="text-lg mr-4 ">
                  <div onClick={handleLogin} style={{ cursor: "pointer" }}>
                    <div class="w-[60px] ">Log in</div>
                  </div>
                </div>
                <div>
                  <Button
                    variant="contained"
                    onClick={handleLogin}
                    sx={{
                      width: "150px",
                      height: "45px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "white",
                      backgroundColor: "#1976D2",
                    }}
                  >
                    Get Started
                  </Button>{" "}
                </div>
              </div>
            </div>
          </div>
        </Show>
        <Show when={location.pathname === "/game"}>
          <div class="text-center    flex flex-row     mt-6   ">
            <div
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              class="flex flex-row w-1/6 justify-start items-center font-bold  "
            >
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/100x100"
                alt="logo"
                width={40}
                height={40}
              />
              <span class="pr-2 text-4xl text-gray-100">Commonly</span>
              <LightsUp />
            </div>

            <div class="w-4/6 "></div>
            <div class="flex flex-row w-1/6 justify-end items-center">
              <div class="flex flex-row items-center justify-center ">
                <div class="text-lg mr-4 ">
                  <div
                    onClick={handleClickOpenEndGameSession}
                    style={{ cursor: "pointer" }}
                    class="w-[100px] "
                  >
                    End Game
                  </div>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleLogin}
                    sx={{
                      width: "150px",
                      height: "45px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    sign Up
                  </Button>{" "}
                </div>
              </div>
            </div>
          </div>
        </Show>
      </Show>

      {/* Authentication but not subbed */}
      <Show when={isAuthenticated() && !subscriptionStatus()}>
        <Show when={location.pathname !== "/game"}>
          <div class="text-center    flex flex-row    mt-6 mb-6 ">
            <div
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              class="flex flex-row w-1/6 justify-start items-center font-bold  "
            >
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/100x100"
                alt="logo"
                width={40}
                height={40}
              />
              <span class="pr-2 text-4xl text-gray-100">Commonly</span>
              <LightsUp />
            </div>

            <div class="flex flex-row w-4/6 justify-center items-center text-gray-200 ml-32">
              <div class="   cursor-pointer relative group w-44">
                <div
                  onClick={handleDashboardNavigate}
                  class="text-xl   text-white hover:bg-slate-700 p-2 flex items-center"
                >
                  <HomeOutlined class="mr-2" />
                  Dashboard
                </div>
                <div class="absolute w-44 left-0 top-full hidden group-hover:block bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 shadow-md z-10">
                  <div
                    onClick={handleNavigateRules}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <NotesRounded class="mr-2" />
                    Rules
                  </div>
                  <div
                    onClick={handleOpenDeleteAccount}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <DeleteForeverOutlined class="mr-2" />
                    Delete Account
                  </div>
                  <div
                    onClick={handleClickOpenLogout}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <LogoutOutlined class="mr-2" />
                    Logout
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-row w-1/6 justify-end items-center">
              <div class="flex flex-row items-center justify-center ">
                <Button
                  variant="contained"
                  onClick={handlePricingPlans}
                  sx={{
                    width: "150px",
                    height: "45px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "white",
                  }}
                >
                  Start Trial
                </Button>{" "}
              </div>
            </div>
          </div>
        </Show>
        <Show when={location.pathname === "/game"}>
          <div class="text-center    flex flex-row    mt-6 mb-6 ">
            <div
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              class="flex flex-row w-1/6 justify-start items-center font-bold  "
            >
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/100x100"
                alt="logo"
                width={40}
                height={40}
              />
              <span class="pr-2 text-4xl text-gray-100">Commonly</span>
              <LightsUp />
            </div>

            <div class="flex flex-row w-4/6 justify-center items-center text-gray-200 ml-32">
              <div class="   cursor-pointer relative group w-44">
                <div
                  onClick={handleDashboardNavigate}
                  class="text-xl   text-white hover:bg-slate-700 p-2 flex items-center"
                >
                  <HomeOutlined class="mr-2" />
                  Dashboard
                </div>
                <div class="absolute w-44 left-0 top-full hidden group-hover:block bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 shadow-md z-10">
                  <div
                    onClick={handleNavigateRules}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <NotesRounded class="mr-2" />
                    Rules
                  </div>
                  <div
                    onClick={handleOpenDeleteAccount}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <DeleteForeverOutlined class="mr-2" />
                    Delete Account
                  </div>
                  <div
                    onClick={handleClickOpenLogout}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <LogoutOutlined class="mr-2" />
                    Logout
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-row w-1/6 justify-end items-center">
              <div class="flex flex-row items-center justify-center ">
                <div class="text-lg mr-4 ">
                  <a
                    onClick={handleClickOpenEndGameSession}
                    style={{ cursor: "pointer" }}
                  >
                    <div class="w-[100px] ">End Game</div>
                  </a>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleLogin}
                    sx={{
                      width: "150px",
                      height: "45px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    Start Trial
                  </Button>{" "}
                </div>
              </div>
            </div>
          </div>
        </Show>
      </Show>

      {/* Authentication but not subbed */}
      <Show when={isAuthenticated() && subscriptionStatus()}>
        <Show when={location.pathname !== "/game"}>
          <div class="text-center    flex flex-row    mt-6 mb-6 ">
            <div
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              class="flex flex-row w-1/6 justify-start items-center font-bold  "
            >
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/100x100"
                alt="logo"
                width={40}
                height={40}
              />
              <span class="pr-2 text-4xl text-gray-100">Commonly</span>
              <LightsUp />
            </div>

            <div class="flex flex-row w-4/6 justify-center items-center text-gray-200 ml-12">
              <div class="   cursor-pointer relative group w-44">
                <div
                  onClick={handleDashboardNavigate}
                  class="text-xl   text-white hover:bg-slate-700 p-2 flex items-center"
                >
                  <HomeOutlined class="mr-2" />
                  Dashboard
                </div>
                <div class="absolute w-44 left-0 top-full hidden group-hover:block bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 shadow-md z-10">
                  <div
                    onClick={handleNavigateRules}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <NotesRounded class="mr-2" />
                    Rules
                  </div>
                  <div
                    onClick={handleStripePortal}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <CardMembershipOutlined class="mr-2" />
                    Subscription
                  </div>
                  <div
                    onClick={handleOpenDeleteAccount}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <DeleteForeverOutlined class="mr-2" />
                    Delete Account
                  </div>
                  <div
                    onClick={handleClickOpenLogout}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <LogoutOutlined class="mr-2" />
                    Logout
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-row w-1/6 justify-end items-center">
              <div class="flex flex-row items-center justify-center ">
                <Button
                  variant="contained"
                  onClick={handlePlayGame}
                  sx={{
                    width: "150px",
                    height: "45px",
                    fontSize: "16px",
                    fontWeight: "bold",
                    color: "white",
                    backgroundColor: "#1976D2",
                  }}
                >
                  Play Game
                </Button>{" "}
              </div>
            </div>
          </div>
        </Show>
        <Show when={location.pathname === "/game"}>
          <div class="text-center    flex flex-row    mt-6 mb-6 ">
            <div
              onClick={handleHome}
              style={{ cursor: "pointer" }}
              class="flex flex-row w-1/6 justify-start items-center font-bold  "
            >
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/100x100"
                alt="logo"
                width={40}
                height={40}
              />
              <span class="pr-2 text-4xl text-gray-100">Commonly</span>
              <LightsUp />
            </div>

            <div class="flex flex-row w-4/6 justify-center items-center text-gray-200 ml-12">
              <div class="   cursor-pointer relative group w-44">
                <div
                  onClick={handleDashboardNavigate}
                  class="text-xl   text-white hover:bg-slate-700 p-2 flex items-center"
                >
                  <HomeOutlined class="mr-2" />
                  Dashboard
                </div>
                <div class="absolute w-44 left-0 top-full hidden group-hover:block bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 shadow-md z-10">
                  <div
                    onClick={handleNavigateRules}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <NotesRounded class="mr-2" />
                    Rules
                  </div>
                  <div
                    onClick={handleStripePortal}
                    class="  py-2 px-2 text-lg text-white hover:bg-slate-800 cursor-pointer flex items-center"
                  >
                    <CardMembershipOutlined class="mr-2" />
                    Subscription
                  </div>
                </div>
              </div>
            </div>
            <div class="flex flex-row w-1/6 justify-end items-center">
              <div class="flex flex-row items-center justify-center ">
                <div class="text-lg mr-4 ">
                  <a
                    onClick={handleClickOpenEndGameSession}
                    style={{ cursor: "pointer" }}
                  >
                    <div class="w-[150px] ">End Session</div>
                  </a>
                </div>
                <div>
                  <Button
                    variant="contained"
                    color="warning"
                    onClick={handleClickOpenLogout}
                    sx={{
                      width: "150px",
                      height: "45px",
                      fontSize: "16px",
                      fontWeight: "bold",
                      color: "white",
                    }}
                  >
                    Logout
                  </Button>{" "}
                </div>
              </div>
            </div>
          </div>
        </Show>
      </Show>

      <Dialog
        open={openLogout()}
        TransitionComponent={Transition}
        onClose={handleCloseLogout}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          sx: {
            backgroundImage:
              "linear-gradient(to right, #0f172a, #09090b, #0f172a)",
          },
        }}
      >
        <Show when={subscriptionStatus() || isAuthenticated}>
          <div class="flex flex-col justify-center items-center">
            <div>
              <DialogContent style={dialogTextStyle}>
                <DialogTitle
                  class="flex justify-center items-center"
                  style={dialogTextStyle}
                >
                  End Session and Logout
                </DialogTitle>
                <DialogContentText
                  id="alert-dialog-slide-description"
                  style={dialogTextStyle}
                >
                  Are you sure you want to end the session and logout? All game
                  data will be deleted.
                </DialogContentText>
              </DialogContent>
            </div>
            <div>
              <EndSessionLogout />
            </div>
          </div>
          <DialogActions style={dialogTextStyle}>
            <Button onClick={handleCloseLogout} style={dialogTextStyle}>
              Cancel
            </Button>
          </DialogActions>
        </Show>
      </Dialog>
      {/* Delete Account Dialog */}
      <Dialog
        open={openDeleteAccount()}
        TransitionComponent={Transition}
        onClose={handleCloseDeleteAccount}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          sx: {
            backgroundImage:
              "linear-gradient(to right, #0f172a, #09090b, #0f172a)",
          },
        }}
      >
        <Show when={isAuthenticated}>
          <div class="flex flex-col justify-center items-center">
            <div>
              <DialogContent style={dialogTextStyle}>
                <DialogTitle
                  class="flex justify-center items-center"
                  style={dialogTextStyle}
                >
                  ⚠️⚠️ Delete Account Forever ⚠️⚠️
                </DialogTitle>
                <DialogContentText
                  id="alert-dialog-slide-description"
                  style={dialogTextStyle}
                >
                  You will no longer have access to your account and all data
                  will be permanently deleted.
                </DialogContentText>
              </DialogContent>
            </div>
            <div class="flex justify-center items-center">
              <DeleteAccount />
            </div>
          </div>
          <DialogActions style={dialogTextStyle}>
            <Button onClick={handleCloseDeleteAccount} style={dialogTextStyle}>
              Cancel
            </Button>
          </DialogActions>
        </Show>
      </Dialog>

      {/* Leave game Confirmation */}
      <Dialog
        open={openLeaveGame()}
        TransitionComponent={Transition}
        onClose={handleCloseLeaveGame}
        disableBackdropClick={false}
        aria-describedby="alert-dialog-slide-description"
        PaperProps={{
          sx: {
            backgroundImage:
              "linear-gradient(to right, #0f172a, #09090b, #0f172a)",
          },
        }}
      >
        <div class="flex flex-col justify-center items-center">
          <div>
            <DialogContent style={dialogTextStyle}>
              <DialogTitle
                class="flex justify-center items-center"
                style={dialogTextStyle}
              >
                Sure you want to leave the game?
              </DialogTitle>
              <DialogContentText
                id="alert-dialog-slide-description"
                style={dialogTextStyle}
              >
                <div class="flex flex-col justify-center items-center">
                  <div class="mb-2">Game data will be lost. </div>
                  <div> You will have to start a new game. </div>
                </div>
              </DialogContentText>
            </DialogContent>
          </div>
        </div>
        <DialogActions style={dialogTextStyle}>
          <Button onClick={handleCloseLeaveGame} style={dialogTextStyle}>
            Cancel
          </Button>
          <Button
            onClick={handleLeaveGame}
            sx={{ color: "#f87171", fontWeight: "bold" }}
          >
            Yes, I completely understand
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
