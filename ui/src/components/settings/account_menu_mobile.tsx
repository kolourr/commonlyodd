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
  Menu,
  MenuOutlined,
  MoreVertOutlined,
  LoginOutlined,
  StartOutlined,
  HighlightOffOutlined,
  VideogameAssetOffOutlined,
  VideogameAssetOutlined,
} from "@suid/icons-material";
import { checkAuth } from "../auth_payments_landing/use_auth";
import { TransitionProps } from "@suid/material/transitions";
import EndSessionLogout from "./endsession_logout";
import { handleClickOpenEndGameSession } from "../game/end_game_session";
import { stripePortal } from "../auth_payments_landing/stripe_portal";
import DeleteAccount from "./delete_account";
import { useLocation, useNavigate } from "solid-app-router";
import { fetchSubStatus } from "../auth_payments_landing/user";
import LightsUp from "./lights_up";
import "./styles.css";
import { create } from "domain";
import { sendMessage } from "../game/start_game";

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

export default function AccountMenuMobile() {
  const [isAuthenticated, setIsAuthenticated] = createSignal(false);
  const [openLogout, setOpenLogout] = createSignal(false);
  const [openDeleteAccount, setOpenDeleteAccount] = createSignal(false);
  const location = useLocation();
  const [subscriptionStatus, { refetch: refetchSubStatus }] =
    createResource(fetchSubStatus);
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = createSignal(false);
  const toggleMenu = () => setIsOpen(!isOpen());
  const [gameInSession, setGameInSession] = createSignal(false);
  const [openLeaveGame, setOpenLeaveGame] = createSignal(false);
  const [goToDashboard, setGoToDashboard] = createSignal(false);
  const [goToRules, setGoToRules] = createSignal(false);
  const [goToHome, setGoToHome] = createSignal(false);
  const [goToLogin, setGoToLogin] = createSignal(false);
  const [goToStripePortal, setGoToStripePortal] = createSignal(false);

  const openCloseMenu = () => {
    return (
      <>
        <Show when={!isOpen()}>
          <svg
            width="25"
            height="25"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M1.5 3C1.22386 3 1 3.22386 1 3.5C1 3.77614 1.22386 4 1.5 4H13.5C13.7761 4 14 3.77614 14 3.5C14 3.22386 13.7761 3 13.5 3H1.5ZM1 7.5C1 7.22386 1.22386 7 1.5 7H13.5C13.7761 7 14 7.22386 14 7.5C14 7.77614 13.7761 8 13.5 8H1.5C1.22386 8 1 7.77614 1 7.5ZM1 11.5C1 11.2239 1.22386 11 1.5 11H13.5C13.7761 11 14 11.2239 14 11.5C14 11.7761 13.7761 12 13.5 12H1.5C1.22386 12 1 11.7761 1 11.5Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </Show>
        <Show when={isOpen()}>
          <svg
            width="25"
            height="25"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M7.49999 3.09998C7.27907 3.09998 7.09999 3.27906 7.09999 3.49998C7.09999 3.72089 7.27907 3.89998 7.49999 3.89998H14.5C14.7209 3.89998 14.9 3.72089 14.9 3.49998C14.9 3.27906 14.7209 3.09998 14.5 3.09998H7.49999ZM7.49998 5.1C7.27907 5.1 7.09998 5.27908 7.09998 5.5C7.09998 5.72091 7.27907 5.9 7.49998 5.9H14.5C14.7209 5.9 14.9 5.72091 14.9 5.5C14.9 5.27908 14.7209 5.1 14.5 5.1H7.49998ZM7.1 7.5C7.1 7.27908 7.27909 7.1 7.5 7.1H14.5C14.7209 7.1 14.9 7.27908 14.9 7.5C14.9 7.72091 14.7209 7.9 14.5 7.9H7.5C7.27909 7.9 7.1 7.72091 7.1 7.5ZM7.49998 9.1C7.27907 9.1 7.09998 9.27908 7.09998 9.5C7.09998 9.72091 7.27907 9.9 7.49998 9.9H14.5C14.7209 9.9 14.9 9.72091 14.9 9.5C14.9 9.27908 14.7209 9.1 14.5 9.1H7.49998ZM7.09998 11.5C7.09998 11.2791 7.27907 11.1 7.49998 11.1H14.5C14.7209 11.1 14.9 11.2791 14.9 11.5C14.9 11.7209 14.7209 11.9 14.5 11.9H7.49998C7.27907 11.9 7.09998 11.7209 7.09998 11.5ZM2.5 9.25003L5 6.00003H0L2.5 9.25003Z"
              fill="currentColor"
              fill-rule="evenodd"
              clip-rule="evenodd"
            ></path>
          </svg>
        </Show>
      </>
    );
  };

  const closeMenu = () => setIsOpen(false);
  const handleDocumentClick = (event) => {
    const menuElement = document.getElementById("hamburger-menu");
    if (!menuElement.contains(event.target)) {
      closeMenu();
    }
  };

  createEffect(() => {
    if (isOpen()) {
      document.addEventListener("click", handleDocumentClick);
      onCleanup(() =>
        document.removeEventListener("click", handleDocumentClick)
      );
    }
  });

  const hamburgerMenuNoAuth = () => {
    return (
      <>
        <Show when={!subscriptionStatus() && !isAuthenticated()}>
          <Show when={location.pathname !== "/game"}>
            <Show when={isOpen()}>
              <div class="absolute w-full left-0 top-20   bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 shadow-md p-4 z-10 rounded-md  ">
                <div
                  onClick={handleLogin}
                  class="  flex  items-center  justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <LoginOutlined fontSize="small" class="mr-2  " />
                  Log in
                </div>
                <div
                  onClick={handleLogin}
                  class="flex   items-center justify-start py-2 px-2 text-lg text-white hover:bg-slate-800 shadow-sm shadow-gray-50  "
                >
                  <StartOutlined fontSize="small" class="mr-2" /> Get Started
                </div>
              </div>
            </Show>
          </Show>
          <Show when={location.pathname === "/game"}>
            <Show when={isOpen()}>
              <div class="absolute w-full left-0 top-20   bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 shadow-md p-4 z-10 rounded-md  ">
                <div
                  onClick={handleClickOpenEndGameSession}
                  class="  flex  items-center justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <HighlightOffOutlined fontSize="medium" class="mr-2  " />
                  End Game
                </div>
                <div
                  onClick={handleLogin}
                  class="flex   items-center justify-start py-2 px-2 text-lg text-white hover:bg-slate-800 shadow-sm shadow-gray-50  "
                >
                  <StartOutlined fontSize="medium" class="mr-2" /> Get Started
                </div>
              </div>
            </Show>
          </Show>
        </Show>

        <Show when={isAuthenticated() && !subscriptionStatus()}>
          <Show when={location.pathname !== "/game"}>
            <Show when={isOpen()}>
              <div class="absolute w-full left-0 top-20   bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 shadow-md p-4 z-10 rounded-md  ">
                <a
                  onClick={handlePricingPlans}
                  class="flex    items-center justify-start py-2 px-2 text-lg text-white hover:bg-slate-800 shadow-sm shadow-gray-50  "
                >
                  <StartOutlined fontSize="medium" class="mr-2" /> Start Trial
                </a>
                <a
                  onClick={handleDashboardNavigate}
                  class="  flex  items-center  justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <HomeOutlined fontSize="medium" class="mr-2  " />
                  Dashboard
                </a>
                <a
                  onClick={handleNavigateRules}
                  class="  flex  items-center  justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <NotesRounded fontSize="medium" class="mr-2  " />
                  Rules
                </a>
                <a
                  onClick={handleOpenDeleteAccount}
                  class="  flex  items-center  justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <DeleteForeverOutlined fontSize="medium" class="mr-2  " />
                  Delete Account
                </a>
                <div
                  onClick={handleClickOpenLogout}
                  class="  flex   items-center justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <LogoutOutlined fontSize="medium" class="mr-2  " />
                  Logout
                </div>
              </div>
            </Show>
          </Show>
          <Show when={location.pathname === "/game"}>
            <Show when={isOpen()}>
              <div class="absolute w-full left-0 top-20   bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 shadow-md p-4 z-10 rounded-md  ">
                <a
                  onClick={handlePricingPlans}
                  class="flex  items-center justify-start py-2 px-2 text-lg text-white hover:bg-slate-800 shadow-sm shadow-gray-50  "
                >
                  <StartOutlined fontSize="medium" class="mr-2" /> Start Trial
                </a>
                <a
                  onClick={handleDashboardNavigate}
                  class="  flex  items-center  justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <HomeOutlined fontSize="medium" class="mr-2  " />
                  Dashboard
                </a>
                <a
                  onClick={handleNavigateRules}
                  class="  flex  items-center  justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <NotesRounded fontSize="medium" class="mr-2  " />
                  Rules
                </a>
                <a
                  onClick={handleOpenDeleteAccount}
                  class="  flex  items-center  justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <DeleteForeverOutlined fontSize="medium" class="mr-2  " />
                  Delete Account
                </a>
                <div
                  onClick={handleClickOpenEndGameSession}
                  class="  flex  items-center justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <HighlightOffOutlined fontSize="medium" class="mr-2  " />
                  End Game
                </div>
                <div
                  onClick={handleClickOpenLogout}
                  class="  flex  items-center justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <LogoutOutlined fontSize="medium" class="mr-2  " />
                  Logout
                </div>
              </div>
            </Show>
          </Show>
        </Show>
        <Show when={isAuthenticated() && subscriptionStatus()}>
          <Show when={location.pathname !== "/game"}>
            <Show when={isOpen()}>
              <div class="absolute w-full left-0 top-20   bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 shadow-md p-4 z-10 rounded-md  ">
                <a
                  onClick={handlePlayGame}
                  class="  flex  items-center  justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <VideogameAssetOutlined fontSize="medium" class="mr-2  " />
                  Play Game
                </a>
                <a
                  onClick={handleDashboardNavigate}
                  class="  flex  items-center  justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <HomeOutlined fontSize="medium" class="mr-2  " />
                  Dashboard
                </a>
                <a
                  onClick={handleStripePortal}
                  class="flex    items-center justify-start py-2 px-2 text-lg text-white hover:bg-slate-800 shadow-sm shadow-gray-50  "
                >
                  <CardMembershipOutlined fontSize="medium" class="mr-2" />{" "}
                  Subscription
                </a>
                <a
                  onClick={handleNavigateRules}
                  class="  flex  items-center  justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <NotesRounded fontSize="medium" class="mr-2  " />
                  Rules
                </a>
                <a
                  onClick={handleOpenDeleteAccount}
                  class="  flex  items-center  justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <DeleteForeverOutlined fontSize="medium" class="mr-2  " />
                  Delete Account
                </a>
                <div
                  onClick={handleClickOpenLogout}
                  class="  flex   items-center justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <LogoutOutlined fontSize="medium" class="mr-2  " />
                  Logout
                </div>
              </div>
            </Show>
          </Show>
          <Show when={location.pathname === "/game"}>
            <Show when={isOpen()}>
              <div class="absolute w-full left-0 top-20   bg-gradient-to-r from-slate-900 via-zinc-950 to-slate-900 shadow-md p-4 z-10 rounded-md  ">
                <a
                  onClick={handleDashboardNavigate}
                  class="  flex  items-center  justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <HomeOutlined fontSize="medium" class="mr-2  " />
                  Dashboard
                </a>
                <a
                  onClick={handleStripePortal}
                  class="flex    items-center justify-start py-2 px-2 text-lg text-white hover:bg-slate-800 shadow-sm shadow-gray-50  "
                >
                  <CardMembershipOutlined fontSize="medium" class="mr-2" />{" "}
                  Subscription
                </a>
                <a
                  onClick={handleNavigateRules}
                  class="  flex  items-center  justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <NotesRounded fontSize="medium" class="mr-2  " />
                  Rules
                </a>

                <div
                  onClick={handleClickOpenEndGameSession}
                  class="  flex  items-center justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <HighlightOffOutlined fontSize="medium" class="mr-2  " />
                  End Session
                </div>
                <div
                  onClick={handleClickOpenLogout}
                  class="  flex   items-center justify-start text-lg  py-2 px-2   text-white hover:bg-slate-800 shadow-sm shadow-gray-50 "
                >
                  <LogoutOutlined fontSize="medium" class="mr-2  " />
                  Logout
                </div>
              </div>
            </Show>
          </Show>
        </Show>
      </>
    );
  };

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

  const handlePricingPlans = () => {
    window.location.href = `/user#pricingplans`;
  };

  const handlePlayGame = () => {
    window.location.href = `/game`;
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

  const titleLogo = () => {
    return (
      <>
        <Show when={location.pathname === "/game"}>
          <a onClick={handleHome}>
            <div class="flex flex-row justify-center  text-center  items-center">
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/100x100"
                alt="logo"
                width={40}
                height={40}
              />
              <span class="pr-2 text-4xl text-gray-100 font-bold">
                Commonly
              </span>
              <LightsUp />
            </div>
          </a>
        </Show>
        <Show when={location.pathname !== "/game"}>
          <a onClick={handleHome}>
            <div class="flex flex-row justify-center  text-center  items-center">
              <img
                src="https://imagedelivery.net/CSGzrEc723GAS-rv6GanQw/3fe68c0e-a825-43e6-41ca-dec53b671e00/100x100"
                alt="logo"
                width={40}
                height={40}
              />
              <span class="pr-2 text-4xl text-gray-100 font-bold">
                Commonly
              </span>
              <LightsUp />
            </div>
          </a>
        </Show>
      </>
    );
  };

  return (
    <>
      <div class="mt-4 mb-4 flex flex-row justify-center">
        <div class="flex justify-start items-center w-1/12  ">
          <button onClick={toggleMenu}>{openCloseMenu()}</button>
          <div id="hamburger-menu">{hamburgerMenuNoAuth()}</div>
        </div>
        <div class="w-11/12">{titleLogo()}</div>
      </div>

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
                  Delete Account Forever
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
